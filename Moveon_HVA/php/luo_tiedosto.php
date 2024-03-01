<?php

include_once '../config/config.php';

if (
	isset($_POST['raporttityyppi'])
	&& isset($_POST['vuosi'])
	&& isset($_POST['kuukausi'])
) {
	try {
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$return_arr = array();
		$rivimaara = 0;

		$tiedostopolku = "..\\tiedostot\\"; //Win
		//$tiedostopolku = "../tiedostot/"; //Unix

		$alkupvm = date("Y-m-d", mktime(0, 0, 0, $_POST['kuukausi'], 1, $_POST['vuosi']));
		$loppupvm = date("Y-m-t", mktime(0, 0, 0, ($_POST['kuukausi']), 1, $_POST['vuosi']));

		//Hae kaikki sihteeri nimike_idt
		$sihteerinimike_idt = "";
		$sql = "SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%'";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$sihteerinimike_idt .= ",'" . $row['id'] . "'";
		}

		if (strlen($sihteerinimike_idt) > 0) {
			$sihteerinimike_idt = substr($sihteerinimike_idt, 1);
		} else {
			$sihteerinimike_idt = '-1';
		}

		if ($_POST['raporttityyppi'] == 0 || $_POST['raporttityyppi'] == 1) {
			$sijaissihteerihinta = 0;

			//Hae sissi perehdytys tausta id
			$sissi_perehdytys_tausta_id = "";
			$hoitaja_sissi_perehdytys_yhteensa = 0;
			$sihteeri_sissi_perehdytys_yhteensa = 0;
			$hoitaja_sissi_perehdytys_kustannukset_yhteensa = 0;
			$sihteeri_sissi_perehdytys_kustannukset_yhteensa = 0;
			$sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa = 0;
			$sql = "SELECT id FROM tausta WHERE numero = 10";
			$values = $con->prepare($sql);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if ($row != null) {
				$sissi_perehdytys_tausta_id = $row['id'];
			}
		} else if ($_POST['raporttityyppi'] == 2 || $_POST['raporttityyppi'] == 3) {
			$henkilo_km_tiedot = array();
			$kmhinta_alle_5000 = 0;
			$kmhinta_yli_5000 = 0;
			$kmhinta_alle_7000 = 0;
			$kmhinta_yli_7000 = 0;

			//Hae kmhinta alle 5000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 0 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_alle_5000 = $row['hinta'];
			}

			//Hae kmhinta alle 7000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 2 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_alle_7000 = $row['hinta'];
			}

			//Hae kmhinta yli 5000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 1 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_yli_5000 = $row['hinta'];
			}

			//Hae kmhinta yli 7000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 3 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_yli_7000 = $row['hinta'];
			}
		}

		if ($_POST['raporttityyppi'] == 0) {
			//Kaikki hoitaja sijaiset
			$s_hoitaja_idt = "";
			$sql = "SELECT id FROM sijainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$s_hoitaja_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($s_hoitaja_idt) > 0) {
				$s_hoitaja_idt = substr($s_hoitaja_idt, 1);
			} else {
				$s_hoitaja_idt = '-1';
			}

			//Kaikki hoitaja reserviläiset
			$r_hoitaja_idt = "";
			$sql = "SELECT id FROM reservilainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$r_hoitaja_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($r_hoitaja_idt) > 0) {
				$r_hoitaja_idt = substr($r_hoitaja_idt, 1);
			} else {
				$r_hoitaja_idt = '-1';
			}

			//Hae kaikkien osastojen vuorot
			$s_osasto_tiedot = array();
			$r_osasto_tiedot = array();
			$osastot = array();

			$sql = "SELECT id, raporttinumero FROM osasto ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			$osastot = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($i = 0; $i < count($osastot); $i++) {
				$s_osasto_rivi = array();
				$r_osasto_rivi = array();

				//Kaikki sijaishoitajat kustannuksineen
				$s_h_maara = 0;
				$s_h_kustannukset = 0;
				$s_h_sissi_perehdytys_kustannukset = 0;
				$s_h_sissi_perehdytys_maara = 0;
				$sql = "SELECT tausta_id, (SELECT hinta FROM kustannus WHERE osasto_id = :raportti_osasto_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS hinta, (SELECT raporttinumero FROM osasto WHERE id = :raportti_osasto_id) AS raporttinumero FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $s_hoitaja_idt . ") AND raportti_osasto_id = :raportti_osasto_id"; // (SELECT hinta FROM henkilokustannus WHERE henkilokustannus.sijainen_id = vuoro.sijainen_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS henkilo_hinta,
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $osastot[$i]['id']);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					if ($row['raporttinumero'] > 4) {
						/*
						if($row['henkilo_hinta'] != null || $row['henkilo_hinta'] != "") {
							if($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$s_h_kustannukset += $row['henkilo_hinta'];
							}
							else {
								$s_h_sissi_perehdytys_kustannukset += $row['henkilo_hinta'];
							}
						}
						else 
						*/
						if ($row['hinta'] != null || $row['hinta'] != "") {
							if ($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$s_h_kustannukset += $row['hinta'];
							} else {
								$s_h_sissi_perehdytys_kustannukset += $row['hinta'];
							}
						}
					}

					if ($row['hinta'] != null || $row['hinta'] != "") {
						$s_h_sissi_perehdytys_maara++;
					}

					$s_h_maara++;
				}
				$s_osasto_rivi['s_h_vuoromaara'] = $s_h_maara;
				$s_osasto_rivi['s_h_kustannukset'] = $s_h_kustannukset;
				$hoitaja_sissi_perehdytys_yhteensa += $s_h_sissi_perehdytys_maara;
				$hoitaja_sissi_perehdytys_kustannukset_yhteensa += $s_h_sissi_perehdytys_kustannukset;

				//Kaikki reservihoitajat kustannuksineen
				$hp_maara = 0;
				$hp_kustannukset = 0;
				$h_tyojaksot = array();

				$sql = "SELECT CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS aloitus, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS lopetus, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS h_p_maara, tyomaara, reservilainen_id FROM tyojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id IN(" . $r_hoitaja_idt . ") AND osasto_id = :osasto_id";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $osastot[$i]['id']);
				$values->execute();
				$h_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($h_tyojaksot); $j++) {
					$reservihenkilohinta = "";
					$reservilainen_id = $h_tyojaksot[$j]['reservilainen_id'];
					$hp_maara += ($h_tyojaksot[$j]['h_p_maara'] + 1) * ($h_tyojaksot[$j]['tyomaara'] / 100);

					$sql = "SELECT hinta FROM reservihenkilokustannus WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id = :reservilainen_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $h_tyojaksot[$j]['aloitus']);
					$values->bindParam(':loppupvm', $h_tyojaksot[$j]['lopetus']);
					$values->bindParam(':reservilainen_id', $reservilainen_id);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					if ($row != null) {
						$reservihenkilohinta = $row['hinta'];
					}

					$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_h_p_maara FROM reservikustannus WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND osasto_id = :osasto_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $h_tyojaksot[$j]['aloitus']);
					$values->bindParam(':loppupvm', $h_tyojaksot[$j]['lopetus']);
					$values->bindParam(':osasto_id', $osastot[$i]['id']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($reservihenkilohinta != null || $reservihenkilohinta != "") {
							$hp_kustannukset += ($h_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_h_p_maara'] + 1) * $reservihenkilohinta);
						} else if ($row['hinta'] != null || $row['hinta'] != "") {
							$hp_kustannukset += ($h_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_h_p_maara'] + 1) * $row['hinta']);
						}
					}
				}
				$r_osasto_rivi['r_h_vuoromaara'] = $hp_maara;
				$r_osasto_rivi['r_h_kustannukset'] = $hp_kustannukset;

				///////////////////////////////////////////////////////////////////
				$s_osasto_rivi['raporttinumero'] = $osastot[$i]['raporttinumero'];
				$s_osasto_rivi['s_vuoromaara'] = $s_osasto_rivi['s_h_vuoromaara'];
				$s_osasto_rivi['s_kustannukset'] = $s_osasto_rivi['s_h_kustannukset'];
				array_push($s_osasto_tiedot, $s_osasto_rivi);

				$r_osasto_rivi['raporttinumero'] = $osastot[$i]['raporttinumero'];
				$r_osasto_rivi['r_vuoromaara'] = $r_osasto_rivi['r_h_vuoromaara'];
				$r_osasto_rivi['r_kustannukset'] = $r_osasto_rivi['r_h_kustannukset'];
				array_push($r_osasto_tiedot, $r_osasto_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			$rivit = array();
			$tositepvm = date("ymt", mktime(0, 0, 0, ($_POST['kuukausi']), 1, $_POST['vuosi']));
			$tililahto = "3801";
			//$tilitulo = "5521";
			$tilitulo = "5121";
			$kustannuspaikka = "1520";
			$kohde = "99999";
			$tunniste1 = "";
			$tunniste2 = "";
			$tositelaji = "";
			$tositenro = "";
			$seliteteksti = "MOVEON-siirto";
			$alvkoodi = "";
			$alvsumma = "";
			$organisaatiotunniste = "";
			$lahettavajarjestelma = "";

			for ($i = 0; $i < count($s_osasto_tiedot); $i++) {
				$osastoraporttinumero = $s_osasto_tiedot[$i]['raporttinumero'];
				$summa = 0;
				$suorite = 0;

				if (array_key_exists('s_vuoromaara', $s_osasto_tiedot[$i])) {
					$suorite = $s_osasto_tiedot[$i]['s_vuoromaara'];
				}

				if (array_key_exists('s_kustannukset', $s_osasto_tiedot[$i])) {
					$summa = $s_osasto_tiedot[$i]['s_kustannukset'];
				}
				//if($summa > 0 && $hoitaja_sissi_perehdytys_yhteensa > 0) 27.2.2022
				if ($hoitaja_sissi_perehdytys_yhteensa > 0) {
					$summa += ($suorite / $hoitaja_sissi_perehdytys_yhteensa) * $hoitaja_sissi_perehdytys_kustannukset_yhteensa;
				}

				if ($summa > 0) {
					$summa = round($summa);
					$suorite = round($suorite);
					$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);

					array_push($rivit, $riviA);
					array_push($rivit, $riviB);
				}
			}

			for ($i = 0; $i < count($r_osasto_tiedot); $i++) {
				$osastoraporttinumero = $r_osasto_tiedot[$i]['raporttinumero'];
				$summa = 0;
				$suorite = 0;

				if (array_key_exists('r_kustannukset', $r_osasto_tiedot[$i])) {
					$summa = $r_osasto_tiedot[$i]['r_kustannukset'];
				}
				if (array_key_exists('r_vuoromaara', $r_osasto_tiedot[$i])) {
					$suorite = $r_osasto_tiedot[$i]['r_vuoromaara'];
				}

				if ($summa > 0) {
					$summa = round($summa);
					$suorite = round($suorite);

					$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					array_push($rivit, $riviA);
					array_push($rivit, $riviB);
				}
			}

			if (count($rivit) > 0) {
				$tiedostot = glob($tiedostopolku . "*_H_*.dat");
				$tiedostonumero = 1;
				if ($tiedostot != false) {
					$tiedostonumero = count($tiedostot) + 1;
				}

				$tiedostonimi = "K35P20_" . date("Ymd") . "_H_" . $tiedostonumero . ".dat";
				$tiedosto = fopen($tiedostopolku . $tiedostonimi, "w");
				if ($tiedosto !== false) {
					foreach ($rivit as $tiedostorivit) {
						$rivi = fputcsv($tiedosto, $tiedostorivit, ";");
						if ($rivi !== false) {
							$rivimaara++;
						}
					}
				}

				fclose($tiedosto);
			}
		} else if ($_POST['raporttityyppi'] == 1) {
			//Hae sijaissihteerihinta
			$sql = "SELECT hinta FROM kustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm AND osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%sihteeri%' OR nimi LIKE '%sihteeri%') LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijaissihteerihinta = $row['hinta'];
			}

			//Kaikki sihteeri sijaiset
			$s_sihteeri_idt = "";
			$sql = "SELECT id FROM sijainen WHERE nimike_id IN(" . $sihteerinimike_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$s_sihteeri_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($s_sihteeri_idt) > 0) {
				$s_sihteeri_idt = substr($s_sihteeri_idt, 1);
			} else {
				$s_sihteeri_idt = '-1';
			}

			//Hae kaikkien osastojen vuorot
			$s_s_osasto_tiedot = array();
			$t_osastot = array();

			$sql = "SELECT id, raporttinumero FROM osasto ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			$t_osastot = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($i = 0; $i < count($t_osastot); $i++) {
				$s_s_osasto_rivi = array();

				//Kaikki sijaissihteerit kustannuksineen
				$s_s_maara = 0;
				$s_s_kustannukset = 0;
				$s_s_sissi_perehdytys_kustannukset = 0;
				$s_s_sissi_perehdytys_maara = 0;
				$sql = "SELECT tausta_id, (SELECT hinta FROM henkilokustannus WHERE henkilokustannus.sijainen_id = vuoro.sijainen_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS henkilo_hinta, (SELECT raporttinumero FROM osasto WHERE id = :raportti_osasto_id) AS raporttinumero FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $s_sihteeri_idt . ") AND raportti_osasto_id = :raportti_osasto_id";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $t_osastot[$i]['id']);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					if ($row['raporttinumero'] > 4) {
						/*
						if($row['henkilo_hinta'] != null || $row['henkilo_hinta'] != "") {
							if($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$s_s_kustannukset += $row['henkilo_hinta'];
							}
							else {
								$s_s_sissi_perehdytys_kustannukset += $row['henkilo_hinta'];
							}
						}
						else 
						*/
						if ($sijaissihteerihinta != null || $sijaissihteerihinta != "") {
							if ($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$s_s_kustannukset += $sijaissihteerihinta;
							} else {
								$s_s_sissi_perehdytys_kustannukset += $sijaissihteerihinta;
							}
						}
					}

					if ($sijaissihteerihinta != null || $sijaissihteerihinta != "") {
						$s_s_sissi_perehdytys_maara++;
					}

					$s_s_maara++;
				}

				$s_s_osasto_rivi['s_s_vuoromaara'] = $s_s_maara;
				$s_s_osasto_rivi['s_s_kustannukset'] = $s_s_kustannukset;
				$sihteeri_sissi_perehdytys_yhteensa += $s_s_sissi_perehdytys_maara;
				$sihteeri_sissi_perehdytys_kustannukset_yhteensa += $s_s_sissi_perehdytys_kustannukset;

				///////////////////////////////////////////////////////////////////////
				$s_s_osasto_rivi['raporttinumero'] = $t_osastot[$i]['raporttinumero'];
				$s_s_osasto_rivi['s_vuoromaara'] = $s_s_osasto_rivi['s_s_vuoromaara'];
				$s_s_osasto_rivi['s_kustannukset'] = $s_s_osasto_rivi['s_s_kustannukset'];
				array_push($s_s_osasto_tiedot, $s_s_osasto_rivi);
			}

			//Hae kaikkien osastojen työjaksot
			$s_osasto_tiedot = array();
			$p_osastot = array();
			$sp_maara_yhteensa = 0;

			$sql = "SELECT id, raporttinumero FROM osasto ORDER BY (SELECT nimi FROM palvelualue WHERE id = palvelualue_id), raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			$p_osastot = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($i = 0; $i < count($p_osastot); $i++) {
				$s_osasto_rivi = array();
				$s_tyojaksot = array();
				$kustannustiedot = array();

				//Kaikki sihteerit kustannuksineen (vakituinen)
				$sql = "SELECT kustannusnumero, sihteeri_id, CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS jakso_alku, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS jakso_loppu, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND osasto_id = :osasto_id AND tausta_id = -1 AND alijakso = 0";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $p_osastot[$i]['id']);
				$values->execute();
				$s_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($s_tyojaksot); $j++) {
					$sp_maara = 0;
					$s_a_p_maara = 0;
					$sp_kustannukset = 0;
					$kustannusnumero = $s_tyojaksot[$j]['kustannusnumero'];
					if (!array_key_exists($kustannusnumero, $kustannustiedot)) {
						$kustannustiedot[$kustannusnumero]['s_vuoromaara'] = 0;
						$kustannustiedot[$kustannusnumero]['s_kustannukset'] = 0;
					}

					$sql = "SELECT DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_a_p_maara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id = :sihteeri_id AND alijakso = 1";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $s_tyojaksot[$j]['jakso_alku']);
					$values->bindParam(':loppupvm', $s_tyojaksot[$j]['jakso_loppu']);
					$values->bindParam(':sihteeri_id', $s_tyojaksot[$j]['sihteeri_id']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						$s_a_p_maara += $row['s_a_p_maara'] + 1;
					}

					$sp_maara = (($s_tyojaksot[$j]['s_p_maara'] + 1) - $s_a_p_maara) * ($s_tyojaksot[$j]['tyomaara'] / 100);
					$sp_maara_yhteensa += $sp_maara;
					$kustannustiedot[$kustannusnumero]['s_vuoromaara'] += $sp_maara;

					$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_s_p_maara FROM sihteerikustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $s_tyojaksot[$j]['jakso_alku']);
					$values->bindParam(':loppupvm', $s_tyojaksot[$j]['jakso_loppu']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($row['hinta'] != null || $row['hinta'] != "") {
							$sp_kustannukset = ($s_tyojaksot[$j]['tyomaara'] / 100) * ((($row['tj_s_p_maara'] + 1) - $s_a_p_maara) * $row['hinta']);
							$kustannustiedot[$kustannusnumero]['s_kustannukset'] += $sp_kustannukset;
						}
					}
				}

				$s_a_tyojaksot = array();
				$sp_a_maara = 0;
				$sp_sissi_perehdytys_kustannukset = 0;

				//Kaikki sihteerit kustannuksineen (alijakso)
				$sql = "SELECT tausta_id, kustannusnumero, CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS jakso_alku, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS jakso_loppu, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND osasto_id = :osasto_id AND tausta_id != -1 AND alijakso = 1";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $p_osastot[$i]['id']);
				$values->execute();
				$s_a_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($s_a_tyojaksot); $j++) {
					$sp_a_maara = ($s_a_tyojaksot[$j]['s_p_maara'] + 1) * ($s_a_tyojaksot[$j]['tyomaara'] / 100);
					$sp_maara_yhteensa += $sp_a_maara;
					$kustannustiedot[$kustannusnumero]['s_vuoromaara'] += $sp_a_maara;

					$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_s_p_maara FROM sihteerikustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $s_a_tyojaksot[$j]['jakso_alku']);
					$values->bindParam(':loppupvm', $s_a_tyojaksot[$j]['jakso_loppu']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($row['hinta'] != null || $row['hinta'] != "") {
							$sp_a_kustannukset = ($s_a_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_s_p_maara'] + 1) * $row['hinta']);
							if ($s_a_tyojaksot[$j]['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$kustannustiedot[$kustannusnumero]['s_kustannukset'] += $sp_a_kustannukset;
							} else {
								$sp_sissi_perehdytys_kustannukset += $sp_a_kustannukset;
							}
						}
					}
				}

				$sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa += $sp_sissi_perehdytys_kustannukset;
				$s_osasto_rivi['raporttinumero'] = $p_osastot[$i]['raporttinumero'];
				$s_osasto_rivi['kustannustiedot'] = $kustannustiedot;
				array_push($s_osasto_tiedot, $s_osasto_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			$rivit = array();
			$tositepvm = date("ymt", mktime(0, 0, 0, ($_POST['kuukausi']), 1, $_POST['vuosi']));
			$tililahto = "3801";
			$tilitulo = "";
			$kustannuspaikka = "";
			$kohde = "99999";
			$tunniste1 = "";
			$tunniste2 = "";
			$tositelaji = "";
			$tositenro = "";
			$seliteteksti = "MOVEON-siirto";
			$alvkoodi = "";
			$alvsumma = "";
			$organisaatiotunniste = "";
			$lahettavajarjestelma = "";

			for ($i = 0; $i < count($s_s_osasto_tiedot); $i++) {
				$osastoraporttinumero = $s_s_osasto_tiedot[$i]['raporttinumero'];
				$summa = 0;
				$suorite = 0;
				$tilitulo = "5126";
				$kustannuspaikka = "2730";

				if (array_key_exists('s_vuoromaara', $s_s_osasto_tiedot[$i])) {
					$suorite = $s_s_osasto_tiedot[$i]['s_vuoromaara'];
				}

				if (array_key_exists('s_kustannukset', $s_s_osasto_tiedot[$i])) {
					$summa = $s_s_osasto_tiedot[$i]['s_kustannukset'];
				}
				//if($summa > 0 && $sihteeri_sissi_perehdytys_yhteensa > 0) 27.2.2022
				if ($sihteeri_sissi_perehdytys_yhteensa > 0) {
					$summa += ($suorite / $sihteeri_sissi_perehdytys_yhteensa) * $sihteeri_sissi_perehdytys_kustannukset_yhteensa;
				}

				if ($summa > 0) {
					$summa = round($summa);
					$suorite = round($suorite);

					$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);

					array_push($rivit, $riviA);
					array_push($rivit, $riviB);
				}
			}

			for ($i = 0; $i < count($s_osasto_tiedot); $i++) {
				$tilitulo = "";
				$osastoraporttinumero = $s_osasto_tiedot[$i]['raporttinumero'];
				$kustannustiedot = $s_osasto_tiedot[$i]['kustannustiedot'];

				$summa = 0;
				$suorite = 0;

				foreach ($kustannustiedot as $kustannusnumero => $tiedot) {
					$tilitulo = $kustannusnumero;
					if ($tilitulo == "5524") {
						$kustannuspaikka = "2710";
					} else if ($tilitulo == "5525") {
						$kustannuspaikka = "2720";
					} else if ($tilitulo == "5126") {
						$kustannuspaikka = "2730";
					}

					if (array_key_exists('s_vuoromaara', $tiedot)) {
						$suorite = $tiedot['s_vuoromaara'];
					}

					if (array_key_exists('s_kustannukset', $tiedot)) {
						$summa = $tiedot['s_kustannukset'];
					}

					if ($sp_maara_yhteensa > 0) {
						$summa += ($suorite / $sp_maara_yhteensa) * $sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa;
					}

					if ($summa > 0) {
						$summa = round($summa);
						$suorite = round($suorite);

						$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
						$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);

						array_push($rivit, $riviA);
						array_push($rivit, $riviB);
					}
				}
			}

			if (count($rivit) > 0) {
				$tiedostot = glob($tiedostopolku . "*_S_*.dat");
				$tiedostonumero = 1;
				if ($tiedostot != false) {
					$tiedostonumero = count($tiedostot) + 1;
				}
				// muuutettu tiedostonmi 4.7.2023 K50P20==> K35P20_
				$tiedostonimi = "K35P20_" . date("Ymd") . "_S_" . $tiedostonumero . ".dat";
				$tiedosto = fopen($tiedostopolku . $tiedostonimi, "w");
				if ($tiedosto !== false) {
					foreach ($rivit as $tiedostorivit) {
						$rivi = fputcsv($tiedosto, $tiedostorivit, ";");
						if ($rivi !== false) {
							$rivimaara++;
						}
					}
				}

				fclose($tiedosto);
			}
		} else if ($_POST['raporttityyppi'] == 2) {
			//Kaikki hoitaja sijaiset
			$s_hoitaja_idt = "";
			$sql = "SELECT id FROM sijainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$s_hoitaja_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($s_hoitaja_idt) > 0) {
				$s_hoitaja_idt = substr($s_hoitaja_idt, 1);
			} else {
				$s_hoitaja_idt = '-1';
			}

			//Hae kaikkien osastojen vuorot
			$km_osasto_tiedot = array();
			$osastot = array();

			$sql = "SELECT id, raporttinumero FROM osasto ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			$osastot = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($i = 0; $i < count($osastot); $i++) {
				$km_osasto_rivi = array();

				//Kaikki hoitajien matkakustannukset
				$h_km_maara = 0;
				$h_matka_kustannukset = 0;

				$sql = "SELECT matka.km, matka.sijainen_id FROM matka LEFT JOIN vuoro ON matka.vuoro_id = vuoro.id WHERE matka.pvm >= :alkupvm AND matka.pvm <= :loppupvm AND matka.sijainen_id IN(" . $s_hoitaja_idt . ") AND vuoro.raportti_osasto_id = :raportti_osasto_id AND tila = 3";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $osastot[$i]['id']);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$h_km_maara += $row['km'];

					if (!array_key_exists($row['sijainen_id'], $henkilo_km_tiedot)) {
						$henkilo_km_tiedot[$row['sijainen_id']] = $row['km'];
						if ($kmhinta_yli_7000 == 0) {
							$h_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
						} else {
							$h_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
						}
					} else {
						if ($kmhinta_yli_7000 == 0) {
							if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 5000) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] >= 5000) {
									$h_matka_kustannukset += $row['km'] * $kmhinta_yli_5000;
								} else {
									$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
									$matka_km_yli = $row['km'] - $matka_km_alle;

									$h_matka_kustannukset += $matka_km_alle * $kmhinta_alle_5000;
									$h_matka_kustannukset += $matka_km_yli * $kmhinta_yli_5000;
								}
							} else {
								$h_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
							}
						} else {
							if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 7000) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] >= 7000) {
									$h_matka_kustannukset += $row['km'] * $kmhinta_yli_7000;
								} else {
									$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
									$matka_km_yli = $row['km'] - $matka_km_alle;

									$h_matka_kustannukset += $matka_km_alle * $kmhinta_alle_7000;
									$h_matka_kustannukset += $matka_km_yli * $kmhinta_yli_7000;
								}
							} else {
								$h_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
							}
						}
					}
				}
				$km_osasto_rivi['km_h_kmmaara'] = $h_km_maara;
				$km_osasto_rivi['km_h_kustannukset'] = $h_matka_kustannukset;

				///////////////////////////////////////////////////////////////////
				$km_osasto_rivi['raporttinumero'] = $osastot[$i]['raporttinumero'];
				$km_osasto_rivi['km_kmmaara'] = $km_osasto_rivi['km_h_kmmaara'];
				$km_osasto_rivi['km_kustannukset'] = $km_osasto_rivi['km_h_kustannukset'];
				array_push($km_osasto_tiedot, $km_osasto_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			$rivit = array();
			$tositepvm = date("ymt", mktime(0, 0, 0, ($_POST['kuukausi']), 1, $_POST['vuosi']));
			$tililahto = "3801";
			$tilitulo = "5708";
			$kustannuspaikka = "1520";
			$kohde = "99999";
			$tunniste1 = "";
			$tunniste2 = "";
			$tositelaji = "";
			$tositenro = "";
			$seliteteksti = "MOVEON-siirto";
			$alvkoodi = "";
			$alvsumma = "";
			$organisaatiotunniste = "";
			$lahettavajarjestelma = "";

			for ($i = 0; $i < count($km_osasto_tiedot); $i++) {
				$osastoraporttinumero = $km_osasto_tiedot[$i]['raporttinumero'];
				$summa = 0;
				$suorite = 0;

				if (array_key_exists('km_kmmaara', $km_osasto_tiedot[$i])) {
					$suorite = $km_osasto_tiedot[$i]['km_kmmaara'];
				}

				if (array_key_exists('km_kustannukset', $km_osasto_tiedot[$i])) {
					$summa = $km_osasto_tiedot[$i]['km_kustannukset'];
				}

				if ($summa > 0) {
					$summa = round($summa);
					$suorite = round($suorite);
					$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);

					array_push($rivit, $riviA);
					array_push($rivit, $riviB);
				}
			}

			if (count($rivit) > 0) {
				$tiedostot = glob($tiedostopolku . "*_HM_*.dat");
				$tiedostonumero = 1;
				if ($tiedostot != false) {
					$tiedostonumero = count($tiedostot) + 1;
				}

				$tiedostonimi = "K50P20_" . date("Ymd") . "_HM_" . $tiedostonumero . ".dat";
				$tiedosto = fopen($tiedostopolku . $tiedostonimi, "w");
				if ($tiedosto !== false) {
					foreach ($rivit as $tiedostorivit) {
						$rivi = fputcsv($tiedosto, $tiedostorivit, ";");
						if ($rivi !== false) {
							$rivimaara++;
						}
					}
				}

				fclose($tiedosto);
			}
		} else if ($_POST['raporttityyppi'] == 3) {
			//Kaikki sihteeri sijaiset
			$s_sihteeri_idt = "";
			$sql = "SELECT id FROM sijainen WHERE nimike_id IN(" . $sihteerinimike_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$s_sihteeri_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($s_sihteeri_idt) > 0) {
				$s_sihteeri_idt = substr($s_sihteeri_idt, 1);
			} else {
				$s_sihteeri_idt = '-1';
			}

			//Hae kaikkien osastojen vuorot
			$km_osasto_tiedot = array();
			$osastot = array();

			$sql = "SELECT id, raporttinumero FROM osasto ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			$osastot = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($i = 0; $i < count($osastot); $i++) {
				$km_osasto_rivi = array();

				//Kaikki sihteerien matkakustannukset
				$s_km_maara = 0;
				$s_matka_kustannukset = 0;

				$sql = "SELECT matka.km, matka.sijainen_id FROM matka LEFT JOIN vuoro ON matka.vuoro_id = vuoro.id WHERE matka.pvm >= :alkupvm AND matka.pvm <= :loppupvm AND matka.sijainen_id IN(" . $s_sihteeri_idt . ") AND vuoro.raportti_osasto_id = :raportti_osasto_id AND tila = 3";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $osastot[$i]['id']);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$s_km_maara += $row['km'];

					if (!array_key_exists($row['sijainen_id'], $henkilo_km_tiedot)) {
						$henkilo_km_tiedot[$row['sijainen_id']] = $row['km'];
						if ($kmhinta_alle_7000 == 0) {
							$s_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
						} else {
							$s_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
						}
					} else {
						if ($kmhinta_yli_7000 == 0) {
							if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 5000) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] >= 5000) {
									$s_matka_kustannukset += $row['km'] * $kmhinta_yli_5000;
								} else {
									$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
									$matka_km_yli = $row['km'] - $matka_km_alle;

									$s_matka_kustannukset += $matka_km_alle * $kmhinta_alle_5000;
									$s_matka_kustannukset += $matka_km_yli * $kmhinta_yli_5000;
								}
							} else {
								$s_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
							}
						} else {
							if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 7000) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] >= 7000) {
									$s_matka_kustannukset += $row['km'] * $kmhinta_yli_7000;
								} else {
									$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
									$matka_km_yli = $row['km'] - $matka_km_alle;

									$s_matka_kustannukset += $matka_km_alle * $kmhinta_alle_7000;
									$s_matka_kustannukset += $matka_km_yli * $kmhinta_yli_7000;
								}
							} else {
								$s_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
							}
						}
					}
				}
				$km_osasto_rivi['km_s_kmmaara'] = $s_km_maara;
				$km_osasto_rivi['km_s_kustannukset'] = $s_matka_kustannukset;

				///////////////////////////////////////////////////////////////////////
				$km_osasto_rivi['raporttinumero'] = $osastot[$i]['raporttinumero'];
				$km_osasto_rivi['km_kmmaara'] = $s_s_osasto_rivi['km_s_kmmaara'];
				$km_osasto_rivi['km_kustannukset'] = $s_s_osasto_rivi['km_s_kustannukset'];
				array_push($km_osasto_tiedot, $km_osasto_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			$rivit = array();
			$tositepvm = date("ymt", mktime(0, 0, 0, ($_POST['kuukausi']), 1, $_POST['vuosi']));
			$tililahto = "3801";
			$tilitulo = "5708";
			$kustannuspaikka = "2730";
			$kohde = "99999";
			$tunniste1 = "";
			$tunniste2 = "";
			$tositelaji = "";
			$tositenro = "";
			$seliteteksti = "MOVEON-siirto";
			$alvkoodi = "";
			$alvsumma = "";
			$organisaatiotunniste = "";
			$lahettavajarjestelma = "";

			for ($i = 0; $i < count($km_osasto_tiedot); $i++) {
				$osastoraporttinumero = $km_osasto_tiedot[$i]['raporttinumero'];
				$summa = 0;
				$suorite = 0;

				if (array_key_exists('km_kmmaara', $km_osasto_tiedot[$i])) {
					$suorite = $km_osasto_tiedot[$i]['km_kmmaara'];
				}

				if (array_key_exists('km_kustannukset', $km_osasto_tiedot[$i])) {
					$summa = $km_osasto_tiedot[$i]['km_kustannukset'];
				}

				if ($summa > 0) {
					$summa = round($summa);
					$suorite = round($suorite);

					$riviA = array($tositepvm, $tililahto, $kustannuspaikka, $kohde, $tunniste1, $tunniste2, $suorite, $osastoraporttinumero, $tositelaji, $tositenro, "-", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);
					$riviB = array($tositepvm, $tilitulo, $osastoraporttinumero, $kohde, $tunniste1, $tunniste2, $suorite, $kustannuspaikka, $tositelaji, $tositenro, "+", $summa, $seliteteksti, $alvkoodi, $alvsumma, $organisaatiotunniste, $lahettavajarjestelma);

					array_push($rivit, $riviA);
					array_push($rivit, $riviB);
				}
			}

			if (count($rivit) > 0) {
				$tiedostot = glob($tiedostopolku . "*_SM_*.dat");
				$tiedostonumero = 1;
				if ($tiedostot != false) {
					$tiedostonumero = count($tiedostot) + 1;
				}

				$tiedostonimi = "K50P20_" . date("Ymd") . "_SM_" . $tiedostonumero . ".dat";
				$tiedosto = fopen($tiedostopolku . $tiedostonimi, "w");
				if ($tiedosto !== false) {
					foreach ($rivit as $tiedostorivit) {
						$rivi = fputcsv($tiedosto, $tiedostorivit, ";");
						if ($rivi !== false) {
							$rivimaara++;
						}
					}
				}

				fclose($tiedosto);
			}
		}

		$return_arr["rivimaara"] = $rivimaara;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		$con = null;
		$values = null;
		echo "Tietokantavirhe: " . $e->getMessage();
	}
} else {
	echo "parametri";
}
