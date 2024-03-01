<?php

include_once '../config/config.php';

if(isset($_POST['id'])
&& isset($_POST['lyhenne'])	
&& isset($_POST['nimi'])
&& isset($_POST['vari_hex'])
&& isset($_POST['aktiivinen']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM toimialue WHERE nimi = :nimi OR lyhenne = :lyhenne";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':lyhenne', $_POST['lyhenne']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO toimialue (id, lyhenne, nimi, vari_hex) VALUES(NULL, :lyhenne, :nimi, :vari_hex)";
				$values = $con->prepare($sql);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':vari_hex', $_POST['vari_hex']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM toimialue WHERE id != :id AND (nimi = :nimi OR lyhenne = :lyhenne)";
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
				$sql =  "UPDATE toimialue SET lyhenne = :lyhenne, nimi = :nimi, vari_hex = :vari_hex, aktiivinen = :aktiivinen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':vari_hex', $_POST['vari_hex']);
				$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
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