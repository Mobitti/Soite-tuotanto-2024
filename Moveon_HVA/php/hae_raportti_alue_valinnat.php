<?php

include_once '../config/config.php';

if(isset($_POST['raporttityyppi'])
&& isset($_POST['alue_idt']))
{
	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['raporttityyppi'] < 6 || $_POST['raporttityyppi'] == 11) {
			$sql = "SELECT id, nimi, vari_hex FROM toimialue WHERE id IN(" . $_POST['alue_idt'] . ") ORDER BY nimi";
		}
		else {
			$sql = "SELECT id, nimi, vari_hex FROM palvelualue ORDER BY nimi";
		}
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id'];
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