<?php

include_once '../config/config.php';

if(isset($_POST['laitetunnus'])
&& isset($_POST['tila']))
{
	try
	{
		$return_arr = array();
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "UPDATE vuorovarausviesti SET tila = :tila WHERE laitetunnus = :laitetunnus";
		$values = $con->prepare($sql);
		$values->bindParam(':tila', $_POST['tila']);
		$values->bindParam(':laitetunnus', $_POST['laitetunnus']);
		$values->execute();
		
		$con=null; $values=null;
		//echo json_encode($return_arr);
		echo "0";
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