<?php

include_once '../config/config.php';

if(isset($_POST['matka_idt']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
        $sql = "UPDATE matka SET tila = 1 WHERE id IN (" . $_POST['matka_idt'] . ")";
        $values = $con->prepare($sql);
        $values->execute();	
		
		$con=null; $values=null;
	}  
	catch(PDOException $e)
	{
		$con=null; $values=null;
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>