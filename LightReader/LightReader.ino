#include <Wire.h>


int ldr = A0;
int gy30Addr=0x23;
const float R=0.390;
const int C=411;
void BH1750_init(){
  Wire.beginTransmission(gy30Addr);
  Wire.write(0x10);
  Wire.endTransmission();
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(57600);
  Wire.begin();
  BH1750_init();
}

float BH1750_read(){
  byte r=0;
  byte buff[2];
  Wire.beginTransmission(gy30Addr);
  Wire.requestFrom(gy30Addr,2);
  while(Wire.available()){
    buff[r]=Wire.read();
    r++;
  }
  Wire.endTransmission();
  if(r!=2)return -1;
  float ret = ((buff[0]<<8)| buff[1])/1.2;
  return ret; 
}

void loop() {
  // put your main code here, to run repeatedly:
  int sensor = analogRead(ldr);
  Serial.print(sensor);
  float lux =BH1750_read();
  Serial.print(" ");
  Serial.print(lux);
  Serial.print(" ");
  lux=(5.0*C/(sensor/1024.0*5.0)-C)/R;
  Serial.println(lux);
  delay(1000);
}
