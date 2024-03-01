<?php

include_once '../config/config.php';

if(isset($_POST['id'])
&& isset($_POST['kustannusnumero'])
&& isset($_POST['lyhenne'])
&& isset($_POST['nimi'])
&& isset($_POST['vari_hex']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM palvelualue WHERE nimi = :nimi OR lyhenne = :lyhenne";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':lyhenne', $_POST['lyhenne']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO palvelualue (id, kustannusnumero, lyhenne, nimi, vari_hex) VALUES(NULL, :kustannusnumero, :lyhenne, :nimi, :vari_hex)";
				$values = $con->prepare($sql);
				$values->bindParam(':kustannusnumero', $_POST['kustannusnumero']);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':vari_hex', $_POST['vari_hex']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM palvelualue WHERE id != :id AND (nimi = :nimi OR lyhenne = :lyhenne)";
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
				$ed_kustannusnumero = "";
				
				$sql = "SELECT kustannusnumero FROM palvelualue WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if($row != null) {
					if($row['kustannusnumero'] != null) {
						$ed_kustannusnumero = $row['kustannusnumero'];
					}
				}
				
				$sql =  "UPDATE palvelualue SET kustannusnumero = :kustannusnumero, lyhenne = :lyhenne, nimi = :nimi, vari_hex = :vari_hex WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':kustannusnumero', $_POST['kustannusnumero']);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->bindParam(':vari_hex', $_POST['vari_hex']);
				$values->execute();
				
				if($ed_kustannusnumero != "") {
					$sql =  "UPDATE sihteerityojakso SET kustannusnumero = :kustannusnumero WHERE kustannusnumero = :ed_kustannusnumero";
					$values = $con->prepare($sql);
					$values->bindParam(':ed_kustannusnumero', $ed_kustannusnumero);
					$values->bindParam(':kustannusnumero', $_POST['kustannusnumero']);
					$values->execute();
				}
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