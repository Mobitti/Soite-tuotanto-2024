<?php

include_once '../config/config.php';

if(isset($_POST['hakunimi'])
&& isset($_POST['nimike_id'])
&& isset($_POST['palvelualue_id'])
&& isset($_POST['sihteerityyppi'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{
	try
	{
		$return_arr = array();
		$hakuWhere = "";
		$nimikeWhere = "";
		$palvelualueWhere = "";
		$sihteeriWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		switch($_POST['sihteerityyppi']) 
		{
			case 0: $sihteeriWhere = " AND aktiivinen = 1"; break;
			case 1: $sihteeriWhere = " AND aktiivinen = 0"; break;
		}
		
		if($_POST['hakunimi'] != "") {
			$hakuWhere = " AND nimi LIKE '%" . $_POST['hakunimi'] . "%'";
		}
		
		if($_POST['nimike_id'] != -1) {
			$nimikeWhere = " AND nimike_id = " . $_POST['nimike_id'];	
		}
		
		if($_POST['palvelualue_id'] != -1) {
			$toimialueWhere = " AND id IN(SELECT DISTINCT sihteeri_id FROM sihteeripalvelualue WHERE palvelualue_id IN(" .  $_POST['palvelualue_id'] . "))";
		}	
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, vakanssinumero, nimi, (SELECT lyhenne FROM nimike WHERE id = nimike_id) AS nimike, (SELECT GROUP_CONCAT((SELECT nimi FROM palvelualue WHERE id = palvelualue_id) ORDER BY (SELECT id FROM palvelualue WHERE id = palvelualue_id) SEPARATOR ', ') FROM sihteeripalvelualue WHERE sihteeri_id = sihteeri.id) AS palvelualueet, aktiivinen FROM sihteeri WHERE id != 0" . $sihteeriWhere . $nimikeWhere . $palvelualueWhere . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['vakanssinumero'] = $row['vakanssinumero'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['nimike'] = $row['nimike'];
			if($row['palvelualueet'] != null) {
				$row_array['palvelualueet'] = $row['palvelualueet'];
			}
			else {
				$row_array['palvelualueet'] = "";
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
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>