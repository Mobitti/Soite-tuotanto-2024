<?php

include_once '../config/config.php';

if(isset($_POST['id']))
{	
	try
	{
		$data_array = array();

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		$pin_koodit = array();
		$pin_koodi = "";
		
		if($_POST['id'] == "") {
			$sql = "SELECT pin FROM sijainen";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				array_push($pin_koodit,$row['pin']);
			}
		}
		else {
			$sql = "SELECT pin FROM sijainen WHERE id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				array_push($pin_koodit,$row['pin']);
			}
		}
		
		$pin_koodi_sarja = range(0,9999);
		$validit_pin_koodit = array_diff($pin_koodi_sarja,$pin_koodit);
		$pin_koodi = $validit_pin_koodit[array_rand($validit_pin_koodit)];
			
		$row_array["pin"] = sprintf("%04d",$pin_koodi);
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