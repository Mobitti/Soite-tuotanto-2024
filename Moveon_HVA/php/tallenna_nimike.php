<?php

include_once '../config/config.php';


if(isset($_POST['id']) 
&& isset($_POST['lyhenne'])
&& isset($_POST['nimi']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT lyhenne, nimi FROM nimike WHERE lyhenne = :lyhenne OR nimi = :nimi";
			$values = $con->prepare($sql);
			$values->bindParam(':lyhenne', $_POST['lyhenne']);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
		
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO nimike (id, lyhenne, nimi) VALUES(NULL, :lyhenne, :nimi)";
				$values = $con->prepare($sql);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT lyhenne, nimi FROM nimike WHERE (lyhenne = :lyhenne OR nimi = :nimi) AND id != :id";
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
				$sql =  "UPDATE nimike SET lyhenne = :lyhenne, nimi = :nimi WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':lyhenne', $_POST['lyhenne']);
				$values->bindParam(':nimi', $_POST['nimi']);
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