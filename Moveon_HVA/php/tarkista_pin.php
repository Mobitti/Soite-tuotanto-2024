<?php

include_once '../config/config.php';


if(isset($_POST['pin']))
{
	try
	{
		$data_array = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		/*Sijaisen tiedot*/
		$sql = "SELECT nimi, id FROM sijainen WHERE pin = :pin AND aktiivinen = 1";			
		$values = $con->prepare($sql);		
		$values->bindParam(':pin', $_POST['pin']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$row_array['nimi']	= $row['nimi'];	
			$row_array['id'] = $row['id'];
		}
		
		array_push($data_array,$row_array);

		$con=null; $values=null;
		echo json_encode($data_array);
	}  
	catch(PDOException $e)
	{
		$con=null; $values=null;
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>