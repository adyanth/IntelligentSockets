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

function getPad(n) {
	return ('0'+n).slice(-2);
}

function initPage() {
	var am = document.getElementById('am');
	for(var i = 0; i < 12; i++) {
		var x = document.createElement('td');
		x.setAttribute("id", getPad(i));
		x.appendChild(document.createTextNode(getPad(i==0?12:i)+':00 - '+getPad(i+1)+':00'));
		x.onclick = function() {
			selectCell(this);
		}
		x.setAttribute('bgcolor','');
		am.appendChild(x);
	}
	var pm = document.getElementById('pm');
	for(var i = 0; i < 12; i++) {
		var x = document.createElement('td');
		x.setAttribute("id", ('0'+(i+12)).slice(-2));
		x.appendChild(document.createTextNode(getPad(i==0?12:i)+':00 - '+getPad(i+1)+':00'));
		x.onclick = function() {
			selectCell(this);
		}
		x.setAttribute('bgcolor','');
		pm.appendChild(x);
	}
	updateBox(document.getElementById('socket'));
}

function selectCell(cell, force = '0') {
	// -1 -> Clear, 0 -> Toggle, 1 -> Set
	if(cell.getAttribute('bgcolor') != '#90ee90' && force != '-1') {
		cell.setAttribute('class', 'selected')
		cell.setAttribute('bgcolor', '#90ee90');
	}
	else if(force == '0' || force == '-1') {
		cell.removeAttribute('class');
		cell.setAttribute('bgcolor','');
	}
}

function updateBox(sw) {
	sw = sw.value;
	var req = createCORSRequest('GET', 'reader.php?table=b1time&json')
	req.onload = function() {
		sws = JSON.parse(req.responseText.match('<p id="data">(.+)</p>')[1])["top"];
		for(var i = 0; i < 24; i++) {
			selectCell(document.getElementById(getPad(i)), '-1')
		}
		for(var i = 0; i < sws.length; i++) {
			if(sws[i]['autorem'] == '0' && sw == sws[i]["switch"]) {
				for(var j = sws[i]["fromtime"].slice(0,2); j < sws[i]["totime"].slice(0,2); j = getPad(+j+1)) {
					selectCell(document.getElementById(j), '1')
				}
			}
		}
	}
	req.send();
}

function submit() {
	sw = document.getElementById('socket').value;
	req = createCORSRequest('GET', 'delete.php?table=b1time&switch='+sw);
	req.onload = function() {
		updateVal(sw);
	}
	req.send();
}

function updateVal(sw) {
	boxes = document.getElementsByClassName('selected');
	times = [];
	for(var i = 0; i < boxes.length; i++) {
		times[i] = boxes[i].getAttribute('id');
	}

	for(var i = 0; i < times.length; i++) {
		var from = times[i];
		var x = times[i=findConsecutive(times, i, times.length)];
		var to = (+x+1)==24?'00':getPad(+x+1);
		// console.log("from : "+from+"	to : "+to+"	i : "+i);
		var req = createCORSRequest('GET', 'writer.php?table=b1time&switch='+sw+'&fromtime='+from+':00:00&totime='+to+':00:00');
		req.send();
	}
}

function findConsecutive(arr, i, n) {
	if(i>n-1)
		return i;
	return +arr[i]+1==arr[i+1]?findConsecutive(arr, i+1, n):i;
}

window.setInterval(reTime, 1000);

function reTime() {
	var req = createCORSRequest('GET', 'time.php');
	req.onload = function() {
		document.getElementById('time').innerText = req.responseText.match('<body>(.+)</body>')[1];
	} 
	req.send();
}

if (annyang) {
	var commands = {
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
		'update' : function() {
			submit();
			document.getElementById('status').innerText = 'Updated successfully.';
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