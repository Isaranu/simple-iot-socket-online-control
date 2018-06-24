#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

void event(String payload, size_t length) {
  USE_SERIAL.println(payload);
  delay(200);
  webSocket.emit("iot", "\"nodemcu\"");
}

void led(String payload, size_t length){
  
  USE_SERIAL.println("payload : " + String(payload.toInt()));

  switch (payload.toInt()) {
  case 1:
    digitalWrite(2, LOW);
    break;
  case 0:
    digitalWrite(2, HIGH);
    break;
  default:
    break;
    /* Do nothing */  
  }
}

void setup() {

    pinMode(2, OUTPUT);
    digitalWrite(2, HIGH);
    
    USE_SERIAL.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    WiFiMulti.addAP("SSID", "PASSWORD");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    webSocket.on("response", event);
    webSocket.on("led", led);
    webSocket.begin("SERVER-IP-ADDRESS",3000);
}

void loop() {
    webSocket.loop();
}
