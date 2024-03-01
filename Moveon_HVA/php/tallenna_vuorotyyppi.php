<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['tyyppi'])
&& isset($_POST['kuvaus'])
&& isset($_POST['vari_hex'])
&& isset($_POST['vuoronakymassa']))
{
	try
	{
		$return_arr = array();
		$paivitettava_vuorotyyppi = "";
		$paivitetyt_tiedot = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM vuorotyyppi WHERE tyyppi = :tyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa-tyyppi";
				$con=null; $values=null;
				return;
			}
			
			$sql = "SELECT id FROM vuoroyhdistelma WHERE tyyppi = :tyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa-nappain";
				$con=null; $values=null;
				return;
			}

			$sql = "INSERT INTO vuorotyyppi (id,tyyppi, kuvaus, vari_hex, vuoronakymassa) VALUES(NULL, :tyyppi, :kuvaus, :vari_hex, :vuoronakymassa)";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':kuvaus', $_POST['kuvaus']);
			$values->bindParam(':vari_hex', $_POST['vari_hex']);
			$values->bindParam(':vuoronakymassa', $_POST['vuoronakymassa']);
			$values->execute();
		}
		else {
			$sql = "SELECT id FROM vuorotyyppi WHERE tyyppi = :tyyppi AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa-tyyppi";
				$con=null; $values=null;
				return;
			}
			
			$sql = "SELECT id FROM vuoroyhdistelma WHERE tyyppi = :tyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				echo "olemassa-nappain";
				$con=null; $values=null;
				return;
			}
			
			//Haetaan vanha vuorotyyppi
			$sql = "SELECT tyyppi FROM vuorotyyppi WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$paivitettava_vuorotyyppi = $row['tyyppi'];
			}
			
			if($paivitettava_vuorotyyppi != "") {
				//Päivitetään suunniteltujenvuorojen vuorotyypit
				$suunniteltuvuoro_idt = array();
				$sql = "SELECT id FROM suunniteltuvuoro WHERE vuorotyyppi = :vuorotyyppi";
				$values = $con->prepare($sql);
				$values->bindParam(':vuorotyyppi', $paivitettava_vuorotyyppi);
				$values->execute();
				while($row = $values->fetch(PDO::FETCH_ASSOC)) 
				{
					array_push($suunniteltuvuoro_idt,$row['id']);
				}
				if(count($suunniteltuvuoro_idt) > 0) {
					$sql = "UPDATE suunniteltuvuoro SET vuorotyyppi = :vuorotyyppi WHERE id IN('" . implode("','",$suunniteltuvuoro_idt) . "')";
					$values = $con->prepare($sql);
					$values->bindParam(':vuorotyyppi', $_POST['tyyppi']);
					$values->execute();
					$paivitetyt_tiedot["suunnitellutvuorot"] = $values->rowCount();
				}
				
				//Päivitetään vuorojen vuorotyypit
				$vuoro_idt = array();
				$sql = "SELECT id FROM vuoro WHERE vuorotyyppi = :vuorotyyppi";
				$values = $con->prepare($sql);
				$values->bindParam(':vuorotyyppi', $paivitettava_vuorotyyppi);
				$values->execute();
				while($row = $values->fetch(PDO::FETCH_ASSOC)) 
				{
					array_push($vuoro_idt,$row['id']);
				}
				if(count($vuoro_idt) > 0) {
					$sql = "UPDATE vuoro SET vuorotyyppi = :vuorotyyppi WHERE id IN('" . implode("','",$vuoro_idt) . "')";
					$values = $con->prepare($sql);
					$values->bindParam(':vuorotyyppi', $_POST['tyyppi']);
					$values->execute();
					$paivitetyt_tiedot["vuorot"] = $values->rowCount();
				}
				
				$vuorolukitus_idt = array();
				$sql = "SELECT id FROM vuorolukitus WHERE vuorotyyppi = :vuorotyyppi";
				$values = $con->prepare($sql);
				$values->bindParam(':vuorotyyppi', $paivitettava_vuorotyyppi);
				$values->execute();
				while($row = $values->fetch(PDO::FETCH_ASSOC)) 
				{
					array_push($vuorolukitus_idt,$row['id']);
				}
				if(count($vuorolukitus_idt) > 0) {
					$sql = "UPDATE vuorolukitus SET vuorotyyppi = :vuorotyyppi WHERE id IN('" . implode("','",$vuorolukitus_idt) . "')";
					$values = $con->prepare($sql);
					$values->bindParam(':vuorotyyppi', $_POST['tyyppi']);
					$values->execute();
					$paivitetyt_tiedot["vuorolukitukset"] = $values->rowCount();
				}
				
				$vuoroyhdistelma_idt = array();
				$sql = "SELECT id FROM vuoroyhdistelma WHERE vuorotyypit LIKE '%" . $paivitettava_vuorotyyppi . "%'";
				$values = $con->prepare($sql);
				$values->execute();
				while($row = $values->fetch(PDO::FETCH_ASSOC)) 
				{
					array_push($vuoroyhdistelma_idt,$row['id']);
				}
				if(count($vuoroyhdistelma_idt) > 0) {
					$sql = "UPDATE vuoroyhdistelma SET vuorotyypit = REPLACE(vuorotyypit,:vuorotyyppi,:uusi_vuorotyyppi) WHERE id IN('" . implode("','",$vuoroyhdistelma_idt) . "')";
					$values = $con->prepare($sql);
					$values->bindParam(':vuorotyyppi', $paivitettava_vuorotyyppi);
					$values->bindParam(':uusi_vuorotyyppi', $_POST['tyyppi']);
					$values->execute();
					$paivitetyt_tiedot["vuoroyhdistelmat"] = $values->rowCount();
				}
			}

			$sql = "UPDATE vuorotyyppi SET tyyppi = :tyyppi, kuvaus = :kuvaus, vari_hex = :vari_hex, vuoronakymassa = :vuoronakymassa WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->bindParam(':tyyppi', $_POST['tyyppi']);
			$values->bindParam(':kuvaus', $_POST['kuvaus']);
			$values->bindParam(':vari_hex', $_POST['vari_hex']);
			$values->bindParam(':vuoronakymassa', $_POST['vuoronakymassa']);
			$values->execute();
			$paivitetyt_tiedot["vuorotyypit"] = $values->rowCount();
		}
		
		array_push($return_arr,$paivitetyt_tiedot);
		
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