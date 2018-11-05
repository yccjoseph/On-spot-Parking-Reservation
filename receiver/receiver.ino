#include <assert.h>
#include <FreeRTOS_ARM.h>
#include <IPAddress.h>
#include <PowerDueWiFi.h>

// update these
//#define WIFI_SSID "PowerDue"
//#define WIFI_PASS "powerdue"
//#define SERVER_IP "172.29.95.130" // Joseph
#define WIFI_SSID "CMUATINDIAN"
#define WIFI_PASS "961961961"
#define SERVER_IP "192.168.1.159"
#define SERVER_PORT 9999

/*------------------------------------------------------------*/

#define DATALEN 2
bool buf[DATALEN];

void prepareBuffer(bool empty, bool reserved){
  buf[0] = empty;
  buf[1] = reserved;
}

void WebStreamer(void * argument)
{ 
  while(1) { 
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
      //assert(false);
      delay(100);
    }
  
    prepareBuffer(true, true);
    while(1){
      // send data
      lwip_write(s, buf, DATALEN);
      SerialUSB.println(micros()-t);
      delay(1000);
    }
    // close socket after everything is done
    lwip_close(s);
    SerialUSB.println("socket closed");
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
  
  xTaskCreate(WebStreamer, "WebStreamer", configMINIMAL_STACK_SIZE, NULL, 1, NULL);
}

void setup() {
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
