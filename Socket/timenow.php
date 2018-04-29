<!DOCTYPE html>
<html>
<head>
	<title>Smart Sockets</title>
	<script type="text/javascript" src="annyang.min.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body onload="initPage()" bgcolor="#D3D3D3">
	<center>
		<h1>Manual Timer</h1>
		<br>
		Time Now : 
		<span id="time"></span>
		<br><br>
		Enter the time for which the socket should auto turn on/off, 
		<select name = "socket" id = 'socket'>
			<option value = '0'>Socket 1</option>
			<option value = '1'>Socket 2</option>
			<option value = '2'>Socket 3</option>
			<option value = '3'>Socket 4</option>
		</select>
		<br><br>
		Select interval : 
		<select name = "interval" id = 'interval'>
			<option selected value = '1'>1 min</option>
			<option value = '2'>2 min</option>
			<option value = '5'>5 min</option>
			<option value = '10'>10 min</option>
			<option value = '15'>15 min</option>
			<option value = '30'>30 min</option>
			<option value = '45'>45 min</option>
			<option value = '60'>1 hr</option>
			<option value = '120'>2 hr</option>
			<option value = '180'>3 hr</option>
		</select>
		<br>
		<br>
		<button type = "button" onclick = 'submit()'>Set</button>
		<br>
		<br>
		<style>
			table.roundedCorners { 
				border: 2px solid black;
				border-radius: 13px; 
				border-spacing: 0;
			}
			table.roundedCorners td, 
			table.roundedCorners th { 
				border: 1px solid black;
				padding: 10px; 
			}
			table.roundedCorners tr:last-child td {
				border-bottom: none;
			}
			table.roundedCorners tr:first-child td {
				border-top: none;
			}
			table.roundedCorners tr td:last-child {
				border-right: none;
			}
			table.roundedCorners tr:last-child th {
				border-left: none;
				border-bottom: none;
			}
			table.roundedCorners tr:first-child th {
				border-left: none;
				border-top: none;
			}
			table.roundedCorners tr:hover {
				cursor: pointer;
			}
			tr {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-khtml-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
		</style>
		Existing manual timers : 
		<table class = "roundedCorners" id = "exist">
		</table>
		<br>
		<a href="index.html"><i>Click here to <b>go back</b></i>.</a>
		<br>
		<span id='status'></span>
		<br>
		<span id='speech'></span>
	</center>
	<script type="text/javascript" src="timenow.js"></script>
</body>
</html>