<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['vakanssinumero'])
&& isset($_POST['nimi'])
&& isset($_POST['nimike_id'])
&& isset($_POST['palvelualueet'])
&& isset($_POST['aktiivinen']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sihteeri_id = "";
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM sihteeri WHERE nimi = :nimi OR vakanssinumero = :vakanssinumero";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
		
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO sihteeri (id, vakanssinumero, nimi, nimike_id, aktiivinen) VALUES(NULL, :vakanssinumero, :nimi, :nimike_id, :aktiivinen)";
				$values = $con->prepare($sql);
				$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':nimike_id', $_POST['nimike_id']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
				$values->execute();
				$sihteeri_id = $con->lastInsertId();
			}
			
			$sql = "DELETE FROM sihteeripalvelualue WHERE sihteeri_id = :sihteeri_id";
				$values = $con->prepare($sql);
				$values->bindParam(':sihteeri_id', $sihteeri_id);
				$values->execute();
				
				$palvelualueet = explode(',',$_POST['palvelualueet']);
				for($j = 0;  $j < count($palvelualueet); $j++)
				{
					$sql = "INSERT INTO sihteeripalvelualue (id, sihteeri_id, palvelualue_id) VALUES (NULL, :sihteeri_id, :palvelualue_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':sihteeri_id', $sihteeri_id);
					$values->bindParam(':palvelualue_id', $palvelualueet[$j]);
					$values->execute();
				}
		}
		else {
			$sql = "SELECT id FROM sihteeri WHERE (nimi = :nimi OR vakanssinumero = :vakanssinumero) AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "UPDATE sihteeri SET nimi = :nimi, vakanssinumero = :vakanssinumero, nimike_id = :nimike_id, aktiivinen = :aktiivinen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':nimike_id', $_POST['nimike_id']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
				$values->execute();	
			}
			
			$sql = "DELETE FROM sihteeripalvelualue WHERE sihteeri_id = :sihteeri_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sihteeri_id', $_POST['id']);
			$values->execute();
			
			$palvelualueet = explode(',',$_POST['palvelualueet']);
			for($j = 0;  $j < count($palvelualueet); $j++)
			{
				$sql = "INSERT INTO sihteeripalvelualue (id, sihteeri_id, palvelualue_id) VALUES (NULL, :sihteeri_id, :palvelualue_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':sihteeri_id', $_POST['id']);
				$values->bindParam(':palvelualue_id', $palvelualueet[$j]);
				$values->execute();
			}
		}

		$con=null; $values=null;
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