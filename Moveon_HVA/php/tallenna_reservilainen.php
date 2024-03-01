<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['vakanssinumero'])
&& isset($_POST['nimi'])
&& isset($_POST['nimike_id'])
&& isset($_POST['toimialueet'])
&& isset($_POST['aktiivinen']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$reservilainen_id = "";
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM reservilainen WHERE nimi = :nimi OR vakanssinumero = :vakanssinumero";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
		
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO reservilainen (id, vakanssinumero, nimi, nimike_id, aktiivinen) VALUES(NULL, :vakanssinumero, :nimi, :nimike_id, :aktiivinen)";
				$values = $con->prepare($sql);
				$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':nimike_id', $_POST['nimike_id']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
				$values->execute();
				$reservilainen_id = $con->lastInsertId();
			}
			
			$sql = "DELETE FROM reservilainentoimialue WHERE reservilainen_id = :reservilainen_id";
				$values = $con->prepare($sql);
				$values->bindParam(':reservilainen_id', $reservilainen_id);
				$values->execute();
				
				$toimialueet = explode(',',$_POST['toimialueet']);
				for($j = 0;  $j < count($toimialueet); $j++)
				{
					$sql = "INSERT INTO reservilainentoimialue (id, reservilainen_id, toimialue_id) VALUES (NULL, :reservilainen_id, :toimialue_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':reservilainen_id', $reservilainen_id);
					$values->bindParam(':toimialue_id', $toimialueet[$j]);
					$values->execute();
				}
		}
		else {
			$sql = "SELECT id FROM reservilainen WHERE (nimi = :nimi OR vakanssinumero = :vakanssinumero) AND id != :id";
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
				$sql = "UPDATE reservilainen SET nimi = :nimi, vakanssinumero = :vakanssinumero, nimike_id = :nimike_id, aktiivinen = :aktiivinen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':vakanssinumero', $_POST['vakanssinumero']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':nimike_id', $_POST['nimike_id']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
				$values->execute();	
			}
			
			$sql = "DELETE FROM reservilainentoimialue WHERE reservilainen_id = :reservilainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':reservilainen_id', $_POST['id']);
			$values->execute();
			
			$toimialueet = explode(',',$_POST['toimialueet']);
			for($j = 0;  $j < count($toimialueet); $j++)
			{
				$sql = "INSERT INTO reservilainentoimialue (id, reservilainen_id, toimialue_id) VALUES (NULL, :reservilainen_id, :toimialue_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':reservilainen_id', $_POST['id']);
				$values->bindParam(':toimialue_id', $toimialueet[$j]);
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