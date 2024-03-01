<?php

include_once '../config/config.php';

	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT tyyppi, tyyppi AS suunnittelu_tyyppi, vari_hex FROM vuorotyyppi UNION SELECT tyyppi, vuorotyypit AS suunnittelu_tyyppi, vari_hex FROM vuoroyhdistelma ORDER BY tyyppi";
		$values = $con->prepare($sql);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['tyyppi'] = $row['tyyppi'];
			$row_array['suunnittelu_tyyppi'] = $row['suunnittelu_tyyppi'];
			$row_array['vari_hex'] = $row['vari_hex'];
			array_push($return_arr,$row_array);
		}
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
?>