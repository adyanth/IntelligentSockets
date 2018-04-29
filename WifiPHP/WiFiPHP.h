#ifndef WiFiPHP_h
#define WiFiPHP_h

#include "Arduino.h"
#include "ESP8266WiFi.h"

extern const char *AP, *PSK;

struct SW {
	int sw = 0;
	int state = 0;
};

struct DT {
	double cu = 0.0;
	double vg = 230.0;
	double cosphi = 0.0;
};


class WiFiPHP
{
public:
	WiFiPHP(int serverIP = 1);
	~WiFiPHP();
	struct SW _sw[4];
	struct DT _dt;
	String getSQL(String table, int boardID = 0, bool json = true);
	String putSQL(String table, int mode = 0, int switchID = 0, bool json = true);	//mode = 0 -> SW, mode = 1 -> DT
	String getTime();
private:
	char *_SSID, *_psk;
	int _serverIP;
	IPAddress IP;	//host ip
	int find_text(String hay, String needle, bool rev);
	String strip_text(String text, String from, String to);
	WiFiClient connect(String url);
};

#endif