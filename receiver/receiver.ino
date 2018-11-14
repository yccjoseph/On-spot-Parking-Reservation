#include <assert.h>
#include <FreeRTOS_ARM.h>
#include <IPAddress.h>
#include <PowerDueWiFi.h>

// update these
#define WIFI_SSID "PowerDue"
#define WIFI_PASS "powerdue"
#define SERVER_IP "172.29.95.130" // Joseph
// #define SERVER_IP "10.230.12.127" // Sissi
#define SERVER_PORT 9999
#define REDPIN A4

/*------------------------------------------------------------*/

#define DATALEN 1
char buf[DATALEN];

SemaphoreHandle_t semSense, semReport;
QueueHandle_t xQueue = NULL;

void sense(void * arg) {
  while(1) {
    int i = analogRead(REDPIN);
    SerialUSB.println(i);
    int val = (6762 / (i - 9)) - 4;
    //SerialUSB.println(val);
//    if (SerialUSB.available()) {
//      xSemaphoreTake(semSense, portMAX_DELAY);
//      String sense = SerialUSB.readString();
//      sense.trim();
//      char stat = NULL;
//      if (sense == "park") {
//        digitalWrite(6,HIGH);
//        digitalWrite(7,LOW);
//        digitalWrite(8,LOW);
//        stat = 'b';
//        xQueueSend(xQueue, &stat, portMAX_DELAY);
//        
//      } else if (sense == "leave") {
//        digitalWrite(6,LOW);
//        digitalWrite(7,HIGH);
//        digitalWrite(8,LOW);
//        stat = 'd';
//        xQueueSend(xQueue, &stat, portMAX_DELAY);
//      }
//      xSemaphoreGive(semReport);
//    } 
  }
}

void prepareBuffer(char stat){
  buf[0] = stat;
}

void WebStreamer(void * arg)
{ 
  while(1) { 
    xSemaphoreTake(semReport, portMAX_DELAY);
    
    char st;
    xQueueReceive(xQueue, &st, portMAX_DELAY);
    
    struct sockaddr_in serverAddr;  
    socklen_t socklen;
    memset(&serverAddr, 0, sizeof(serverAddr));
  
    serverAddr.sin_len = sizeof(serverAddr);
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(SERVER_PORT);
    inet_pton(AF_INET, SERVER_IP, &(serverAddr.sin_addr));
  
    int s = lwip_socket(AF_INET, SOCK_STREAM, 0);
    while(lwip_connect(s, (struct sockaddr *)&serverAddr, sizeof(serverAddr))){
      SerialUSB.println("Failed to connect to server");
      delay(100);
    }
    
    // send data
    prepareBuffer(st);
    lwip_write(s, buf, DATALEN);
    SerialUSB.println(buf[0]);
    
    // close socket after everything is done
    lwip_close(s);
    SerialUSB.println("socket closed");
    xSemaphoreGive(semSense);
  }
}

/*------------------------------------------------------------*/

void initPins(){
  // turn off LEDs
  pinMode(6,OUTPUT);
  pinMode(7,OUTPUT);
  pinMode(8,OUTPUT);
  turnOffLED();
}

void turnOffLED(){
  digitalWrite(6,LOW);
  digitalWrite(7,LOW);
  digitalWrite(8,LOW);
}

void onError(int errorCode){
  SerialUSB.print("Error received: ");
  SerialUSB.println(errorCode);
}

void onReady(){
  SerialUSB.println("Device ready");  
  SerialUSB.print("Device IP: ");
  SerialUSB.println(IPAddress(PowerDueWiFi.getDeviceIP()));  
  semSense = xSemaphoreCreateCounting(1, 1);
  semReport = xSemaphoreCreateCounting(1, 0);

  xTaskCreate(sense, "Sense", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
  xTaskCreate(WebStreamer, "WebStreamer", configMINIMAL_STACK_SIZE, NULL, 1, NULL);

  xQueue = xQueueCreate(1, 1);
}

void setup() {
  pinMode(REDPIN, OUTPUT);
  SerialUSB.begin(0);
  while(!SerialUSB);
  
  initPins();
  turnOffLED();

  PowerDueWiFi.init(WIFI_SSID, WIFI_PASS);
  PowerDueWiFi.setCallbacks(onReady, onError);
  
  vTaskStartScheduler();
  SerialUSB.println("Insufficient RAM");
  while(1);
}

void loop() {
  // not used in freertos
}
