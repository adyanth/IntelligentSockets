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
	$val = $val . '`' . ($key) . '` = ' . ($value) . ' AND ';
	echo "<br>";
}

$val = substr($val, 0, -5);

echo "<br>Col : " . $col . "<br>Val : " . $value . "<br>";
$sql = "DELETE FROM `$table` WHERE $val";

echo "<br>SQL : " . $sql . "<br>";
$result = mysqli_query($conn,$sql)
	or die("Error:Invalid query: ".mysqli_error($conn));  

mysqli_close($conn);
echo "</p>";
?>