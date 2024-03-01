<?php

include_once '../config/config.php';

if(isset($_POST['palvelualue_idt']))
{
	try
	{
		$return_arr = array();
		$palvelualueWhere = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['palvelualue_idt'] != -1) {
			$palvelualueWhere = " WHERE id IN(" . $_POST['palvelualue_idt'] . ")";
		}
		$sql = "SELECT id, kustannusnumero, lyhenne, nimi, vari_hex FROM palvelualue" . $palvelualueWhere . " ORDER BY nimi";
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id'];
			$row_array['kustannusnumero'] = $row['kustannusnumero'];
			$row_array['lyhenne'] = $row['lyhenne'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['taustavari'] = $row['vari_hex'];
			
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
?>