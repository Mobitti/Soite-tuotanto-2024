<?php

include_once '../config/config.php';

try
{
	$return_arr = array();
	
	$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$con->query('SET NAMES utf8');
	
	$sql = "SELECT id, nimi FROM sijainen ORDER BY nimi";
	$values = $con->prepare($sql);
	$values->execute();
	while ($row = $values->fetch(PDO::FETCH_ASSOC))
	{
		$row_array['id'] = $row['id']; 
		$row_array['nimi'] = $row['nimi'];
		
		array_push($return_arr,$row_array);
	}

	$con=null; $values=null;
	echo json_encode($return_arr);
	
}  
catch(PDOException $e)
{
	echo "Tietokantavirhe: " . $e->getMessage();
}

?>