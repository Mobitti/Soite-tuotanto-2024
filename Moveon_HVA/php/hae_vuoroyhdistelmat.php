<?php

include_once '../config/config.php';

	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT id, tyyppi, vuorotyypit, kuvaus, vari_hex FROM vuoroyhdistelma ORDER BY vuorotyypit";
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id'];
			$row_array['tyyppi'] = $row['tyyppi'];
			$row_array['vuorotyypit'] = $row['vuorotyypit'];
			$row_array['kuvaus'] = $row['kuvaus'];
			$row_array['vari_hex'] = $row['vari_hex'];
			$row_array['vuorotyyppi_tiedot'] = preg_split('//u',$row['vuorotyypit'],-1,PREG_SPLIT_NO_EMPTY);
			array_push($return_arr,$row_array);
		}
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
