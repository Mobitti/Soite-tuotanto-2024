<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['selite'])
&& isset($_POST['numero']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM reservitausta WHERE selite = :selite OR numero = :numero";
			$values = $con->prepare($sql);
			$values->bindParam(':selite', $_POST['selite']);
			$values->bindParam(':numero', $_POST['numero']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
		
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO reservitausta (id, selite, numero) VALUES(NULL, :selite, :numero)";
				$values = $con->prepare($sql);
				$values->bindParam(':selite', $_POST['selite']);
				$values->bindParam(':numero', $_POST['numero']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM reservitausta WHERE (selite = :selite OR numero = :numero) AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':selite', $_POST['selite']);
			$values->bindParam(':numero', $_POST['numero']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql =  "UPDATE reservitausta SET selite = :selite, numero = :numero WHERE id = :id";;
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->bindParam(':selite', $_POST['selite']);
				$values->bindParam(':numero', $_POST['numero']);
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