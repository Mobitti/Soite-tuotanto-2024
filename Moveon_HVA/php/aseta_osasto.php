<?php

include_once '../config/config.php';
include_once 'laheta_viesti.php';

/////**** Numero lähettäjän jälkeen vastaa asiakasnumero, tämän takaa haetaan lähettäjän nimi ******************/////

if(isset($_POST['id']) 
&& isset($_POST['osasto_id'])
&& isset($_POST['tyyppi'])
&& isset($_POST['kommentti'])
&& isset($_POST['tunnus'])
&& isset($_POST['nakyma']))
{
	try
	{
		$return_arr = array();
		$puhelin = "";
		$osasto = "";
		$pvm = "";
		$vuorotyyppi = "";
		$vuorokuvaus = "";
		$viesti = "";
		$paivitys_rivimaara = 0;
		$edellinen_osasto = "Ei osastoa";
		$nykyinen_osasto = "Ei osastoa";
		$tunniste = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT osasto_id FROM vuoro WHERE id = :id)";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$edellinen_osasto = $row['lyhenne'];
		}
		
		$sql = "UPDATE vuoro SET osasto_id = :osasto_id, tausta_kommentti = :kommentti WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->bindParam(':osasto_id', $_POST['osasto_id']);
		$values->bindParam(':kommentti', $_POST['kommentti']);		
		$values->bindParam(':vuorotyyppi', $_POST['tyyppi']);
		$values->execute();	
		$paivitys_rivimaara = $values->rowCount();
		array_push($return_arr,$paivitys_rivimaara);
		
		if($paivitys_rivimaara > 0) {
			$sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT osasto_id FROM vuoro WHERE id = :id)";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);			
			if($row != null) {
				$nykyinen_osasto = $row['lyhenne'];
			}
			
			$sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$tunniste = $row['tunniste'];
			}
			
			$tapahtuma = "Osasto muutos";

			$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja', $_POST['tunnus']);
			$values->bindParam(':nakyma', $_POST['nakyma']);
			$values->bindParam(':tapahtuma', $tapahtuma);
			$values->bindParam(':tunniste', $tunniste);
			$values->bindParam(':edellinen_tieto', $edellinen_osasto);
			$values->bindParam(':tieto', $nykyinen_osasto);
			$values->execute();	
		}
		
		if($_POST['osasto_id'] != 0 && $paivitys_rivimaara > 0) {
			$sql = "SELECT puhelin, kiinnitys_sms FROM sijainen WHERE id = (SELECT sijainen_id FROM vuoro WHERE id = :id)";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();	
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row['kiinnitys_sms'] == 1) {
				$puhelin = $row['puhelin'];
				$sql = "SELECT nimi FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['osasto_id']);
				$values->execute();	
				$row = $values->fetch(PDO::FETCH_ASSOC);				
				if($row != null) {
					$osasto = $row['nimi'];
				}			
				
				$sql = "SELECT pvm, vuorotyyppi, (SELECT kuvaus FROM vuorotyyppi WHERE tyyppi = vuorotyyppi) AS vuorokuvaus, tausta_kommentti FROM vuoro WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['id']);
				$values->execute();	
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if($row != null) {
					$pvm = substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4);
					$vuorotyyppi = $row['vuorotyyppi'];
					$vuorokuvaus = $row['vuorokuvaus'];
					$tausta_kommentti = $row['tausta_kommentti'];
				}
				
				$viesti = "Sinulla on varaus " . $pvm . " " . $osasto . " yksikköön. Vuoro: ". $vuorotyyppi . " Lisätieto: " . $tausta_kommentti;
				$result = laheta_sms_curl($puhelin, $viesti, "Soite", 49);
				array_push($return_arr, $result);				 				
			}
		}
	
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