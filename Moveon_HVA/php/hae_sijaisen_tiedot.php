<?php

include_once '../config/config.php';


if(isset($_POST['id']))
{
	try
	{
		$data_array = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		/*Sijaisen tiedot*/
		$sql = "SELECT nimi, nimike_id, iv, laakelupa, kommentti, puhelin, kiinnitys_sms, aktiivinen, pin FROM sijainen WHERE id = :id";			
		$values = $con->prepare($sql);		
		$values->bindParam(':id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$row_array['nimi']	= $row['nimi'];	
			$row_array['nimike_id']	= $row['nimike_id'];
			$row_array['iv']	= $row['iv'];
			$row_array['laakelupa']	= $row['laakelupa'];
			$row_array['kommentti']	= $row['kommentti'];
			$row_array['puhelin'] = $row['puhelin'];
			$row_array['kiinnitys_sms'] = $row['kiinnitys_sms'];
			$row_array['aktiivinen'] = $row['aktiivinen'];
			$row_array['pin'] = $row['pin'];
		}
		
		/*Kotiosasto*/
		$sql = "SELECT osasto_id AS kotiosasto_id, (SELECT nimi FROM toimialue WHERE toimialue.id = (SELECT toimialue_id FROM osasto WHERE osasto.id = osasto_id)) AS toimialue_nimi FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osastotyyppi = 1";
		$values = $con->prepare($sql);	
		$values->bindParam(':sijainen_id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$row_array['kotiosasto_id'] = $row['kotiosasto_id'];
			$row_array['toimialue_nimi'] = $row['toimialue_nimi'];
		}
		
		/*Muut osastot*/
		$muut_osasto_idt = "";
		$sql = "SELECT osasto_id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osastotyyppi = 0";
		$values = $con->prepare($sql);	
		$values->bindParam(':sijainen_id', $_POST['id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$muut_osasto_idt .= "," . $row['osasto_id'];
		}
		if(strlen($muut_osasto_idt) > 0) {
			$muut_osasto_idt = substr($muut_osasto_idt,1);
		}
		$row_array['muut_osasto_idt'] = $muut_osasto_idt;
		
		/*Mahdolliset osastot*/
		$mahd_osasto_idt = "";
		$sql = "SELECT osasto_id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osastotyyppi = 2";
		$values = $con->prepare($sql);	
		$values->bindParam(':sijainen_id', $_POST['id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$mahd_osasto_idt .= "," . $row['osasto_id'];
		}
		if(strlen($mahd_osasto_idt) > 0) {
			$mahd_osasto_idt = substr($mahd_osasto_idt,1);
		}
		$row_array['mahd_osasto_idt'] = $mahd_osasto_idt;
		
		/*Toimialueet*/
		$toimialue_idt = "";
		$sql = "SELECT toimialue_id FROM sijainentoimialue WHERE sijainen_id = :sijainen_id";
		$values = $con->prepare($sql);	
		$values->bindParam(':sijainen_id', $_POST['id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$toimialue_idt .= "," . $row['toimialue_id'];
		}
		if(strlen($toimialue_idt) > 0) {
			$toimialue_idt = substr($toimialue_idt,1);
		}
		$row_array['toimialue_idt'] = $toimialue_idt;
		
		
		array_push($data_array,$row_array);

		$con=null; $values=null;
		echo json_encode($data_array);
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