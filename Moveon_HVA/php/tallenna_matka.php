<?php

include_once '../config/config.php';

if(isset($_POST['id'])
&& isset($_POST['sijainen_id'])
&& isset($_POST['vuoro_id'])
&& isset($_POST['pvm'])
&& isset($_POST['matka'])
&& isset($_POST['selite'])
&& isset($_POST['lahtoaika'])
&& isset($_POST['paluuaika'])
&& isset($_POST['km']))
{
	try
	{
		$kustannusosasto_id = null;
		$pvm = substr($_POST['pvm'], 6, 4) . "-" . substr($_POST['pvm'], 3, 2) . "-" . substr($_POST['pvm'], 0, 2);
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "INSERT INTO matka (id, sijainen_id, vuoro_id, pvm, matka, selite, lahtoaika, paluuaika, km, tila) VALUES(NULL, :sijainen_id, :vuoro_id, :pvm, :matka, :selite, :lahtoaika, :paluuaika, :km, 0)";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
			$values->bindParam(':vuoro_id', $_POST['vuoro_id']);
			$values->bindParam(':pvm', $pvm);
			$values->bindParam(':matka', $_POST['matka']);
			$values->bindParam(':selite', $_POST['selite']);
			$values->bindParam(':lahtoaika', $_POST['lahtoaika']);
			$values->bindParam(':paluuaika', $_POST['paluuaika']);	
			$values->bindParam(':km', $_POST['km']);	
			$values->execute();
		}
		else {
			$sql = "UPDATE matka SET matka = :matka, selite = :selite, lahtoaika = :lahtoaika, paluuaika = :paluuaika, km = :km WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':matka', $_POST['matka']);
			$values->bindParam(':selite', $_POST['selite']);
			$values->bindParam(':lahtoaika', $_POST['lahtoaika']);
			$values->bindParam(':paluuaika', $_POST['paluuaika']);
			$values->bindParam(':km', $_POST['km']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();	
		}
		
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