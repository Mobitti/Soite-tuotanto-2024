<?php

include_once '../config/config.php';

if(isset($_POST['id']))
{
	try
	{
		$return_arr = array();
		$vuorotyyppi = "";
		$virhe = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] != "") {
			$sql = "SELECT tyyppi FROM vuorotyyppi WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$vuorotyyppi = $row['tyyppi'];
			}
			
			$sql = "SELECT id FROM vuoroyhdistelma WHERE vuorotyypit LIKE '%" . $vuorotyyppi . "%'";
			$values = $con->prepare($sql);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$virhe = 1;
			}
			
			$sql = "SELECT id FROM lukittuvuoro WHERE vuorotyyppi = :vuorotyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':vuorotyyppi', $vuorotyyppi);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$virhe = 1;
			}
			
			if($virhe == 0) {
				$sql = "DELETE FROM vuorotyyppi WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->execute();
			}
		}

		$tiedot["virhe"] = $virhe;
		array_push($return_arr,$tiedot);
		
		$con=null; $values=null;
		echo json_encode($return_arr);
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