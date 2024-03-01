<?php

include_once '../config/config.php';

if(isset($_POST['toimialue_idt'])
&& isset($_POST['sihteeritila'])
&& isset($_POST['hakusana']))
{
	try
	{
		$sijainen_idt = "";
		$return_arr = array();
		$toimialueWhere = "'" . implode("','",$_POST['toimialue_idt']) . "'";
		$hakusanaWhere = "";
		$sijaismaara_yht = 0;
		$suodatetut_sijaiset = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		//Hae kaikki sihteeri nimike_idt
		$sihteerinimike_idt = "";
		$sql = "SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%'";
		$values = $con->prepare($sql);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$sihteerinimike_idt .= "," . $row['id'];
		}

		if(strlen($sihteerinimike_idt) > 0) {
			$sihteerinimike_idt = substr($sihteerinimike_idt,1);
		}
		else {
			$sihteerinimike_idt = '-1';
		}
		
		if($_POST['sihteeritila']) {		
			//Kaikki sihteeri sijaiset
			$sql = "SELECT id FROM sijainen WHERE nimike_id IN(" . $sihteerinimike_idt . ") AND aktiivinen = 1 AND id IN(SELECT sijainen_id FROM sijainenosasto WHERE osastotyyppi = 1 AND ((SELECT toimialue_id FROM osasto WHERE osasto.id = osasto_id)) IN(" . $toimialueWhere . "))";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$sijainen_idt .= "," . $row['id'];
			}
			
			if(strlen($sijainen_idt) > 0) {
				$sijainen_idt = substr($sijainen_idt,1);
			}
			else {
				$sijainen_idt = '-1';
			}
		}
		else
		{
			//Kaikki hoitaja sijaiset
			$sql = "SELECT id FROM sijainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ") AND aktiivinen = 1 AND id IN(SELECT sijainen_id FROM sijainenosasto WHERE osastotyyppi = 1 AND ((SELECT toimialue_id FROM osasto WHERE osasto.id = osasto_id)) IN(" . $toimialueWhere . "))";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$sijainen_idt .= "," . $row['id'];
			}
			
			if(strlen($sijainen_idt) > 0) {
				$sijainen_idt = substr($sijainen_idt,1);
			}
			else {
				$sijainen_idt = '-1';
			}
		}
		
		//Suodatus
		if($_POST["hakusana"] != "") {
			$hakusanaWhere = " AND (nimi LIKE '%" . $_POST["hakusana"] . "%' OR nimike_id IN (SELECT id FROM nimike WHERE CONCAT('(',lyhenne) LIKE '%" . $_POST["hakusana"] . "%'))";
		}
		
		$sql = "SELECT id, nimi, (SELECT lyhenne FROM nimike WHERE id = nimike_id) AS nimike FROM sijainen WHERE id IN(" . $sijainen_idt . ")" . $hakusanaWhere . " ORDER BY nimi ASC";
		$values = $con->prepare($sql);
		$values->execute();
		$sijaiset = $values->fetchAll(PDO::FETCH_ASSOC);
		for($i = 0; $i < count($sijaiset); $i++)
		{
			$osasto_idt = "";
			$sql = "SELECT osasto_id FROM sijainenosasto WHERE sijainen_id = :sijainen_id ORDER BY FIELD(osastotyyppi,'1','0','2'), (SELECT toimialue_id FROM osasto WHERE id = osasto_id), (SELECT lyhenne FROM osasto WHERE id = osasto_id)";
			$values = $con->prepare($sql);	
			$values->bindParam(':sijainen_id', $sijaiset[$i]['id']);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$osasto_idt .= "," . $row['osasto_id'];
			}
			if(strlen($osasto_idt) > 0) {
				$osasto_idt = substr($osasto_idt,1);
			}
			
			$sijaisen_tiedot['id'] = $sijaiset[$i]['id'];
			$sijaisen_tiedot['nimi'] = $sijaiset[$i]['nimi'];
			$sijaisen_tiedot['nimike'] = $sijaiset[$i]['nimike'];
			$sijaisen_tiedot['osasto_idt'] = $osasto_idt;
			array_push($return_arr,$sijaisen_tiedot);
			$suodatetut_sijaiset++;
		}
		
		if($hakusanaWhere != "") {
			$sql = "SELECT COUNT(id) AS maara FROM sijainen WHERE id IN(" . $sijainen_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$sijaismaara['maara'] = $row['maara'];
			}
		}
		else {
			$sijaismaara['maara'] = $suodatetut_sijaiset;
		}
		
		array_unshift($return_arr,$sijaismaara);

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