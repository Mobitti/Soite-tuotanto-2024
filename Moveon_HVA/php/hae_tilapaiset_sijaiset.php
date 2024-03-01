<?php

include_once '../config/config.php';

if(isset($_POST['toimialue_idt']))
{
	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT id, nimi, (SELECT lyhenne FROM nimike WHERE id = nimike_id) AS nimike FROM sijainen WHERE id IN (SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE sijainen_id > '' AND aktiivinen = 1 AND temppi = 1 AND puhelin != '' AND laite_id != 0 AND toimialue_id IN(" . $_POST['toimialue_idt'] . ")) ORDER BY nimi ASC";
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id']; 
			$row_array['nimike']  = $row['nimike'];
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
}
?>