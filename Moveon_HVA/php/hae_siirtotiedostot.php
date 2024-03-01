<?php

include_once '../config/config.php';


	try
	{
		$return_arr = array();
		$hoitaja_tiedostot = array();
		$hoitaja_matka_tiedostot = array();
		$sihteeri_tiedostot = array();
		$sihteeri_matka_tiedostot = array();
		$paate = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$tiedostopolku = "..\\tiedostot\\"; //Win
		//$tiedostopolku = "../tiedostot/"; //Unix

		$paate =  "*_H_*.dat";
		$tiedostot = glob($tiedostopolku . $paate);
		usort($tiedostot,function($a,$b) {
			return filemtime($b) - filemtime($a);
		});
		foreach($tiedostot as $tiedosto) 
		{
			$tiedot['nimi'] = str_replace($tiedostopolku,"",$tiedosto);
			array_push($hoitaja_tiedostot,$tiedot);
		}

		$paate =  "*_HM_*.dat";
		$tiedostot = glob($tiedostopolku . $paate);
		usort($tiedostot,function($a,$b) {
			return filemtime($b) - filemtime($a);
		});
		foreach($tiedostot as $tiedosto) 
		{
			$tiedot['nimi'] = str_replace($tiedostopolku,"",$tiedosto);
			array_push($hoitaja_matka_tiedostot,$tiedot);
		}

		$paate =  "*_S_*.dat";
		$tiedostot = glob($tiedostopolku . $paate);
		usort($tiedostot,function($a,$b) {
			return filemtime($b) - filemtime($a);
		});
		foreach($tiedostot as $tiedosto) 
		{
			$tiedot['nimi'] = str_replace($tiedostopolku,"",$tiedosto);
			array_push($sihteeri_tiedostot,$tiedot);
		}

		$paate =  "*_SM_*.dat";
		$tiedostot = glob($tiedostopolku . $paate);
		usort($tiedostot,function($a,$b) {
			return filemtime($b) - filemtime($a);
		});
		foreach($tiedostot as $tiedosto) 
		{
			$tiedot['nimi'] = str_replace($tiedostopolku,"",$tiedosto);
			array_push($sihteeri_matka_tiedostot,$tiedot);
		}
		
		$return_arr["hoitajatiedostot"] = $hoitaja_tiedostot;
		$return_arr["hoitajamatkatiedostot"] = $hoitaja_matka_tiedostot;
		$return_arr["sihteeritiedostot"] = $sihteeri_tiedostot;
		$return_arr["sihteerimatkatiedostot"] = $sihteeri_matka_tiedostot;

		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}

?>