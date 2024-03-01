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
		
		$sql = "SELECT vakanssinumero, nimi, nimike_id, aktiivinen FROM sihteeri WHERE id = :id";			
		$values = $con->prepare($sql);		
		$values->bindParam(':id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$row_array['vakanssinumero'] = $row['vakanssinumero'];	
			$row_array['nimi'] = $row['nimi'];	
			$row_array['nimike_id']	= $row['nimike_id'];
			$row_array['aktiivinen'] = $row['aktiivinen'];	
		}
		
		/*palvelualueet*/
		$palvelualue_idt = "";
		$sql = "SELECT palvelualue_id FROM sihteeripalvelualue WHERE sihteeri_id = :sihteeri_id";
		$values = $con->prepare($sql);	
		$values->bindParam(':sihteeri_id', $_POST['id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$palvelualue_idt .= "," . $row['palvelualue_id'];
		}
		if(strlen($palvelualue_idt) > 0) {
			$palvelualue_idt = substr($palvelualue_idt,1);
		}
		$row_array['palvelualue_idt'] = $palvelualue_idt;
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