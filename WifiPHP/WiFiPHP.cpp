#include "Arduino.h"
#include "WiFiPHP.h"

int WiFiPHP::find_text(String haystack, String needle, bool rev = false) {
	int foundpos = -1;
	if (haystack.length()<needle.length())
		return foundpos;	//Serial.print("Long!!");
	int scanlen=haystack.length() - needle.length();
	for (int i = rev?scanlen:0; rev?i>=0:i<=scanlen; rev?i--:i++) {
		if (haystack.substring(i,needle.length()+i) == needle) {
			foundpos = i;
			return foundpos;
		}
  	}
  //Serial.print("Not found");
	return foundpos;
}

String WiFiPHP::strip_text(String txt, String from, String to) {
  return txt.substring(find_text(txt,from)+from.length(),find_text(txt,to));
}

WiFiPHP::WiFiPHP(int serverIP):_serverIP(serverIP) {
	// WiFi.begin(AP, PSK);
	// while (WiFi.status() != WL_CONNECTED) {
	// 	delay(100);
	// 	//Serial.println(".");
	// }
	for(int i = 0; i < 4; i++)
		_sw[i].sw = i;
}

WiFiPHP::~WiFiPHP() {
	
}

String WiFiPHP::getSQL(String table, int boardID, bool json) {
	String url = "http://"+IP.toString()+"/socket/reader.php?table="+table;
	//Serial.println(url);
	if(boardID)
		url = url + "&sw=" + boardID;
	if(json)
		url = url + "&json";
	// Serial.println(String("URL:") + url);
	WiFiClient client = connect(url);
	String line="";
	while(client.available()){
		line = line+" "+client.readStringUntil('\r');
	}
	line=strip_text(line,"<p id=\"data\">","</p>");
	if(find_text(line,"Error:")!=-1)
		return "";
	return line;
}

String WiFiPHP::putSQL(String table,  int mode, int switchID, bool json) { //0 -> this->SW, 1 -> this->DT
	String url = "http://"+IP.toString()+"/socket/writer.php?table="+table;
	if(mode)
		url = url + "&current=" + _dt.cu + "&voltage=" + _dt.vg + "&cosphi=" + _dt.cosphi;
	else
		url = url + "&switch=" + _sw[switchID].sw + "&state=" + _sw[switchID].state;
	if(json)
		url = url + "&json";
	// We now create a URI for the request
	WiFiClient client = connect(url);
	String line="";
	// Read all the lines of the reply from server and return
	while(client.available())
		line = line+" "+client.readStringUntil('\r');
	line=strip_text(line,"<p id=\"data\">","</p>");
	if(find_text(line,"Error:")!=-1)
		return "";
	return line;
}

String WiFiPHP::getTime() {
	String url = "http://"+IP.toString()+"/socket/time.php";
	WiFiClient client = connect(url);
	String line="";
	// Read all the lines of the reply from server and return
	while(client.available())
		line = line+" "+client.readStringUntil('\r');
	line=strip_text(line,"<body>","</body>");
	return line;
}

WiFiClient WiFiPHP::connect(String url) {
	IP.fromString(WiFi.localIP().toString().substring(0,find_text(WiFi.localIP().toString(),".",true))+"."+String(_serverIP));
	WiFiClient client;
	const int httpPort = 80;
	if (!client.connect(IP, httpPort)) {
		return client;
	}
	client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + IP.toString() + "\r\n" + "Connection: close\r\n\r\n");
	delay(500);
	return client;
}