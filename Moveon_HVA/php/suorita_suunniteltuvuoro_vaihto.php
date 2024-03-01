<?php

include_once '../config/config.php';

if(isset($_POST['lahde_suunniteltuvuoro_id'])
&& isset($_POST['lahde_sijainen_id'])
&& isset($_POST['lahde_alku_pvm'])
&& isset($_POST['lahde_loppu_pvm'])
&& isset($_POST['kohde_suunniteltuvuoro_id'])
&& isset($_POST['kohde_sijainen_id'])
&& isset($_POST['kohde_alku_pvm'])
&& isset($_POST['kohde_loppu_pvm'])
&& isset($_POST['kayttaja']))
{	
	try
	{
		$lahde_suunniteltuvuoro_pvm = "";
		$lahde_sijainen_nimi = "";
		$lahde_vuorotyyppi = "";
		$kohde_suunniteltuvuoro_pvm = "";
		$kohde_sijainen_nimi = "";
		$kohde_vuorotyyppi = "";
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['lahde_suunniteltuvuoro_id'] != "") {
			//Haetaan suunnitellun lähde vuoron tiedot
			$sql = "SELECT DATE(alkupvm) AS pvm, (SELECT nimi FROM sijainen WHERE sijainen.id = sijainen_id) AS sijaisen_nimi, vuorotyyppi FROM suunniteltuvuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['lahde_suunniteltuvuoro_id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$lahde_suunniteltuvuoro_pvm = $row['pvm'];
				$lahde_sijainen_nimi = $row['sijaisen_nimi'];
				$lahde_vuorotyyppi = $row['vuorotyyppi'];
			}
			
			//Päivitetään suunnitelun lähde vuoron tiedot suunnitelun kohde vuoron tiedoiksi
			$sql = "UPDATE suunniteltuvuoro SET alkupvm = :alkupvm, loppupvm = :loppupvm, sijainen_id = :sijainen_id WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $_POST['kohde_alku_pvm']);
			$values->bindParam(':loppupvm', $_POST['kohde_loppu_pvm']);
			$values->bindParam(':sijainen_id', $_POST['kohde_sijainen_id']);
			$values->bindParam(':id', $_POST['lahde_suunniteltuvuoro_id']);
			$values->execute();
			if($values->rowCount() > 0) {
				//Haetaan suunnitellun kohde vuoron sijaisen nimi
				$sql = "SELECT nimi FROM sijainen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['kohde_sijainen_id']);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if($row != null) {
					$kohde_sijainen_nimi = $row['nimi'];
				}
				
				//Lisätään lokiin tieto suunnitellunvuoron vaihdosta
				$aikaleima = date("Y-m-d H:i:s");
				$kayttaja = $_POST['kayttaja'];
				$nakyma = "Vuorosuunnittelu";
				$tapahtuma = "Suunitellunvuoron vaihto";

				$tunniste = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi . " " . $lahde_vuorotyyppi;
				$edellinen_tieto = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi . " " . $lahde_vuorotyyppi;
				$tieto = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi . " " . $lahde_vuorotyyppi;
				
				$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
						VALUES (NULL, :aikaleima, :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
				$values = $con->prepare($sql);
				$values->bindParam(':aikaleima', $aikaleima);
				$values->bindParam(':kayttaja', $kayttaja);
				$values->bindParam(':nakyma', $nakyma);
				$values->bindParam(':tapahtuma', $tapahtuma);
				$values->bindParam(':tunniste', $tunniste);
				$values->bindParam(':edellinen_tieto', $edellinen_tieto);
				$values->bindParam(':tieto', $tieto);
				$values->execute();
				
				//Päivitetään vuorot
				$sql = "UPDATE vuoro SET pvm = :pvm, sijainen_id = :sijainen_id WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
				$values = $con->prepare($sql);
				$values->bindParam(':pvm', $_POST['kohde_alku_pvm']);
				$values->bindParam(':sijainen_id', $_POST['kohde_sijainen_id']);
				$values->bindParam(':suunniteltuvuoro_id', $_POST['lahde_suunniteltuvuoro_id']);
				$values->execute();
				if($values->rowCount() > 0) {
					//Lisätään lokiin tieto vuorojen vaihdosta
					$aikaleima = date("Y-m-d H:i:s");
					$kayttaja = $_POST['kayttaja'];
					$nakyma = "Vuorosuunnittelu";
					$tapahtuma = "Vuorojen vaihto";

					$tunniste = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi;
					$edellinen_tieto = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi;
					$tieto = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi;
					
					$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
							VALUES (NULL, :aikaleima, :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
					$values = $con->prepare($sql);
					$values->bindParam(':aikaleima', $aikaleima);
					$values->bindParam(':kayttaja', $kayttaja);
					$values->bindParam(':nakyma', $nakyma);
					$values->bindParam(':tapahtuma', $tapahtuma);
					$values->bindParam(':tunniste', $tunniste);
					$values->bindParam(':edellinen_tieto', $edellinen_tieto);
					$values->bindParam(':tieto', $tieto);
					$values->execute();
				}
			}
		}
		
		if($_POST['kohde_suunniteltuvuoro_id'] != "") {
			//Haetaan suunnitellun kohde vuoron tiedot
			$sql = "SELECT DATE(alkupvm) AS pvm, (SELECT nimi FROM sijainen WHERE sijainen.id = sijainen_id) AS sijaisen_nimi, vuorotyyppi FROM suunniteltuvuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['kohde_suunniteltuvuoro_id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$kohde_suunniteltuvuoro_pvm = $row['pvm'];
				$kohde_sijainen_nimi = $row['sijaisen_nimi'];
				$kohde_vuorotyyppi = $row['vuorotyyppi'];
			}
			
			//Päivitetään suunnitelun kohde vuoron tiedot suunnitelun lähde vuoron tiedoiksi
			$sql = "UPDATE suunniteltuvuoro SET alkupvm = :alkupvm, loppupvm = :loppupvm, sijainen_id = :sijainen_id WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $_POST['lahde_alku_pvm']);
			$values->bindParam(':loppupvm', $_POST['lahde_loppu_pvm']);
			$values->bindParam(':sijainen_id', $_POST['lahde_sijainen_id']);
			$values->bindParam(':id', $_POST['kohde_suunniteltuvuoro_id']);
			$values->execute();
			if($values->rowCount() > 0) {
				//Haetaan suunnitellun lahde vuoron sijaisen nimi
				$sql = "SELECT nimi FROM sijainen WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $_POST['lahde_sijainen_id']);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if($row != null) {
					$lahde_sijainen_nimi = $row['nimi'];
				}
				
				//Lisätään lokiin tieto suunnitellunvuoron vaihdosta
				$aikaleima = date("Y-m-d H:i:s");
				$kayttaja = $_POST['kayttaja'];
				$nakyma = "Vuorosuunnittelu";
				$tapahtuma = "Suunitellunvuoron vaihto";

				$tunniste = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi . " " . $kohde_vuorotyyppi;
				$edellinen_tieto = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi . " " . $kohde_vuorotyyppi;
				$tieto = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi . " " . $kohde_vuorotyyppi;
				
				$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
						VALUES (NULL, :aikaleima, :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
				$values = $con->prepare($sql);
				$values->bindParam(':aikaleima', $aikaleima);
				$values->bindParam(':kayttaja', $kayttaja);
				$values->bindParam(':nakyma', $nakyma);
				$values->bindParam(':tapahtuma', $tapahtuma);
				$values->bindParam(':tunniste', $tunniste);
				$values->bindParam(':edellinen_tieto', $edellinen_tieto);
				$values->bindParam(':tieto', $tieto);
				$values->execute();
				
				//Päivitetään vuorot
				$sql = "UPDATE vuoro SET pvm = :pvm, sijainen_id = :sijainen_id WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
				$values = $con->prepare($sql);
				$values->bindParam(':pvm', $_POST['lahde_alku_pvm']);
				$values->bindParam(':sijainen_id', $_POST['lahde_sijainen_id']);
				$values->bindParam(':suunniteltuvuoro_id', $_POST['kohde_suunniteltuvuoro_id']);
				$values->execute();
				if($values->rowCount() > 0) {
					//Lisätään lokiin tieto vuorojen vaihdosta
					$aikaleima = date("Y-m-d H:i:s");
					$kayttaja = $_POST['kayttaja'];
					$nakyma = "Vuorosuunnittelu";
					$tapahtuma = "Vuorojen vaihto";

					$tunniste = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi;
					$edellinen_tieto = substr($_POST['kohde_alku_pvm'], 8, 2) . "." . substr($_POST['kohde_alku_pvm'], 5, 2) . "." . substr($_POST['kohde_alku_pvm'], 0, 4) . " " . $kohde_sijainen_nimi;
					$tieto = substr($_POST['lahde_alku_pvm'], 8, 2) . "." . substr($_POST['lahde_alku_pvm'], 5, 2) . "." . substr($_POST['lahde_alku_pvm'], 0, 4) . " " . $lahde_sijainen_nimi;
					
					$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
							VALUES (NULL, :aikaleima, :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
					$values = $con->prepare($sql);
					$values->bindParam(':aikaleima', $aikaleima);
					$values->bindParam(':kayttaja', $kayttaja);
					$values->bindParam(':nakyma', $nakyma);
					$values->bindParam(':tapahtuma', $tapahtuma);
					$values->bindParam(':tunniste', $tunniste);
					$values->bindParam(':edellinen_tieto', $edellinen_tieto);
					$values->bindParam(':tieto', $tieto);
					$values->execute();
				}
			}
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