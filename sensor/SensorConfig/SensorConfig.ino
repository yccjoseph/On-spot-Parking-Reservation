//#include <PowerDue.h>
#include <LoRa.h>
#include <SharpIR.h>

SharpIR sensor( SharpIR::GP2Y0A21YK0F, A0 );

#define FREQUENCY         920E6   // 915MHz
#define BANDWIDTH         125000  // 125kHz bandwidth
#define SLEEPTIME         4000    // 4 seconds
#define TX_POWER          20    // valid values are from 6 to 20
#define SPREADING_FACTOR  7    // valid values are 7, 8, 9 or 10


void setup() {
    Serial.begin(9600);
    while(!Serial);

    LoRa.setPins(22, 59, 51);
    LoRa.begin(FREQUENCY);
    LoRa.setTxPower(TX_POWER);
    LoRa.setSpreadingFactor(SPREADING_FACTOR);
    LoRa.setSignalBandwidth(BANDWIDTH);
    LoRa.setSyncWord(0x2b);
}

void loop() {

    int distance = sensor.getDistance(); //Calculate the distance in centimeters and store the value in a variable

    Serial.println( distance ); //Print the value to the serial monitor

    LoRa.beginPacket();
    LoRa.print('A');
//    LoRa.print();
    LoRa.endPacket();
    delay(500);
}
