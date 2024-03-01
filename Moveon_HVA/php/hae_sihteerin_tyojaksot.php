<?php

include_once '../config/config.php';

if(isset($_POST['sihteeri_id'])
&& isset($_POST['alku_pvm'])
&& isset($_POST['loppu_pvm'])
&& isset($_POST['varoitus'])
&& isset($_POST['hakusana'])
&& isset($_POST['haettavaarvo'])
&& isset($_POST['jarjestettavaarvo'])
&& isset($_POST['jarjestys']))
{	
	try
	{
		$return_arr = array();
		$jaksotiedot = array();
		$jarjestysarvo = "";
		$hakuWhere = "";
		$pvmWhere = "";
		$haettavaarvo = strtolower($_POST['haettavaarvo']);
		$alku_pvm = null;
		if($_POST['alku_pvm'] != "") {
			$alku_pvm = substr($_POST['alku_pvm'], 6, 4)."-".substr($_POST['alku_pvm'], 3, 2)."-".substr($_POST['alku_pvm'], 0, 2);
		}
		$loppu_pvm = null;
		if($_POST['loppu_pvm'] != "") {
			$loppu_pvm = substr($_POST['loppu_pvm'], 6, 4)."-".substr($_POST['loppu_pvm'], 3, 2)."-".substr($_POST['loppu_pvm'], 0, 2);
		}
		$tyomaara = 0;
		$aktiivinen_jaksomaara = 0;
		$aktiivinen_alijaksomaara = 0;
		$jaksot_yhteensa_ajalle = 0;
		$alijaksot_yhteensa_ajalle = 0;
		$naytettavat_jaksot_ajalle = 0;
		$naytettavat_alijaksot_ajalle = 0;
		$alittuvat_jakso_tiedot = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['alku_pvm'] != '' && $_POST['loppu_pvm'] != '') {
			$pvmWhere = " AND (alku_pvm <= '" . $loppu_pvm . "' AND loppu_pvm >= '" . $alku_pvm . "')";
		}
		else if($_POST['alku_pvm'] != '') {
			$pvmWhere = " AND ((alku_pvm <= '" . $alku_pvm . "' AND loppu_pvm >= '" . $alku_pvm . "') OR alku_pvm >= '" . $alku_pvm . "')";
		}
		else if($_POST['loppu_pvm'] != '') {
			$pvmWhere = " AND ((alku_pvm <= '" . $loppu_pvm . "' AND loppu_pvm >= '" . $loppu_pvm . "') OR loppu_pvm <= '" . $loppu_pvm . "')";
		}
		
		if($_POST['hakusana'] != "") {
			switch($haettavaarvo) 
			{
				case 'osasto': $hakuWhere = " AND osasto_id IN(SELECT id FROM osasto WHERE nimi LIKE '%" . $_POST['hakusana'] . "%' OR lyhenne LIKE '%" . $_POST['hakusana'] . "%')"; break;
				case 'prosentti': $hakuWhere = " AND tyomaara_id IN(SELECT id FROM tyomaara WHERE prosentti LIKE '%" . $_POST['hakusana'] . "%')"; break; 
				case 'tausta': $hakuWhere = " AND tausta_id IN(SELECT id FROM tausta WHERE selite LIKE '%" . $_POST['hakusana'] . "%' OR numero = '" . $_POST['hakusana'] . "')"; break; 
				case 'kommentti': $hakuWhere = " AND kommentti LIKE '%" . $_POST['hakusana'] . "%'"; break; 
			}
		}
		
		switch($_POST['jarjestettavaarvo'])
		{		
			case 'alku_pvm': $jarjestysarvo = "alku_pvm"; break;
			case 'loppu_pvm': $jarjestysarvo = "loppu_pvm"; break;
			case 'osasto': $jarjestysarvo = "(SELECT lyhenne FROM osasto WHERE id = osasto_id)"; break;
			case 'kustannusnumero': $jarjestysarvo = "kustannusnumero"; break;
			case 'prosentti': $jarjestysarvo = "(SELECT prosentti FROM tyomaara WHERE id = tyomaara_id)"; break;
			case 'tausta': $jarjestysarvo = "(SELECT numero FROM tausta WHERE id = tausta_id)"; break;
			case 'kommentti': $jarjestysarvo = "kommentti"; break;
			case 'alijakso': $jarjestysarvo = "alijakso"; break;
		}
		
		//Haetaan alittuvat työjaksot
		$aikavalit = array();
		$tyomaarat = array();
		if($_POST['varoitus'] == 0) {
			$alkupvm = $alku_pvm;
			$loppupvm = $loppu_pvm;
			
			$sql = "SELECT (CASE WHEN (:alku_pvm > alku_pvm) THEN :alku_pvm ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0" . $pvmWhere . " UNION SELECT (CASE WHEN (:loppu_pvm < loppu_pvm) THEN :loppu_pvm ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0" . $pvmWhere . " ORDER BY pvm ASC";
			$values = $con->prepare($sql);
			$values->bindParam(':alku_pvm', $alkupvm);
			$values->bindParam(':loppu_pvm', $loppupvm);
			$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		}
		else {
			$alkupvm = date("Y-m-d");
			$loppupvm = date("Y-m-d");
			
			$sql = "SELECT (CASE WHEN (CURDATE() > alku_pvm) THEN CURDATE() ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0 AND (alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) UNION SELECT (CASE WHEN (CURDATE() < loppu_pvm) THEN CURDATE() ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0 AND (alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) ORDER BY pvm ASC";
			$values = $con->prepare($sql);
			$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		}
		$values->execute();
		$aikavalit = $values->fetchAll(PDO::FETCH_ASSOC);
		for($j = 0; $j < count($aikavalit); $j++)
		{
			$tyojakso = array();
			if(($j + 1) < count($aikavalit)) {
				$tyomaara_yhteensa = 0;
				$tyojakso_alku_pvm = $aikavalit[$j]['pvm'];
				$tyojakso_loppu_pvm = $aikavalit[$j+1]['pvm'];
				$tyojakso_alku_tyyppi = $aikavalit[$j]['tyyppi'];
				$tyojakso_loppu_tyyppi = $aikavalit[$j+1]['tyyppi'];
				
				if($tyojakso_alku_tyyppi == $tyojakso_loppu_tyyppi) {
					$tyojakso_uusi_alku_pvm = new DateTime($tyojakso_alku_pvm);
					$tyojakso_uusi_alku_pvm->modify('+1 day');
					$tyojakso_alku_pvm = $tyojakso_uusi_alku_pvm->format('Y-m-d');
				}
				
				if(!($tyojakso_alku_tyyppi == 'L' && $tyojakso_loppu_tyyppi == 'A')) {
					$sql = "SELECT (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara_prosentti FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0 AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm)";
					$values = $con->prepare($sql);
					$values->bindParam(':alku_pvm', $tyojakso_alku_pvm);
					$values->bindParam(':loppu_pvm', $tyojakso_loppu_pvm);
					$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
					$values->execute();
					while($row = $values->fetch(PDO::FETCH_ASSOC))
					{
						if($row['tyomaara_prosentti'] != null) {
							$tyomaara_yhteensa += $row['tyomaara_prosentti'];
						}
					}
					
					if($tyomaara_yhteensa > 0 && $tyomaara_yhteensa < 100) {
						$tyojakso['alku_pvm'] = $tyojakso_alku_pvm;
						$tyojakso['loppu_pvm'] = $tyojakso_loppu_pvm;
						$tyojakso['tyomaara'] = $tyomaara_yhteensa;
						if(array_key_exists($tyomaara_yhteensa,$tyomaarat)) {
							$tyomaarat[$tyomaara_yhteensa]++;
						}
						else {
							$tyomaarat[$tyomaara_yhteensa] = 1;
						}
						
						array_push($alittuvat_jakso_tiedot,$tyojakso);
					}
				}
			}
		}
		
		$jaksotiedot['alittuvat_jakso_tiedot'] = $alittuvat_jakso_tiedot;
		$jaksotiedot['alittuvat_tyomaara_tiedot'] = $tyomaarat;
		
		//Haetaan aktiiviset työjaksot
		$sql = "SELECT COUNT(id) AS aktiivinen_jaksomaara FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0 AND alku_pvm <= '" . date("Y-m-d") . "' AND loppu_pvm >= '" . date("Y-m-d") . "'";
		$values = $con->prepare($sql);
		$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$aktiivinen_jaksomaara = $row['aktiivinen_jaksomaara'];
		}
		$jaksotiedot['aktiiviset_jaksot'] = $aktiivinen_jaksomaara;
		
		//Haetaan aktiiviset alityöjaksot
		$sql = "SELECT COUNT(id) AS aktiivinen_alijaksomaara FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 1 AND alku_pvm <= '" . date("Y-m-d") . "' AND loppu_pvm >= '" . date("Y-m-d") . "'";
		$values = $con->prepare($sql);
		$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$aktiivinen_alijaksomaara = $row['aktiivinen_alijaksomaara'];
		}
		$jaksotiedot['aktiiviset_alijaksot'] = $aktiivinen_alijaksomaara;
		
		//Haetaan työjaksot yhteensä
		$sql = "SELECT COUNT(id) AS tyojaksot_yhteensa FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 0" . $pvmWhere;
		$values = $con->prepare($sql);
		$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$jaksot_yhteensa_ajalle = $row['tyojaksot_yhteensa'];
		}
		$jaksotiedot['ajanjakson_jaksot'] = $jaksot_yhteensa_ajalle;
		
		//Haetaan alityöjaksot yhteensä
		$sql = "SELECT COUNT(id) AS alityojaksot_yhteensa FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id AND alijakso = 1" . $pvmWhere;
		$values = $con->prepare($sql);
		$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$alijaksot_yhteensa_ajalle = $row['alityojaksot_yhteensa'];
		}
		$jaksotiedot['ajanjakson_alijaksot'] = $alijaksot_yhteensa_ajalle;

		//Haetaan näytettävät työjakso,alijakso tiedot
		$sql = "SELECT id, sihteeri_id, osasto_id, kustannusnumero, alku_pvm, loppu_pvm, tyomaara_id, tausta_id, kommentti, alijakso FROM sihteerityojakso WHERE sihteeri_id = :sihteeri_id" . $pvmWhere . $hakuWhere . " ORDER BY " . $jarjestysarvo . " " . $_POST['jarjestys'];
		$values = $con->prepare($sql);
		$values->bindParam(':sihteeri_id', $_POST['sihteeri_id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			if($row['alijakso'] == 0) {
				$naytettavat_jaksot_ajalle++;
			}
			else {
				$naytettavat_alijaksot_ajalle++;
			}
			
			$row_array['id'] = $row['id'];
			$row_array['sihteeri_id'] = $row['sihteeri_id'];
			$row_array['osasto_id'] = $row['osasto_id'];
			$row_array['kustannusnumero'] = $row['kustannusnumero'];
			$row_array['alku_pvm'] = substr($row['alku_pvm'], 8, 2) . "." . substr($row['alku_pvm'], 5, 2) . "." . substr($row['alku_pvm'], 0, 4); 
			$row_array['loppu_pvm'] = substr($row['loppu_pvm'], 8, 2) . "." . substr($row['loppu_pvm'], 5, 2) . "." . substr($row['loppu_pvm'], 0, 4); 
			$row_array['tyomaara_id'] = $row['tyomaara_id'];
			$row_array['tausta_id'] = $row['tausta_id'];
			$row_array['kommentti'] = $row['kommentti'];
			$row_array['alijakso'] = $row['alijakso'];
			
			array_push($return_arr,$row_array);
		}
		$jaksotiedot['naytettavat_jaksot'] = $naytettavat_jaksot_ajalle;
		$jaksotiedot['naytettavat_alijaksot'] = $naytettavat_alijaksot_ajalle;
		
		array_unshift($return_arr,$jaksotiedot);
		
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
