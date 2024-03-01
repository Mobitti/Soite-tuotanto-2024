<?php

include_once '../config/config.php';

if(isset($_POST['palautettavat_matka_idt'])
&& isset($_POST['hyvaksytyt_matka_idt']))
{
	try
	{
		$return_arr = array();
		$hylatyt_rivi_paivitykset = 0;
		$hyvaksytty_rivi_paivitykset = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
        if($_POST['palautettavat_matka_idt'] != "") {
            $sql = "UPDATE matka SET tila = 2 WHERE id IN (" . $_POST['palautettavat_matka_idt'] . ")";
            $values = $con->prepare($sql);
			$values->execute();
			$palautetut_rivi_paivitykset = $values->rowCount();
        }
       
        if($_POST['hyvaksytyt_matka_idt'] != "") {
            $sql = "UPDATE matka SET tila = 3 WHERE id IN (" . $_POST['hyvaksytyt_matka_idt'] . ")";
            $values = $con->prepare($sql);
			$values->execute();
			$hyvaksytty_rivi_paivitykset = $values->rowCount();
		}
		
		$return_arr['palautetut_rivi_paivitykset'] = $palautetut_rivi_paivitykset;
		$return_arr['hyvaksytyt_rivi_paivitykset'] = $hyvaksytty_rivi_paivitykset;
		
		$con=null; $values=null;
		echo json_encode($return_arr);
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