<?php

include_once '../config/config.php';

if (
	isset($_POST['alue_idt'])
	&& isset($_POST['jarjestys'])
	&& isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
	&& isset($_POST['henkilosto'])
	&& isset($_POST['tyyppi'])
) {
	try {
		$return_arr = array();
		$jarjestys = "";
		$alkupvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
		$loppupvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
		$sihteerihinta = "";
		$osastohinta = "";
		$kmhinta = "";
		$hinta = "";
		$osastot = array();

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		if ($_POST['jarjestys'] != '') {
			switch ($_POST['jarjestys']) {
				case 'raporttinumero':
					$jarjestys = " ORDER by raporttinumero";
					break;
				case 'lyhenne':
					$jarjestys = " ORDER BY lyhenne";
					break;
				case 'nimi':
					$jarjestys = " ORDER BY nimi";
					break;
				case 'toimialue-nimi':
					$jarjestys = " ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), nimi";
					break;
				case 'toimialue-raporttinumero':
					$jarjestys = " ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id), raporttinumero";
					break;
				case 'palvelualue-nimi':
					$jarjestys = " ORDER BY (SELECT nimi FROM palvelualue WHERE id = palvelualue_id), nimi";
					break;
				case 'palvelualue-raporttinumero':
					$jarjestys = " ORDER BY (SELECT nimi FROM palvelualue WHERE id = palvelualue_id), raporttinumero";
					break;
			}
		}

		if ($_POST['tyyppi'] == 0 && $_POST['henkilosto'] == 1) {
			if ($_POST['alkupvm'] != "" && $_POST['loppupvm'] != "") {
				//Hae sihteerihinta
				$sql = "SELECT hinta FROM kustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm AND osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%Sihteeri%' OR nimi LIKE '%Sihteeri%') LIMIT 1";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$sihteerihinta = $row['hinta'] . "€";
				} else {
					$sihteerihinta = "-";
				}
			}
		} else if ($_POST['tyyppi'] == 6) {
			if ($_POST['alkupvm'] != "" && $_POST['loppupvm'] != "") {
				//Hae sihteerihinta
				$sql = "SELECT hinta FROM sihteerikustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$sihteerihinta = $row['hinta'] . "€";
				} else {
					$sihteerihinta = "-";
				}
			}
		} else if ($_POST['tyyppi'] == 11) {
			if ($_POST['alkupvm'] != "" && $_POST['loppupvm'] != "") {
				$kmhinta_alle_5000 = "-";
				$kmhinta_yli_5000 = "-";
				$kmhinta_alle_7000 = "-";
				$kmhinta_yli_7000 = "-";

				//Hae kmhinta alle 5000
				$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 0 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$kmhinta_alle_5000 = $row['hinta'];
				}

				//Hae kmhinta yli 5000
				$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 1 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$kmhinta_yli_5000 = $row['hinta'];
				}

				//Hae kmhinta alle 7000
				$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 2 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$kmhinta_alle_7000 = $row['hinta'];
				}

				//Hae kmhinta yli 7000
				$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 3 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$kmhinta_yli_7000 = $row['hinta'];
				}

				$kmhinta_alle = "-";
				if ($kmhinta_alle_7000 == "-") {
					$kmhinta_alle = $kmhinta_alle_5000;
				} else {
					$kmhinta_alle = $kmhinta_alle_7000;
				}

				$kmhinta_yli = "-";
				if ($kmhinta_yli_7000 == "-") {
					$kmhinta_yli = $kmhinta_yli_5000;
				} else {
					$kmhinta_yli = $kmhinta_yli_7000;
				}

				$kmhinta = $kmhinta_alle . "-" . $kmhinta_yli . "€/km";
			}
		}


		if ($_POST['tyyppi'] < 6) {
			$sql = "SELECT id, raporttinumero, nimi, (SELECT vari_hex FROM toimialue WHERE id = toimialue_id) AS taustavari FROM osasto WHERE toimialue_id = 0 OR toimialue_id IN (" . $_POST['alue_idt'] . ")" . $jarjestys;
		} else if ($_POST['tyyppi'] == 11) {
			$sql = "SELECT id, raporttinumero, nimi, (SELECT vari_hex FROM toimialue WHERE id = toimialue_id) AS taustavari FROM osasto WHERE toimialue_id IN (" . $_POST['alue_idt'] . ")" . $jarjestys;
		} else {
			$sql = "SELECT id, raporttinumero, nimi, (SELECT vari_hex FROM palvelualue WHERE id = palvelualue_id) AS taustavari FROM osasto WHERE palvelualue_id = 0 OR palvelualue_id IN (" . $_POST['alue_idt'] . ")" . $jarjestys;
		}
		$values = $con->prepare($sql);
		$values->execute();
		$osastot = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($osastot); $i++) {
			$row_array['id'] = $osastot[$i]['id'];
			$row_array['raporttinumero'] = $osastot[$i]['raporttinumero'];
			$row_array['nimi'] = $osastot[$i]['nimi'];
			if ($osastot[$i]['taustavari'] != null && $osastot[$i]['taustavari'] != "") {
				$row_array['taustavari'] = $osastot[$i]['taustavari'];
			} else {
				$row_array['taustavari'] = "#ffffff";
			}

			if ($osastot[$i]['raporttinumero'] <= 4) {
				$hinta = "";
			} else if (($_POST['tyyppi'] == 0 && $_POST['henkilosto'] == 1) || $_POST['tyyppi'] == 6) {
				$hinta = $sihteerihinta;
			} else if ($_POST['tyyppi'] == 11) {
				$hinta = $kmhinta;
			} else {
				if ($_POST['alkupvm'] != "" && $_POST['loppupvm'] != "") {
					if ($_POST['tyyppi'] == 0) {
						$sql = "SELECT hinta FROM kustannus WHERE osasto_id = :osasto_id AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
					} else if ($_POST['tyyppi'] == 3) {
						$sql = "SELECT hinta FROM reservikustannus WHERE osasto_id = :osasto_id AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
					}
					$values = $con->prepare($sql);
					$values->bindParam(':osasto_id', $osastot[$i]['id']);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					if ($row != null) {
						$hinta = $row['hinta'] . "€";
					} else {
						$hinta = "-";
					}
				}
			}

			$row_array['hinta'] = $hinta;
			array_push($return_arr, $row_array);
		}

		$con = null;
		$values = null;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		echo "Tietokantavirhe: " . $e->getMessage();
	}
} else {
	echo "parametri";
}
