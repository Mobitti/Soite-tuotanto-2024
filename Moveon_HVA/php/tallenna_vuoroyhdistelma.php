<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['tyyppi'])
&& isset($_POST['vuorotyypit'])
&& isset($_POST['kuvaus'])
&& isset($_POST['vari_hex']))
{
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM vuoroyhdistelma WHERE tyyppi = :tyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;
				return;
			}

			$sql = "INSERT INTO vuoroyhdistelma (id,tyyppi, vuorotyypit, kuvaus, vari_hex) VALUES(NULL, :tyyppi, :vuorotyypit, :kuvaus, :vari_hex)";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':vuorotyypit', $_POST['vuorotyypit']);
			$values->bindParam(':kuvaus', $_POST['kuvaus']);
			$values->bindParam(':vari_hex', $_POST['vari_hex']);
			$values->execute();
		}
		else {
			$sql = "SELECT id FROM vuoroyhdistelma WHERE tyyppi = :tyyppi AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;
				return;
			}

			$sql = "UPDATE vuoroyhdistelma SET tyyppi = :tyyppi, vuorotyypit = :vuorotyypit, kuvaus = :kuvaus, vari_hex = :vari_hex WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':vuorotyypit', $_POST['vuorotyypit']);
			$values->bindParam(':kuvaus', $_POST['kuvaus']);
			$values->bindParam(':vari_hex', $_POST['vari_hex']);
			$values->bindParam(':id', $_POST['id']);
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