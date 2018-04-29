<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sockets";
date_default_timezone_set("Asia/Calcutta");
if (isset($_GET['table'])) {
	$table = $_GET['table'];
}

if (isset($_GET['json'])) {
	$json = 'true';
} else {
	$json = 'false';
}
echo "<p id=\"data\">";
// Connect to mysql server
$conn = mysqli_connect($servername,$username,$password ) 
  or die("Error:Connection failed! ".mysqli_error($conn));

// Select database
mysqli_select_db($conn,$dbname) 
  or die ("Error:Database selection failed! ".mysqli_error($conn));  
if ($table == "b1state" || $table == 'b1log' || $table == 'b1time') {
	$sql = "SELECT * FROM $table";
}
$jsonr = '{"top":[';
$result = mysqli_query($conn,$sql)
	or die("Error:Invalid query: ".mysqli_error($conn));  
$num_rows = mysqli_num_rows($result);  
if ($num_rows) {
	while ($num_rows) {
		$row = mysqli_fetch_assoc($result);
		$num_rows = $num_rows - 1;
		if ($json == 'true') {
			$jsonr = $jsonr . json_encode($row) . ',';
			if($table == 'b1time' && $row['autorem'] == '1' && (time() > strtotime($row['totime']) || time() < strtotime($row['fromtime']))) {
					file_get_contents('http://' . $_SERVER['HTTP_HOST'] . '/socket/delete.php?table='.$table.'&id=' . $row['id']);
			}				
		} else {
			echo "<p class=\"row\">";
			foreach ($row as $key => $val) {
				echo $key.":".$val."<br>";
			}
			echo "</p>";
		}
		//	echo "Barcode:".$row['barc']."<br>";
		//	echo "Name:".$row['name']."<br>";
		//	echo "Info:".$row['info']."<br>";
		//	echo "Cost:".$row['cost']."<br>";
		//	echo "Weight:".$row['weight'];
		//	$num_rows = $num_rows - 1;
	} 
}
else {
	$jsonr = $jsonr . ',';
	echo ("");	//not found
}

if($json) {
	echo substr($jsonr, 0, -1) . ']}';
}
echo "</p>";
mysqli_close($conn);

?>