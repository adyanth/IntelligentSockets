#include <ArduinoJson.h>
#include "WiFiPHP.h"
#include "ACS712.h"
#include <ESP8266WiFi.h>
#define BOARD_ID 1
#define N 100
const char *AP = "Sockets", *PSK = "sokets123";
int switchpins[4] = {5, 4, 0, 2}; 		// D1, D2, D3, D4
int socketpins[4] = {14, 12, 13, 15};	// D5, D6, D7, D8
int hwprev[4] = {HIGH, HIGH, HIGH, HIGH};
int hwstate[4] = {HIGH, HIGH, HIGH, HIGH};
int swprev[4] = {HIGH, HIGH, HIGH, HIGH};
int swstate[4] = {HIGH, HIGH, HIGH, HIGH};

typedef struct{
	unsigned short h;
	unsigned short m;
	unsigned short s;
} time_s;


void nothing() {
	delay(1);
}

void parseState(String res, int state[4]);
void parseTime(String json, String time);
bool timeStringWithin(String t, String f, String to);
void setOnTime();
void sendReading();

WiFiPHP c(10);
ACS712 sensor(ACS712_30A, A0);


void setup() {
	Serial.begin(9600);
	Serial.print("Init : ");
	WiFi.begin(AP, PSK);
	while (WiFi.status() != WL_CONNECTED) {
		delay(100);
		Serial.print(".");
	}
	for(int i = 0; i < 4; i++) {
		pinMode(switchpins[i], INPUT_PULLUP);
		pinMode(socketpins[i], OUTPUT);
		digitalWrite(socketpins[i], HIGH);
	}
	Serial.println(" : Done");
	sensor.calibrate();
}

void loop() {
	sendReading();
	// parseTime(c.getSQL("b1time"), c.getTime());
	//setOnTime();
	parseTime(c.getSQL("b1time"), c.getTime());
	parseState(c.getSQL("b1state"), swstate);
	for(int i = 0; i < 4; i++) {
		c._sw[i].state = hwstate[i] = digitalRead(switchpins[i]);
		if(hwstate[i] != hwprev[i]) {
			digitalWrite(socketpins[i], hwstate[i]);
			c.putSQL("b1state", false, i);
			Serial.println("Uploaded");
			hwprev[i] = swprev[i] = swstate[i] = hwstate[i];
		}
		if(swstate[i] != swprev[i]) {
			digitalWrite(socketpins[i], swstate[i]);
			Serial.println("Set from server.");
			swprev[i] = swstate[i];
		}
		Serial.println(String("Socket ") + (i + 1) + (digitalRead(socketpins[i]) == LOW ? " - ON":" - OFF"));
		yield();
	}
	// setOnTime();
	Serial.println("Done\n\n");
	// nothing();
}


void parseState(String res, int state[4]) {
	char json[200];
	res.toCharArray(json, 200);
	const size_t bufferSize = JSON_ARRAY_SIZE(4) + JSON_OBJECT_SIZE(1) + 4*JSON_OBJECT_SIZE(2) + 80;
	DynamicJsonBuffer jsonBuffer(bufferSize);
	JsonObject& root = jsonBuffer.parseObject(json);
	JsonArray& top = root["top"];
	for(int i = 0; i < 4; i++) {
		state[top[i]["switch"].as<int>()] = top[i]["state"].as<int>();
	}
}

void parseTime(String json, String time) {
	static bool set[4] = {false, false, false, false};
	time_s t_now, t_from, t_to;
	timeToStruct(time, t_now);
	const size_t bufferSize = JSON_ARRAY_SIZE(N) + JSON_OBJECT_SIZE(1) + N*JSON_OBJECT_SIZE(4) + 60*N;
	DynamicJsonBuffer jsonBuffer(bufferSize);
	JsonObject& root = jsonBuffer.parseObject(json);
	JsonArray& top = root["top"];
	for(auto x : top) {
		if(timeStringWithin(time, x["fromtime"].as<String>(), x["totime"].as<String>())) {
			if(!set[x["switch"].as<int>()] ) {
				digitalWrite(socketpins[x["switch"].as<int>()], LOW);
				c._sw[x["switch"].as<int>()].state = HIGH;
				c.putSQL("b1state", false, x["switch"].as<int>());
				set[x["switch"].as<int>()] = true;
				Serial.println("On from time");
			}
		}
		else if(set[x["switch"].as<int>()]) {
			digitalWrite(socketpins[x["switch"].as<int>()], HIGH);
			c._sw[x["switch"].as<int>()].state = HIGH;
			c.putSQL("b1state", false, x["switch"].as<int>());
			set[x["switch"].as<int>()] = false;
			Serial.println("Off from time");
		}
	}
}

bool timeStringWithin(String t, String f, String to) {
	time_s _t, _f, _to;
	timeToStruct(t, _t);
	timeToStruct(f, _f);
	timeToStruct(to, _to);
	int fr = _f.h*3600 + _f.m*60 + _f.s;
	int ti = _t.h*3600 + _t.m*60 + _t.s;
	int tot = _to.h*3600 + _to.m*60 + _to.s;
	if(ti >= fr && ti < tot)
		return true;
	else 
		return false;
}

void timeToStruct(String time, time_s &t) {
	t.h = time.substring(0, time.indexOf(":")).toInt(); 
	t.m = time.substring(time.indexOf(":")+1, time.lastIndexOf(":")).toInt();
	t.s = time.substring(time.lastIndexOf(":")+1).toInt();
}

void setOnTime() {
	static const unsigned long REFRESH_INTERVAL = 5000;//300000; // 5 min in ms
	static unsigned long lastRefreshTime = 0;
	if(millis() - lastRefreshTime >= REFRESH_INTERVAL)
	{
		Serial.println("Time read");
		lastRefreshTime += REFRESH_INTERVAL;
		parseTime(c.getSQL("b1time"), c.getTime());
	}
}

void sendReading()
{
	c._dt.cu = sensor.getCurrentAC();
	// if(c._dt.cu > 15000) {
	// 	for(int i = 0; i < 4; i++)
	// 		digitalWrite(socketpins[i], HIGH);
	// 	while(true);
	// }
	static const unsigned long REFRESH_INTERVAL = 60000; // 1 min in ms
	static unsigned long lastRefreshTime = 0;
	if(millis() - lastRefreshTime >= REFRESH_INTERVAL)
	{
		lastRefreshTime += REFRESH_INTERVAL;
		c.putSQL("b1log", true);
	}
}
