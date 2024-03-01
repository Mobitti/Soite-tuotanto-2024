<?php

include_once '../config/config.php';

if(isset($_POST['vuorovaraus_idt']))
{
	try
	{
		$return_arr = array();
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['vuorovaraus_idt'] != "") {
			$sql = "DELETE FROM vuorovarausviesti WHERE id IN(" .  $_POST['vuorovaraus_idt'] . ")";
			$values = $con->prepare($sql);
			$values->execute();
		}
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>