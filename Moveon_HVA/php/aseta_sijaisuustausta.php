<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['tausta_id'])
&& isset($_POST['tyyppi'])
&& isset($_POST['tunnus'])
&& isset($_POST['nakyma']))
{
	try
	{
		$return_arr = array();
		$paivitys_rivimaara = 0;
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$edellinen_tausta = "Ei taustaa";
		$nykyinen_tausta = "Ei taustaa";
		$tunniste = "";
		
		$sql = "SELECT selite FROM tausta WHERE id = (SELECT tausta_id FROM vuoro WHERE id = :id)";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->execute();	
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$edellinen_tausta = $row['selite'];
		}
		
		$sql = "UPDATE vuoro SET tausta_id = :tausta_id WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->bindParam(':tausta_id', $_POST['tausta_id']);
		$values->bindParam(':vuorotyyppi', $_POST['tyyppi']);
		$values->execute();	
		$paivitys_rivimaara = $values->rowCount();
		array_push($return_arr,$paivitys_rivimaara);
		
		if($paivitys_rivimaara > 0) {
			$sql = "SELECT selite FROM tausta WHERE id = (SELECT tausta_id FROM vuoro WHERE id = :id)";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$nykyinen_tausta = $row['selite'];
			}
			
			$sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				$tunniste = $row['tunniste'];
			}
			
			$tapahtuma = "Sijaisuustausta muutos";
			
			$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja', $_POST['tunnus']);
			$values->bindParam(':nakyma', $_POST['nakyma']);
			$values->bindParam(':tapahtuma', $tapahtuma);
			$values->bindParam(':tunniste', $tunniste);
			$values->bindParam(':edellinen_tieto', $edellinen_tausta);
			$values->bindParam(':tieto', $nykyinen_tausta);
			$values->execute();	
		}

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