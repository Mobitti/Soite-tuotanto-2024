<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['prosentti']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM tyomaara WHERE prosentti = :prosentti";
			$values = $con->prepare($sql);
			$values->bindParam(':prosentti', $_POST['prosentti']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO tyomaara (id, prosentti) VALUES(NULL, :prosentti)";
				$values = $con->prepare($sql);
				$values->bindParam(':prosentti', $_POST['prosentti']);
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM tyomaara WHERE prosentti = :prosentti AND id != :id";
			
			$values = $con->prepare($sql);
			$values->bindParam(':prosentti', $_POST['prosentti']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql =  "UPDATE tyomaara SET prosentti = :prosentti WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':prosentti', $_POST['prosentti']);
				$values->bindParam(':id', $_POST['id']);
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