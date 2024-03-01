<?php

include_once '../config/config.php';

if(isset($_POST['hakunimi'])
&& isset($_POST['nimike_id'])
&& isset($_POST['toimialue_id'])
&& isset($_POST['reservilainentyyppi'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{
	try
	{
		$return_arr = array();
		$hakuWhere = "";
		$nimikeWhere = "";
		$toimialueWhere = "";
		$reservilainenWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		switch($_POST['reservilainentyyppi']) 
		{
			case 0: $reservilainenWhere = " AND aktiivinen = 1"; break;
			case 1: $reservilainenWhere = " AND aktiivinen = 0"; break;
		}
		
		if($_POST['hakunimi'] != "") {
			$hakuWhere = " AND nimi LIKE '%" . $_POST['hakunimi'] . "%'";
		}
		
		if($_POST['nimike_id'] != -1) {
			$nimikeWhere = " AND nimike_id = " . $_POST['nimike_id'];	
		}
		
		if($_POST['toimialue_id'] != -1) {
			$toimialueWhere = " AND id IN(SELECT DISTINCT reservilainen_id FROM reservilainentoimialue WHERE toimialue_id IN(" .  $_POST['toimialue_id'] . "))";
		}	
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, vakanssinumero, nimi, (SELECT lyhenne FROM nimike WHERE id = nimike_id) AS nimike, (SELECT GROUP_CONCAT((SELECT nimi FROM toimialue WHERE id = toimialue_id) ORDER BY (SELECT id FROM toimialue WHERE id = toimialue_id) SEPARATOR ', ') FROM reservilainentoimialue WHERE reservilainen_id = reservilainen.id) AS toimialueet, aktiivinen FROM reservilainen WHERE id != 0" . $reservilainenWhere . $nimikeWhere . $toimialueWhere . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['vakanssinumero'] = $row['vakanssinumero'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['nimike'] = $row['nimike'];
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
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>