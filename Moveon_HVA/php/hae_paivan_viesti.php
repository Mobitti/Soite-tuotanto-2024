<?php

include_once '../config/config.php';

if(isset($_POST['pvm']) 
&& isset($_POST['toimialue_id']))
{
	try
	{
		$viesti = "";
		$pvm = substr($_POST['pvm'], 6, 4)."-".substr($_POST['pvm'], 3, 2)."-".substr($_POST['pvm'], 0, 2);
		$toimialue_id = implode("",$_POST['toimialue_id']);
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT teksti FROM viesti WHERE pvm = :pvm AND toimialue_id = :toimialue_id ORDER BY id DESC";
		$values = $con->prepare($sql);
		$values->bindParam(':pvm', $pvm);
		$values->bindParam(':toimialue_id', $toimialue_id);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$viesti = $row['teksti'];
		}
	
		$con=null; $values=null;
		echo $viesti;
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