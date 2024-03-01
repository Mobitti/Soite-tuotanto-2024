<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['lyhenne'])
&& isset($_POST['nimi'])
&& isset($_POST['raporttinumero'])
&& isset($_POST['toimialue_id'])
&& isset($_POST['palvelualue_id'])
&& isset($_POST['aktiivinen']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		if($_POST['id'] == "") {
			$sql = "SELECT id FROM osasto WHERE lyhenne = :lyhenne OR nimi = :nimi";
			$values = $con->prepare($sql);
			$values->bindParam(':lyhenne', $_POST['lyhenne']);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO osasto (id, lyhenne, nimi, raporttinumero, toimialue_id, palvelualue_id, aktiivinen) VALUES(NULL, :lyhenne, :nimi, :raporttinumero, :toimialue_id, :palvelualue_id, 1)";
				$values = $con->prepare($sql);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':raporttinumero', $_POST['raporttinumero']);
				$values->bindParam(':palvelualue_id', $_POST['palvelualue_id']);
				$values->bindParam(':toimialue_id', $_POST['toimialue_id']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM osasto WHERE (lyhenne = :lyhenne OR nimi = :nimi) AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':lyhenne', $_POST['lyhenne']);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "UPDATE osasto SET lyhenne = :lyhenne, nimi = :nimi, raporttinumero = :raporttinumero, toimialue_id = :toimialue_id, palvelualue_id = :palvelualue_id, aktiivinen = :aktiivinen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':raporttinumero', $_POST['raporttinumero']);
				$values->bindParam(':toimialue_id', $_POST['toimialue_id']);
				$values->bindParam(':palvelualue_id', $_POST['palvelualue_id']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
				$values->execute();
			}
		}
		
		$con=null; $values=null;
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