<?php

include_once '../config/config.php';

if(isset($_POST['nimike_id'])
&& isset($_POST['sijaistentyyppi'])
&& isset($_POST['toimialue_id'])
&& isset($_POST['osasto_id'])
&& isset($_POST['hakunimi'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{	
	try
	{
		$return_arr = array();
		$sijainenWhere = "";
		$toimialueWhere = "";
		$nimikeWhere = "";
		$osastoWhere = "";
		$hakuWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
				
		switch($_POST['sijaistentyyppi'])
		{
			case 0: $sijainenWhere = " AND nimike_id IN(SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%')"; break;
			case 1: $sijainenWhere = " AND nimike_id NOT IN(SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%')"; break;
			case 2: $sijainenWhere = " AND aktiivinen = 1"; break;
			case 3: $sijainenWhere = " AND aktiivinen = 0"; break;
		}

		if($_POST['toimialue_id'] != -1) {
			$toimialueWhere = " AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN(" .  $_POST['toimialue_id'] . "))";
		}		
		
		if($_POST['nimike_id'] != -1) {
			$nimikeWhere = " AND nimike_id = " . $_POST['nimike_id'];	
		}
		
		if($_POST['osasto_id'] != -1) {
			$osastoWhere = " AND id IN(SELECT sijainen_id FROM sijainenosasto WHERE osasto_id = " . $_POST['osasto_id'] . ")";
		}
		
		if($_POST['hakunimi'] != "") {
			$hakuWhere = " AND nimi LIKE '%" . $_POST['hakunimi'] . "%'";
		}

		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];	
		
		$sql = "SELECT id, nimi,(SELECT lyhenne FROM nimike WHERE id = nimike_id)  AS nimike, (SELECT (SELECT lyhenne FROM osasto WHERE id = osasto_id) AS kotiosasto FROM sijainenosasto WHERE osastotyyppi = 1 AND sijainen_id = sijainen.id LIMIT 1) AS kotiosasto, (SELECT GROUP_CONCAT((SELECT lyhenne FROM osasto WHERE id = osasto_id) ORDER BY (SELECT lyhenne FROM osasto WHERE id = osasto_id) SEPARATOR ', ') FROM sijainenosasto WHERE osastotyyppi = 0 AND sijainen_id = sijainen.id) AS muut_osastot,(SELECT GROUP_CONCAT((SELECT lyhenne FROM osasto WHERE id = osasto_id) ORDER BY (SELECT lyhenne FROM osasto WHERE id = osasto_id) SEPARATOR ', ') FROM sijainenosasto WHERE osastotyyppi = 2 AND sijainen_id = sijainen.id) AS mahd_osastot, kommentti, iv, laakelupa, puhelin, kiinnitys_sms, aktiivinen, (SELECT GROUP_CONCAT((SELECT nimi FROM toimialue WHERE id = toimialue_id) ORDER BY (SELECT id FROM toimialue WHERE id = toimialue_id) SEPARATOR ', ') FROM sijainentoimialue WHERE sijainen_id = sijainen.id) AS toimialueet, aktiivinen FROM sijainen WHERE id != 0" . $sijainenWhere . $toimialueWhere . $osastoWhere . $nimikeWhere . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);		
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['nimike'] = $row['nimike'];
			$row_array['kotiosasto'] = $row['kotiosasto'];
			$row_array['muut_osastot'] = $row['muut_osastot'];
			$row_array['mahd_osastot'] = $row['mahd_osastot'];
			$row_array['kommentti']	= $row['kommentti'];
			$row_array['iv'] = $row['iv'];
			$row_array['laakelupa']	= $row['laakelupa'];
			$row_array['puhelin'] = $row['puhelin'];
			$row_array['sms'] = $row['kiinnitys_sms'];
			if($row['toimialueet'] != null) {
				$row_array['toimialueet'] = $row['toimialueet'];
			}
			else {
				$row_array['toimialueet'] = "";
			}
			$row_array['aktiivinen'] = $row['aktiivinen'];
			
			array_push($return_arr,$row_array);
		}
		
		array_unshift($return_arr,$rivimaara);

		$con=null; $values=null;
		echo json_encode($return_arr);
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