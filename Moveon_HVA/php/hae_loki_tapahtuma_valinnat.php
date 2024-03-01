<?php

include_once '../config/config.php';

if(isset($_POST['nakyma']))
{
	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT DISTINCT(tapahtuma) FROM lokitapahtuma ORDER BY tapahtuma ASC";
		$values = $con->prepare($sql);
		$values->bindParam(':viesti', $_POST['viesti']);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{ 
			$row_array['tapahtuma'] = $row['tapahtuma'];
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