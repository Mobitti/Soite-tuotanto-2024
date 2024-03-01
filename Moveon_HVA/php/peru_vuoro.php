<?php

	include_once '../config/config.php';
	include_once 'laheta_sms.php';

	if((isset($_GET['vuoro_id']) && $_GET['vuoro_id'] != "") && (isset($_GET['gsm']) && $_GET['gsm'] != "")) 
	{
		$puh = trim($_GET['gsm']);
		$puh = "0" . substr($puh, 3);
		
		try
		{
			$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
			$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$con->query('SET NAMES utf8');
			
			$sql = "SELECT id FROM sijainen WHERE puhelin=:puh'";
			$values = $con->prepare($sql);
			$values->bindParam(':puh', $puh);
			$values->execute();
		
			while($row = $values->fetch(PDO::FETCH_ASSOC)) 
			{
				$sid = $row["id"];
			}
			
			if(strlen($sid) > 0)
			{			
				$sql = "UPDATE vuoro SET osasto_id=0, raportti_osasto_id=0 WHERE id = :vuoro_id AND sijainen_id=:sid";
				$values = $con->prepare($sql);
				$values->bindParam(':vuoro_id', $_GET['vuoro_id']);
				$values->bindParam(':sid', $sid);
				$values->execute();
			}
				
			$con=null; $values=null;
		}
		catch(PDOException $e)
		{
			$con=null; $values=null;
		}
	}

?>