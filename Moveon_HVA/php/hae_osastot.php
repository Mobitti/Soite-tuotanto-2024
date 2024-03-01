<?php

include_once '../config/config.php';

if(isset($_POST['hakusana'])
&& isset($_POST['osastotyyppi'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{
	try
	{
		$return_arr = array();
		$hakuWhere = "";
		$osastoWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['hakusana'] != "") {
			$hakuWhere = " AND lyhenne LIKE '%" . $_POST['hakusana'] . "%' OR nimi LIKE '%" . $_POST['hakusana'] . "%' OR raporttinumero LIKE '%" . $_POST['hakusana'] . "%'";
		}
		
		switch($_POST['osastotyyppi']) 
		{
			case 0: $osastoWhere = " AND aktiivinen = 1"; break;
			case 1: $osastoWhere = " AND aktiivinen = 0"; break;
		}
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, lyhenne, nimi, raporttinumero,
		(SELECT hinta FROM kustannus WHERE osasto_id = osasto.id AND alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) AS si_h_kustannus,
		(SELECT hinta FROM kustannus WHERE osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%Sihteeri%' OR nimi LIKE '%Sihteeri%') AND alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE() LIMIT 1) AS si_s_kustannus,
		(SELECT hinta FROM sihteerikustannus WHERE alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) AS s_kustannus,
		(SELECT hinta FROM reservikustannus WHERE osasto_id = osasto.id AND alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) AS r_kustannus,
		(SELECT nimi FROM toimialue WHERE id = toimialue_id) AS toimialue, toimialue_id, (SELECT nimi FROM palvelualue WHERE id = palvelualue_id) AS palvelualue, palvelualue_id, aktiivinen FROM osasto WHERE id != 0" . $hakuWhere . $osastoWhere . $jarjestysOrder;

		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['lyhenne'] = $row['lyhenne'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['raporttinumero'] = $row['raporttinumero'];
			if($row['toimialue_id'] == 0) {
				$row_array['toimialue'] = "Kaikki";
			}
			else {
				$row_array['toimialue'] = $row['toimialue'];
			}
			
			if($row['palvelualue_id'] == 0) {
				$row_array['palvelualue'] = "Kaikki";
			}
			else {
				$row_array['palvelualue'] = $row['palvelualue'];
			}

			$row_array['toimialue_id'] = $row['toimialue_id'];			
			$row_array['palvelualue_id'] = $row['palvelualue_id'];
			
			if($row['si_h_kustannus'] == null) {
				$row_array['si_h_kustannus'] = "-";
			}
			else {
				$row_array['si_h_kustannus'] = $row['si_h_kustannus'];
			}
			
			if($row['si_s_kustannus'] == null || $row['raporttinumero'] < 1000) {
				$row_array['si_s_kustannus'] = "-";
			}
			else {
				$row_array['si_s_kustannus'] = $row['si_s_kustannus'];
			}
			
			if($row['r_kustannus'] == null) {
				$row_array['r_kustannus'] = "-";
			}
			else {
				$row_array['r_kustannus'] = $row['r_kustannus'];
			}
			
			if($row['s_kustannus'] == null || $row['raporttinumero'] < 1000) {
				$row_array['s_kustannus'] = "-";
			}
			else {
				$row_array['s_kustannus'] = $row['s_kustannus'];
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