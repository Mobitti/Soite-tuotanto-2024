<?php

include_once '../config/config.php';

if(isset($_POST['jarjestys']))
{
	try
	{
		$return_arr = array();
		$toimialueWhere = "";
		$jarjestys = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['jarjestys'] != '') {
			switch($_POST['jarjestys'])
			{
				case 'raporttinumero':	$jarjestys = " ORDER by raporttinumero"; break;
				case 'lyhenne':	$jarjestys = " ORDER BY lyhenne"; break;
				case 'nimi':	$jarjestys = " ORDER BY nimi"; break;
				case 'toimialue-nimi': $jarjestys = " ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), nimi";
				case 'toimialue-raporttinumero': $jarjestys = " ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
			}
		}
		$sql = "SELECT id, raporttinumero, lyhenne, nimi, toimialue_id, (SELECT nimi FROM toimialue WHERE id = toimialue_id) AS toimialue_nimi, (SELECT vari_hex FROM toimialue WHERE id = toimialue_id) AS taustavari, aktiivinen FROM osasto" . $jarjestys;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$row_array['id'] = $row['id']; 
			$row_array['raporttinumero'] = $row['raporttinumero'];
			$row_array['lyhenne'] = $row['lyhenne'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['toimialue_id'] = $row['toimialue_id'];
			if($row['toimialue_nimi'] != null) {
				$row_array['toimialue_nimi'] = $row['toimialue_nimi'];
			}
			else {
				$row_array['toimialue_nimi'] = "Kaikki";
			}
			if($row['taustavari'] != null) {
				$row_array['taustavari'] = $row['taustavari'];
			}
			else {
				$row_array['taustavari'] = "#ffffff";
			}
			
			$row_array['aktiivinen'] = $row['aktiivinen'];
			
			
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