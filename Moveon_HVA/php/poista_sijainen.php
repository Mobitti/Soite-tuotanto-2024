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
			$sql = "DELETE FROM sijainen WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM sijainenosasto WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
			$values->execute();

			$sql = "DELETE FROM sijainentoimialue WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM suunniteltuvuoro WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM vuoro WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
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