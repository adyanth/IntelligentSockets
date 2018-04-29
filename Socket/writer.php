<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sockets";
if (isset($_GET['table'])) {
	$table = $_GET['table'];
}

echo "<p id=\"data\">";

// Connect to mysql server
$conn = mysqli_connect($servername,$username,$password ) 
  or die("Error:Connection failed! ".mysqli_error($conn));

// Select database
mysqli_select_db($conn,$dbname) 
  or die ("Error:Database selection failed! ".mysqli_error($conn));  

$col = '';
$val = '';
foreach ($_GET as $key => $value) {
	echo $key . " => " . $value;
	if($key == "table" || $key == "json")
		continue;
	$col = $col . '`' . ($key) . '`' . ', ';
	$val = $val . "'" . ($value) . "'" . ', ';
	echo "<br>";
}

$col = substr($col, 0, -2);
$value = substr($val, 0, -2);

echo "<br>Col : " . $col . "<br>Val : " . $value . "<br>";
$sql = "INSERT INTO `$table`(" . $col . ") VALUES (" . $value . ") ON DUPLICATE KEY UPDATE ";
foreach ($_GET as $key => $value) {
	if($key == "table" || $key == "json")
		continue;
	$sql = $sql . '`' . ($key) . '`' . "=VALUES(`" . $key . "`), ";
}
$sql = substr($sql, 0, -2);

echo "<br>SQL : " . $sql . "<br>";
$result = mysqli_query($conn,$sql)
	or die("Error:Invalid query: ".mysqli_error($conn));  

mysqli_close($conn);
echo "</p>";
?>