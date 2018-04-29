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

}

function getPad(n) {
	return ('0'+n).slice(-2);
}

function submit() {
	sw = document.getElementById('socket').value;
	val = document.getElementById('interval').value;
	time = document.getElementById('time').innerText;
	var from = time;
	console.log(time);
	var d = new Date(1998, 2, 12, from.slice(0,2), from.slice(3,5), from.slice(6,8));
	console.log(d);
	console.log(val);
	d.setMinutes(d.getMinutes() + +val);
	console.log(d);
	var to = getPad(d.getHours()) + ":" + getPad(d.getMinutes()) + ":" + getPad(d.getSeconds());
	console.log(to);
	// console.log("from : "+from+"	to : "+to+"	i : "+i);
	var req = createCORSRequest('GET', 'writer.php?table=b1time&switch='+sw+'&fromtime='+from+'&totime='+to+'&autorem=1');
	//req.onload = function(){console.log(this.responseText);};
	req.send();
	updateExist();
}

function updateExist() {
	var req = createCORSRequest('GET', 'reader.php?table=b1time&json&autorem=1');
	req.onload = function() {
		var x = document.getElementById('exist');
		x.innerHTML = '<tr><th>Socket</th><th>From Time</th><th>To Time</th></tr>';
		sws = JSON.parse(req.responseText.match('<p id="data">(.+)</p>')[1])["top"];
		for(var sw in sws)
			if(sws[sw]['autorem']=='1') {
				var r = document.createElement('tr');
				var d = document.createElement('td');
				d.appendChild(document.createTextNode(+sws[sw]['switch']+1));
				r.appendChild(d);
				var d = document.createElement('td');
				d.appendChild(document.createTextNode(sws[sw]['fromtime']));
				r.appendChild(d);
				var d = document.createElement('td');
				d.appendChild(document.createTextNode(sws[sw]['totime']));
				r.appendChild(d);
				x.appendChild(r);
			}
	}
	req.send();
}

function getPad(n) {
	return ('0'+n).slice(-2);
}

function findConsecutive(arr, i, n) {
	if(i>n-1)
		return i;
	return +arr[i]+1==arr[i+1]?findConsecutive(arr, i+1, n):i;
}

window.setInterval(reTime, 1000);
window.setInterval(updateExist,2000);

function reTime() {
	var req = createCORSRequest('GET', 'time.php');
	req.onload = function() {
		document.getElementById('time').innerText = req.responseText.match('<body>(.+)</body>')[1];
	} 
	req.send();
}

if (annyang) {
	var commands = {
		'set' : function() {
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'select socket 1' : function() {
			document.getElementById('socket').value = 0;
		},
		'select socket 2' : function() {
			document.getElementById('socket').value = 1;
		},
		'select socket 3' : function() {
			document.getElementById('socket').value = 2;
		},
		'select socket 4' : function() {
			document.getElementById('socket').value = 3;
		},
		'set for 1 minute' : function() {
			document.getElementById('interval').value = 1;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 2 minutes' : function() {
			document.getElementById('interval').value = 2;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 5 minutes' : function() {
			document.getElementById('interval').value = 5;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 10 minutes' : function() {
			document.getElementById('interval').value = 10;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 15 minutes' : function() {
			document.getElementById('interval').value = 15;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 30 minutes' : function() {
			document.getElementById('interval').value = 30;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 45 minutes' : function() {
			document.getElementById('interval').value = 45;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 1 hour' : function() {
			document.getElementById('interval').value = 60;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 2 hours' : function() {
			document.getElementById('interval').value = 120;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'set for 3 hours' : function() {
			document.getElementById('interval').value = 180;
			submit();
			document.getElementById('status').innerText = 'Set successfully.';
		},
		'go back' : function() {
			window.location.href = 'index.html';
		}
	};
	annyang.addCommands(commands);
	annyang.start();
	document.getElementById('speech').innerText = 'Speech control available subject to internet conditions.\n' + Object.keys(commands).join('\n');
} else {
	document.getElementById('speech').innerText = 'To have speech control, please use a supported browser like Chrome/Firefox';
}