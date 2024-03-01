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
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['hakusana'] != "") {
			$hakuWhere = " WHERE nimi LIKE '%" . $_POST['hakusana'] . "%'";
		}
		
		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		
		$sql = "SELECT id, lyhenne, nimi, vari_hex, aktiivinen FROM toimialue" . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->execute();
		
		while ($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id'] = $row['id'];
			$row_array['lyhenne'] = $row['lyhenne'];
			$row_array['nimi'] = $row['nimi'];
			$row_array['vari_hex'] = $row['vari_hex'];
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