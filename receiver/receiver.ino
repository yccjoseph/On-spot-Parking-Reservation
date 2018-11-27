#include <assert.h>
#include <FreeRTOS_ARM.h>
#include <IPAddress.h>
#include <PowerDueWiFi.h>
#include <LoRa.h>

#define WIFI_SSID "PowerDue"
#define WIFI_PASS "powerdue"
// #define SERVER_IP "172.29.95.130" // Joseph
#define SERVER_IP "10.230.12.127" // Sissi
#define SERVER_PORT 9999
#define REDPIN A4

// LoRa parameters
#define FREQUENCY         915E6
#define BANDWIDTH         125000
#define TX_POWER          20
#define SPREADING_FACTOR  7

/*------------------------------------------------------------*/

#define DATALEN 1
char buf[DATALEN];

SemaphoreHandle_t semReport, semLoRa;
QueueHandle_t xQueue = NULL;

void prepareBuffer(char stat){
  buf[0] = stat;
}

void LoRaRead(void * arg){
  while(1){
    SerialUSB.println("Prepare to receive LoRa......");
    xSemaphoreTake(semLoRa, portMAX_DELAY);
    while(1) {
      int packetSize = LoRa.parsePacket();
      
      if(packetSize){
          SerialUSB.println(packetSize);
          LoRa.receive();
          SerialUSB.print("Receive sensing status: ");
          
//          char status[packetSize];
          LoRa.read();
          LoRa.read();
          LoRa.read();
          LoRa.read();
          char status = LoRa.read();
          SerialUSB.println(status);
//          for (int i = 0; i < packetSize; i++) {
//            status[i] = LoRa.read();
//            
//            SerialUSB.println(status[i]);
//          }

          xQueueSend(xQueue, &status, portMAX_DELAY);
          xSemaphoreGive(semReport);
      }
    }
  }
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
    SerialUSB.print("Status sent to server: ");
    SerialUSB.println(buf[0]);
    
    // close socket after everything is done
    lwip_close(s);
    SerialUSB.println("socket closed");
    xSemaphoreGive(semLoRa);
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
  semLoRa = xSemaphoreCreateCounting(1, 1);
  semReport = xSemaphoreCreateCounting(1, 0);

  xTaskCreate(LoRaRead, "LoRaRead", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
  xTaskCreate(WebStreamer, "WebStreamer", configMINIMAL_STACK_SIZE, NULL, 1, NULL);

  xQueue = xQueueCreate(1, 1);
}

void setup() {
  pinMode(REDPIN, OUTPUT);
  SerialUSB.begin(0);
  while(!SerialUSB);
  
  initPins();
  turnOffLED();

  LoRa.setPins(22, 59, 51);
  LoRa.begin(FREQUENCY);
  LoRa.setTxPower(TX_POWER);
  LoRa.setSpreadingFactor(SPREADING_FACTOR);
  LoRa.setSignalBandwidth(BANDWIDTH);
//  LoRa.setSyncWord(0x2b);

  PowerDueWiFi.init(WIFI_SSID, WIFI_PASS);
  SerialUSB.println("here");
  PowerDueWiFi.setCallbacks(onReady, onError);
//  onReady();
  
  vTaskStartScheduler();
  SerialUSB.println("Insufficient RAM");
  while(1);
}

void loop() {
  // not used in freertos
}
