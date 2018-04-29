
function turnOn(sw) {
	var req = createCORSRequest('GET', 'writer.php?table=b1state&switch='+sw+'&state=0');
	req.send();
}

function turnOff(sw) {
	var req = createCORSRequest('GET', 'writer.php?table=b1state&switch='+sw+'&state=1');
	req.send();
}



function requiredElement(sw, st) {
	var obj = document.createElement('img');
	if(st == '1') {
		obj.setAttribute('src', 'off.png');
		obj.onclick = function(){turnOn(sw);};
	}
	else {
		obj.setAttribute('src', 'on.png');
		obj.onclick = function() {turnOff(sw);};
	}
	obj.setAttribute('width', '32');
	return obj;
}
function createCORSRequest(method, url, async=true) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open(method, url, async);
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {
		xhr = null;
	}
	return xhr;
}

function initPage() {
	var req = createCORSRequest('GET', 'reader.php?table=b1state&json')
	req.onload = function () {
		setPage(req.responseText);
	}
	req.send();
}

function setPage(txt) {
	txt = txt.match('<p id="data">(.+)</p>')[1];
	var x = JSON.parse(txt)["top"];
	for(var i = 0; i < 4; i++) {
		var space = document.getElementById(x[i]["switch"]);
		space.innerHTML = '';
		space.appendChild(requiredElement(x[i]["switch"], x[i]["state"]));
	}
}


setInterval(initPage,1000);
if (annyang) {
	var commands = {
		'turn on switch 1' : function() {
			turnOn(0);
			document.getElementById('status').innerText = 'Switch 1 turned on'
		},
		'turn on switch 2' : function() {
			turnOn(1);
			document.getElementById('status').innerText = 'Switch 2 turned on';
		},
		'turn on switch 3' : function() {
			turnOn(2);
			document.getElementById('status').innerText = 'Switch 3 turned on';
		},
		'turn on switch 4' : function() {
			turnOn(3);
			document.getElementById('status').innerText = 'Switch 4 turned on';
		},
		'turn off switch 1' : function() {
			turnOff(0);
			console.log('why');
			console.log(document.getElementById('status').innerText+'hellp');
			document.getElementById('status').innerText = 'Switch 1 turned off';
		},
		'turn off switch 2' : function() {
			turnOff(1);
			document.getElementById('status').innerText = 'Switch 2 turned off';
		},
		'turn off switch 3' : function() {
			turnOff(2);
			document.getElementById('status').innerText = 'Switch 3 turned off';
		},
		'turn off switch 4' : function() {
			turnOff(3);
			document.getElementById('status').innerText = 'Switch 4 turned off';
		},
		'turn off all' : function() {
			turnOff(0);
			turnOff(1);
			turnOff(2);
			turnOff(3);
			document.getElementById('status').innerText = 'All switches turned off';
		},
		'turn on all' : function() {
			turnOn(0);
			turnOn(1);
			turnOn(2);
			turnOn(3);
			document.getElementById('status').innerText = 'All switches turned on';
		},
		'set auto timer' : function() {
			window.location.href = 'timesel.php';
		},
		'set manual timer' : function() {
			window.location.href = 'timenow.php';
		},
		'live feed' : function() {
			window.location.href = 'livecam/';
		},

	};
	annyang.addCommands(commands);
	annyang.start();
	document.getElementById('speech').innerText = 'Speech control available subject to internet conditions.\n' + Object.keys(commands).join('\n');
} else {
	document.getElementById('speech').innerText = 'To have speech control, please use a supported browser like Chrome/Firefox';
}