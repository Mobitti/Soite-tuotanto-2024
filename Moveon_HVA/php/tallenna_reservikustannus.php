<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['osasto_id'])
&& isset($_POST['hinta'])
&& isset($_POST['alku_pvm'])
&& isset($_POST['loppu_pvm']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$alku_pvm = substr($_POST['alku_pvm'], 6, 4) . "-" . substr($_POST['alku_pvm'], 3, 2) . "-" . substr($_POST['alku_pvm'], 0, 2);
		$loppu_pvm = substr($_POST['loppu_pvm'], 6, 4) . "-" . substr($_POST['loppu_pvm'], 3, 2) . "-" . substr($_POST['loppu_pvm'], 0, 2);
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM reservikustannus WHERE osasto_id = :osasto_id AND alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm";
			$values = $con->prepare($sql);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "INSERT INTO reservikustannus (id, osasto_id, hinta, alku_pvm, loppu_pvm) VALUES(NULL, :osasto_id, :hinta, :alku_pvm, :loppu_pvm)";
				$values = $con->prepare($sql);
				$values->bindParam(':osasto_id', $_POST['osasto_id']);
				$values->bindParam(':hinta', $_POST['hinta']);
				$values->bindParam(':alku_pvm', $alku_pvm);
				$values->bindParam(':loppu_pvm', $loppu_pvm);				
				$values->execute();
			}
		}
		else {
			$sql = "SELECT id FROM reservikustannus WHERE osasto_id = :osasto_id AND id != :id AND alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm";
			$values = $con->prepare($sql);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
			}
			else {
				$sql = "UPDATE reservikustannus SET osasto_id = :osasto_id, hinta = :hinta, alku_pvm = :alku_pvm, loppu_pvm = :loppu_pvm WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':osasto_id', $_POST['osasto_id']);
				$values->bindParam(':hinta', $_POST['hinta']);
				$values->bindParam(':alku_pvm', $alku_pvm);
				$values->bindParam(':loppu_pvm', $loppu_pvm);
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