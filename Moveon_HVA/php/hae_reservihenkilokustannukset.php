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
		$reservilainen_idt = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['hakusana'] != "") {
			$sql = "SELECT id FROM reservilainen WHERE nimi LIKE '%". $_POST['hakusana'] . "%'";
			$values = $con->prepare($sql);
			$values->execute();
			while($row = $values->fetch(PDO::FETCH_ASSOC)){
				$reservilainen_idt .= ",'" . $row['id'] . "'";
			}
			if(strlen($reservilainen_idt) > 0) {
				$reservilainen_idt = substr($reservilainen_idt,1);
				$hakuWhere = " WHERE reservilainen_id IN (" . $reservilainen_idt . ")";
			}
			else {
				array_unshift($return_arr,$rivimaara);
				$con=null; $values=null;
				echo json_encode($return_arr);
			}
		}
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, reservilainen_id, (SELECT nimi FROM reservilainen WHERE id = reservilainen_id) AS reservilainen, hinta, alku_pvm, loppu_pvm FROM reservihenkilokustannus" . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['reservilainen_id'] = $row['reservilainen_id'];
			$row_array['reservilainen'] = $row['reservilainen'];
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