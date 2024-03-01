<?php

include_once '../config/config.php';

if(isset($_POST['pvm']) 
&& isset($_POST['teksti'])
&& isset($_POST['toimialue_id']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$toimialue_id = implode("",$_POST['toimialue_id']);
		
		$sql = "SELECT id FROM viesti WHERE pvm = :pvm AND toimialue_id = :toimialue_id";
		$values = $con->prepare($sql);
		$values->bindParam(':pvm', $_POST['pvm']);
		$values->bindParam(':toimialue_id', $_toimialue_id);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		
		if($row != null) {
			$viesti_id = $row['id'];
			if($_POST['teksti'] == '') {
				$sql = "DELETE FROM viesti WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $viesti_id);
				$values->execute();
			}
			else {
				$sql = "UPDATE viesti SET teksti = :teksti WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':teksti', $_POST['teksti']);
				$values->bindParam(':id', $viesti_id);
				$values->execute();
			}
		}
		else if($_POST['teksti'] != '') {
			$sql = "INSERT INTO viesti (id, teksti, pvm, toimialue_id) VALUES(NULL, :teksti, :pvm, :toimialue_id)";
			$values = $con->prepare($sql);
			$values->bindParam(':teksti', $_POST['teksti']);
			$values->bindParam(':pvm', $_POST['pvm']);
			$values->bindParam(':toimialue_id', $toimialue_id);
			$values->execute();
		}
		
		$con=null; $values=null;
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