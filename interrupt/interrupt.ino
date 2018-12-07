/**
 * Author:Ab Kurk
 * version: 1.0
 * date: 24/01/2018
 * Description: 
 * This sketch is part of the beginners guide to putting your Arduino to sleep
 * tutorial. It is to demonstrate how to put your arduino into deep sleep and
 * how to wake it up.
 * Link To Tutorial http://www.thearduinomakerman.info/blog/2018/1/24/guide-to-arduino-sleep-mode
 */

#include <avr/sleep.h> //this AVR library contains the methods that controls the sleep modes
#include <SPI.h>
#include <RH_RF95.h>
#include <SharpIR.h>

SharpIR sensor( SharpIR::GP2Y0A21YK0F, A0 );

#define interruptPin 3 //Pin we are going to use to wake up the Arduino
#define RFM95_CS 10
#define RFM95_RST 9
#define RFM95_INT 2

// Change to 434.0 or other frequency, must match RX's freq!
#define RF95_FREQ 915.0

// Singleton instance of the radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);

char status = 'b';  // unoccupied



int previous;

void setup() {
  //**************LoRa Set Up****************
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);

  while (!Serial);
  Serial.begin(9600);

  // manual reset
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);

  while (!rf95.init()) {
    Serial.println("LoRa radio init failed");
    while (1);
  }
//  Serial.println("LoRa radio init OK!");

  // Defaults after init are 434.0MHz, modulation GFSK_Rb250Fd250, +13dbM
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("setFrequency failed");
    while (1);
  }
//  Serial.print("Set Freq to: "); Serial.println(RF95_FREQ);
  
  // Defaults after init are 434.0MHz, 13dBm, Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC on

  // The default transmitter power is 13dBm, using PA_BOOST.
  // If you are using RFM95/96/97/98 modules which uses the PA_BOOST transmitter pin, then 
  // you can set transmitter powers from 5 to 23 dBm:
  rf95.setTxPower(20, false);

  //*****************************************
  pinMode(LED_BUILTIN,OUTPUT);//We use the led on pin 13 to indecate when Arduino is A sleep
  pinMode(interruptPin,INPUT_PULLUP);//Set pin d2 to input using the buildin pullup resistor
  digitalWrite(LED_BUILTIN,HIGH);//turning LED on
  previous = digitalRead(4);
}

void loop() {
  Serial.println("IN LOOP");
  delay(5000);    //wait 5 seconds before going to sleep
  if (digitalRead(4) == HIGH){//no car parked
    if (previous != digitalRead(4)) {
      Serial.println("Send Status: No car parked");
      previous = digitalRead(4);
      //********************
      rf95.send("b", sizeof(char));
      //********************
    }
    //Serial.println("Send Status: No car parked");
    Serial.println("ready to sleep1 now");
    Going_To_SleepLOW();
  }
  delay(5000);
  if (digitalRead(4) == LOW) {
    // Serial.println("Send Status: Car parked");
    if (previous != digitalRead(4)) {
      Serial.println("Send Status: Car parked");
      previous = digitalRead(4);
      //********************
      rf95.send("a", sizeof(char));
      //********************

    }
    Serial.println("ready to sleep2 now");
  
    Going_To_SleepHIGH();
  }
}



void Going_To_SleepLOW(){
    sleep_enable();//Enabling sleep mode
    attachInterrupt(digitalPinToInterrupt(interruptPin), wakeUp, LOW);//attaching a interrupt to pin d2
    set_sleep_mode(SLEEP_MODE_PWR_DOWN);//Setting the sleep mode, in our case full sleep
    digitalWrite(LED_BUILTIN,LOW);//turning LED off
    delay(1000); //wait a second to allow the led to be turned off before going to sleep
    sleep_cpu();//activating sleep mode

    
    Serial.println("just woke upfromLOW!");//next line of code executed after the interrupt 
    digitalWrite(LED_BUILTIN,HIGH);//turning LED on
  }

void Going_To_SleepHIGH(){
    sleep_enable();//Enabling sleep mode
    attachInterrupt(digitalPinToInterrupt(interruptPin), wakeUp, HIGH);//attaching a interrupt to pin d2
    set_sleep_mode(SLEEP_MODE_PWR_DOWN);//Setting the sleep mode, in our case full sleep
    digitalWrite(LED_BUILTIN,LOW);//turning LED off
    delay(1000); //wait a second to allow the led to be turned off before going to sleep
    sleep_cpu();//activating sleep mode

    
    Serial.println("just woke up fromHIGH!");//next line of code executed after the interrupt 
    digitalWrite(LED_BUILTIN,HIGH);//turning LED on
  }

void wakeUp(){
  Serial.println("Interrrupt Fired");//Print message to serial monitor
  detachInterrupt(digitalPinToInterrupt(interruptPin)); //Removes the interrupt from pin 2;
  
//  if(digitalRead(interruptPin)==0){
//    Serial.println("Sleep Mode Disabled");
//    sleep_disable();//Disable sleep mode
//  }
  Serial.println("Sleep Mode Disabled");
  sleep_disable();//Disable sleep mode
  Serial.println("Here");
//  detachInterrupt(digitalPinToInterrupt(interruptPin)); //Removes the interrupt from pin 2;
//  
}
