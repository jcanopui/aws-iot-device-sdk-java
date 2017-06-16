/*
   Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   Licensed under the Apache License, Version 2.0 (the "License").
   You may not use this file except in compliance with the License.
   A copy of the License is located at

    http://aws.amazon.com/apache2.0

   or in the "license" file accompanying this file. This file is distributed
   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
   express or implied. See the License for the specific language governing
   permissions and limitations under the License.
*/

#include <aws_iot_mqtt.h>
#include <aws_iot_version.h>
#include "aws_iot_config.h"
#include <Wire.h>

aws_iot_mqtt_client myClient;
char JSON_buf[100];
//int cnt = 0;
int rc = 1;
bool success_connect = false;
const int LED_OUT = 12;
const byte interruptPin = 7;
const char* OFF = "0";
int gy30Addr = 0x23;


bool print_log(const char* src, int code) {
  bool ret = true;
  if (code == 0) {
#ifdef AWS_IOT_DEBUG
    Serial.print(F("[LOG] command: "));
    Serial.print(src);
    Serial.println(F(" completed."));
#endif
    ret = true;
  }
  else {
#ifdef AWS_IOT_DEBUG
    Serial.print(F("[ERR] command: "));
    Serial.print(src);
    Serial.print(F(" code: "));
    Serial.println(code);
#endif
    ret = false;
  }
  Serial.flush();
  return ret;
}

boolean state = false;

const char* updateLedBool(boolean val) {
  if (val) {
    digitalWrite(LED_OUT, HIGH);
    state = true;
    return "1";
  } else {
    digitalWrite(LED_OUT, LOW);
    state = false;
    return OFF;
  }
}

const char* updateLed(char* led) {
  if (led[0] == '1') {
    digitalWrite(LED_OUT, HIGH);
    state = true;
    return led;
  } else {
    digitalWrite(LED_OUT, LOW);
    state = false;
    return OFF;
  }
}


void msg_callback_mqtt(char* src, unsigned int len, Message_status_t flag) {
  if (flag == STATUS_NORMAL) {
    // Get the whole delta section
    //Serial.println(src);
    memset(JSON_buf, 0, sizeof(JSON_buf));
    int i = 0;
    while (src[i + 33] != '"') {
      JSON_buf[i] = src[i + 33];
      i++;
    }
    Serial.println(JSON_buf);
    const char* ret = updateLed(JSON_buf);
  } else {
    Serial.print(F("[ERR] command: msg_callback_mqtt code: "));
    Serial.println(flag);
  }
}

void BH1750_init() {
  Wire.beginTransmission(gy30Addr);
  Wire.write(0x10);
  Wire.endTransmission();
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_OUT, OUTPUT);
  pinMode(interruptPin, INPUT_PULLUP);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  //while (!Serial);

  char curr_version[80];
  snprintf_P(curr_version, 80, PSTR("AWS IoT SDK Version(dev) %d.%d.%d-%s\n"), VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, VERSION_TAG);
  Serial.println(curr_version);

  if (print_log("setup", myClient.setup(AWS_IOT_CLIENT_ID, true, MQTTv311, true))) {
    if (print_log("config", myClient.config(AWS_IOT_MQTT_HOST, AWS_IOT_MQTT_PORT, AWS_IOT_ROOT_CA_PATH, AWS_IOT_PRIVATE_KEY_PATH, AWS_IOT_CERTIFICATE_PATH))) {
      if (print_log("connect", myClient.connect())) {
        success_connect = true;
        print_log("Register mqtt", myClient.subscribe("$aws/things/ArduinoYunLed/shadow/update/accepted", 1, msg_callback_mqtt));
        digitalWrite(LED_BUILTIN, HIGH);
        attachInterrupt(digitalPinToInterrupt( interruptPin), btnInt, FALLING);
        Wire.begin();
        BH1750_init();
        // Delay to make sure SUBACK is received, delay time could vary according to the server
        delay(2000);

      }
    }
  }
}
boolean btnTrigger = false;
void btnInt() {
  btnTrigger = true;
}

float BH1750_read() {
  byte r = 0;
  byte buff[2];
  Wire.beginTransmission(gy30Addr);
  Wire.requestFrom(gy30Addr, 2);
  while (Wire.available()) {
    buff[r] = Wire.read();
    r++;
  }
  Wire.endTransmission();
  if (r != 2)return -1;
  float ret = ((buff[0] << 8) | buff[1]) / 1.2;
  return ret;
}
int cnt = 0;

void loop() {
  if (success_connect) {
    if (myClient.yield()) {
      Serial.println(F("Yield failed."));
    }
    if (btnTrigger) {
      const char* ret = updateLedBool(!state);
      btnTrigger = false;
    }
    cnt = (cnt + 1) % 10;
    if (cnt == 0) {
      // Serial.print("GY-30: ");
      float lux = BH1750_read();
      // Serial.println(lux);

      int TA4 = lux;
      int DecTA4 = (lux * 100) - (TA4 * 100);

      sprintf(JSON_buf, "{\"id\":\"arduinoyunsensor\",\"region\":\"ZGZ\",\"thing1\":{\"id\":\"1\",\"value\":%02d.%02d}}", TA4, DecTA4);
      //Serial.println(JSON_buf);
      print_log("Mqtt publish", myClient.publish("topic/LightMeasure/arduinoyunsensor", JSON_buf, strlen(JSON_buf), 1, false));
    }
    if (myClient.yield()) {
      Serial.println(F("Yield failed."));
    }
    delay(100); // check for incoming delta per 100 ms
  }else{
    setup();
    delay(1000); 
  }
}
