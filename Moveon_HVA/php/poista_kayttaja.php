<?php

include_once '../config/config.php';

if(isset($_POST['id']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] != "") {
			$sql = "DELETE FROM kayttaja WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM kayttajanakyma WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM kayttajatoimialue WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $_POST['id']);
			$values->execute();
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