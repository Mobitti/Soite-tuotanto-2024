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
		$osasto_idt = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['hakusana'] != "") {
			$sql = "SELECT id FROM osasto WHERE lyhenne LIKE '%" . $_POST['hakusana'] . "%' OR nimi LIKE '%". $_POST['hakusana'] . "%'";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC)){
				$osasto_idt .= ",'" . $row['id'] . "'";
			}
			if(strlen($osasto_idt) > 0) {
				$osasto_idt = substr($osasto_idt,1);
				$hakuWhere = " WHERE osasto_id IN (" . $osasto_idt . ")";
			}
			else {
				array_unshift($return_arr,$rivimaara);
				$con=null; $values=null;
				echo json_encode($return_arr);
			}
		}
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, osasto_id, (SELECT raporttinumero FROM osasto WHERE id = osasto_id) AS raporttinumero, (SELECT nimi FROM osasto WHERE id = osasto_id) AS osasto, hinta, alku_pvm, loppu_pvm FROM reservikustannus" . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['osasto_id'] = $row['osasto_id'];
			$row_array['raporttinumero'] = $row['raporttinumero'];
			$row_array['osasto'] = $row['osasto'];
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