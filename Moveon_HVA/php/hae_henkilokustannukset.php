<?php

include_once '../config/config.php';

if(isset($_POST['hakusana'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{
	try
	{
		$return_arr = array();
		$hakuWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		$sijainen_idt = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['hakusana'] != "") {
			$sql = "SELECT id FROM sijainen WHERE nimi LIKE '%". $_POST['hakusana'] . "%'";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC)){
				$sijainen_idt .= ",'" . $row['id'] . "'";
			}
			
			if(strlen($sijainen_idt) > 0) {
				$sijainen_idt = substr($sijainen_idt,1);
				$hakuWhere = " WHERE sijainen_id IN (" . $sijainen_idt . ")";
			}
			else {
				array_unshift($return_arr,$rivimaara);
				$con=null; $values=null;
				echo json_encode($return_arr);
				return;
			}
		}
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, sijainen_id, (SELECT nimi FROM sijainen WHERE id = sijainen_id) AS sijainen, hinta, alku_pvm, loppu_pvm FROM henkilokustannus" . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['sijainen_id'] = $row['sijainen_id'];
			$row_array['sijainen'] = $row['sijainen'];
			$row_array['hinta'] = $row['hinta'];
			$row_array['alku_pvm'] = substr($row['alku_pvm'], 8, 2) . "." . substr($row['alku_pvm'], 5, 2) . "." . substr($row['alku_pvm'], 0, 4); 
			$row_array['loppu_pvm'] = substr($row['loppu_pvm'], 8, 2) . "." . substr($row['loppu_pvm'], 5, 2) . "." . substr($row['loppu_pvm'], 0, 4);
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