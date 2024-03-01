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
			$sql = "UPDATE suunniteltuvuoro SET poisto = 1 WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
			$values = $con->prepare($sql);
			$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
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