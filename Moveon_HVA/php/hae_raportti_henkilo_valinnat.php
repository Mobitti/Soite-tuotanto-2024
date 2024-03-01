<?php

include_once '../config/config.php';

if(isset($_POST['toimialue_idt'])
&& isset($_POST['palvelualue_idt'])
&& isset($_POST['jarjestys'])
&& isset($_POST['henkilosto']))
{
	try
	{
		$return_arr = array();
		$jarjestys = "";
		$henkilo_idt = "";
		$henkilot = array();
		
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
			$sihteerinimike_idt .= ",'" . $row['id'] ."'";
		}
		
		if(strlen($sihteerinimike_idt) > 0) {
			$sihteerinimike_idt = substr($sihteerinimike_idt,1);
		}
		else {
			$sihteerinimike_idt = '-1';
		}

		switch($_POST['henkilosto'])
		{
			case 0: $sql = "SELECT id, nimi FROM sijainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ") AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN(" . $_POST['toimialue_idt'] .")) ORDER BY nimi"; break;
			case 1: $sql = "SELECT id, nimi FROM sijainen WHERE nimike_id IN(" . $sihteerinimike_idt . ") AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN(" . $_POST['toimialue_idt'] .")) ORDER BY nimi"; break;
			case 2: $sql = "SELECT id, nimi FROM reservilainen WHERE id IN(SELECT DISTINCT reservilainen_id FROM reservilainentoimialue WHERE toimialue_id IN(" . $_POST['toimialue_idt'] .")) ORDER BY nimi"; break;
			case 3: $sql = "SELECT id, nimi FROM sihteeri WHERE id IN(SELECT DISTINCT sihteeri_id FROM sihteeripalvelualue WHERE palvelualue_id IN(" . $_POST['palvelualue_idt'] .")) ORDER BY nimi"; break;
			default: echo "parametri"; exit;
		}
		/*
		$values = $con->prepare($sql);
		$values->execute();	
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$henkilo_idt .= ",'" . $row['id'] . "'";
		}
		
		if(strlen($henkilo_idt) > 0) {
			$henkilo_idt = substr($henkilo_idt,1);
		}
		else {
			$henkilo_idt = '-1';
		}

			
		if($_POST['jarjestys'] != '') {
			switch($_POST['jarjestys'])
			{
				case 'nimi': $jarjestys = " ORDER BY nimi"; break;
				case 'toimialue-nimi': $jarjestys = " ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), nimi"; break;
				case 'palvelualue-nimi': $jarjestys = " ORDER BY (SELECT nimi FROM palvelualue WHERE id = palvelualue_id), nimi"; break;
			}
		}
		
		if($_POST['henkilosto'] == 0 || $_POST['henkilosto'] == 1) {
			$sql = "SELECT sijainen_id AS id, (SELECT nimi FROM sijainen WHERE id = sijainen_id) AS nimi, (SELECT vari_hex FROM toimialue WHERE id = toimialue_id) AS taustavari FROM sijainentoimialue WHERE toimialue_id IN (" . $_POST['toimialue_idt'] . ") AND sijainen_id IN(" . $henkilo_idt . ")"  . $jarjestys;
		}
		else if($_POST['henkilosto'] == 2) {
			$sql = "SELECT reservilainen_id AS id, (SELECT nimi FROM reservilainen_id WHERE id = reservilainen_id) AS nimi, (SELECT vari_hex FROM toimialue WHERE id = toimialue_id) AS taustavari FROM reservilainentoimialue WHERE toimialue_id IN (" . $_POST['toimialue_idt'] . ") AND reservilainen_id IN(" . $henkilo_idt . ")"  . $jarjestys; 
		}
		else {
			$sql = "SELECT sihteeri_id AS id, (SELECT nimi FROM sihteeri WHERE id = sihteeri_id) AS nimi, (SELECT vari_hex FROM palvelualue WHERE id = palvelualue_id) AS taustavari FROM sihteeripalvelualue WHERE palvelualue_id IN (" . $_POST['palvelualue_idt'] . ") AND sihteeri_id IN(" . $henkilo_idt . ")"  . $jarjestys; 
		}
		*/


		$values = $con->prepare($sql);
		$values->execute();
		$henkilot = $values->fetchAll(PDO::FETCH_ASSOC);
		for($i = 0; $i < count($henkilot); $i++)
		{
			$row_array['id'] = $henkilot[$i]['id'];
			$row_array['nimi'] = $henkilot[$i]['nimi'];
			/*
			if($henkilot[$i]['taustavari'] != null && $henkilot[$i]['taustavari'] != "") {
				$row_array['taustavari'] = $henkilot[$i]['taustavari'];
			}
			else {
				$row_array['taustavari'] = "#ffffff";
			}
			*/
			$row_array['taustavari'] = "#ffffff";
			array_push($return_arr,$row_array);
		}
	
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