<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['vuorotyyppi'])
&& isset($_POST['raportti_osasto_id'])
&& isset($_POST['osasto_id']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM vuorolukitus WHERE vuorotyyppi = :vuorotyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;
				return;
			}

			$sql = "INSERT INTO vuorolukitus (id,vuorotyyppi, raportti_osasto_id, osasto_id) VALUES(NULL, :vuorotyyppi, :raportti_osasto_id, :osasto_id)";
			$values = $con->prepare($sql);
			$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
			$values->bindParam(':raportti_osasto_id', $_POST['raportti_osasto_id']);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->execute();
		}
		else {
			$sql = "SELECT id FROM vuorolukitus WHERE vuorotyyppi = :vuorotyyppi AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;
				return;
			}

			$sql = "UPDATE vuorolukitus SET vuorotyyppi = :vuorotyyppi, raportti_osasto_id = :raportti_osasto_id, osasto_id = :osasto_id WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
			$values->bindParam(':raportti_osasto_id', $_POST['raportti_osasto_id']);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->bindParam(':id', $_POST['id']);
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