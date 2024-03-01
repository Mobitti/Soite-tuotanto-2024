<?php

include_once '../config/config.php';

	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT id, vuorotyyppi, raportti_osasto_id, (SELECT CONCAT(raporttinumero,' ',lyhenne) FROM osasto WHERE id = raportti_osasto_id) AS raportti_osasto_nimi, osasto_id, (SELECT CONCAT(raporttinumero,' ',lyhenne) FROM osasto WHERE id = osasto_id) AS osasto_nimi  FROM vuorolukitus ORDER BY vuorotyyppi";
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id']; 
			$row_array['vuorotyyppi'] = $row['vuorotyyppi'];
			$row_array['raportti_osasto_id'] = $row['raportti_osasto_id'];
			if($row['raportti_osasto_nimi'] != null) {
				$row_array['raportti_osasto_nimi'] = $row['raportti_osasto_nimi'];
			}
			else {
				$row_array['raportti_osasto_nimi'] = "-";
			}
			$row_array['osasto_id'] = $row['osasto_id'];
			if($row['osasto_nimi'] != null) {
				$row_array['osasto_nimi'] = $row['osasto_nimi'];
			}
			else {
				$row_array['osasto_nimi'] = "-";
			}
			array_push($return_arr,$row_array);
		}
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
?>