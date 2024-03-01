<?php

include_once '../config/config.php';

if (
	isset($_POST['re_hakusana'])
	&& isset($_POST['re_haettavaarvo'])
	&& isset($_POST['re_tila'])
	&& isset($_POST['re_varoitus'])
	&& isset($_POST['re_toimialue'])
	&& isset($_POST['tj_alku_pvm'])
	&& isset($_POST['tj_loppu_pvm'])
	&& isset($_POST['tj_hakusana'])
	&& isset($_POST['tj_haettavaarvo'])
	&& isset($_POST['jarjestys'])
	&& isset($_POST['jarjestettavaarvo'])
) {
	try {
		$return_arr = array();
		$re_hakuWhere = "";
		$tj_hakuWhere = "";
		$rivimaara = 0;
		$reservilais_idt = "";
		$reservilaiset = array();
		$haettavaarvo = strtolower($_POST['tj_haettavaarvo']);
		$alku_pvm = null;
		if ($_POST['tj_alku_pvm'] != "") {
			$alku_pvm = substr($_POST['tj_alku_pvm'], 6, 4) . "-" . substr($_POST['tj_alku_pvm'], 3, 2) . "-" . substr($_POST['tj_alku_pvm'], 0, 2);
		}
		$loppu_pvm = null;
		if ($_POST['tj_loppu_pvm'] != "") {
			$loppu_pvm = substr($_POST['tj_loppu_pvm'], 6, 4) . "-" . substr($_POST['tj_loppu_pvm'], 3, 2) . "-" . substr($_POST['tj_loppu_pvm'], 0, 2);
		}
		$tj_pvmWhere = "";
		$toimialueWhere = "'" . implode("','", $_POST['re_toimialue']) . "'";
		$reservilainen_idt = "";
		$sihteeriWhere = "";

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		if ($_POST['re_hakusana'] != "") {
			if ($_POST['re_haettavaarvo'] == 'nimike') {
				$sql = "SELECT id FROM reservilainen WHERE nimike_id IN (SELECT id FROM nimike WHERE lyhenne LIKE '%" . $_POST['re_hakusana'] . "%' OR nimi LIKE '%" . $_POST['re_hakusana'] . "%')";
			} else {
				$sql = "SELECT id FROM reservilainen WHERE " . $_POST['re_haettavaarvo'] . " LIKE '%" . $_POST['re_hakusana'] . "%'";
			}
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$reservilais_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($reservilais_idt) > 0) {
				$reservilais_idt = substr($reservilais_idt, 1);
				$re_hakuWhere = " AND id IN (" . $reservilais_idt . ")";
			} else {
				array_unshift($return_arr, $rivimaara);
				$con = null;
				$values = null;
				echo json_encode($return_arr);
				return;
			}
		}

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

		if ($_POST['re_tila'] == 1) {
			$sihteeriWhere = " NOT";
		}

		$sql = "SELECT DISTINCT reservilainen_id FROM reservilainentoimialue WHERE toimialue_id IN(" .  $toimialueWhere . ") AND reservilainen_id" . $sihteeriWhere . " IN((SELECT id FROM reservilainen WHERE nimike_id IN(" . $sihteerinimike_idt  . ")))";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$reservilainen_idt .= ",'" . $row['reservilainen_id'] . "'";
		}

		if (strlen($reservilainen_idt) > 0) {
			$reservilainen_idt = substr($reservilainen_idt, 1);
		} else {
			echo "[]";
			$con = null;
			$values = null;
			return;
		}

		if ($_POST['tj_alku_pvm'] != '' && $_POST['tj_loppu_pvm'] != '') {
			$tj_pvmWhere = " AND (alku_pvm <= '" . $loppu_pvm . "' AND loppu_pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['tj_alku_pvm'] != '') {
			$tj_pvmWhere = " AND ((alku_pvm <= '" . $alku_pvm . "' AND loppu_pvm >= '" . $alku_pvm . "') OR alku_pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['tj_loppu_pvm'] != '') {
			$tj_pvmWhere = " AND ((alku_pvm <= '" . $loppu_pvm . "' AND loppu_pvm >= '" . $loppu_pvm . "') OR loppu_pvm <= '" . $loppu_pvm . "')";
		}

		if ($_POST['tj_hakusana'] != "") {
			switch ($haettavaarvo) {
				case 'osasto':
					$tj_hakuWhere = " AND osasto_id IN(SELECT id FROM osasto WHERE nimi LIKE '%" . $_POST['tj_hakusana'] . "%' OR lyhenne LIKE '%" . $_POST['tj_hakusana'] . "%')";
					break;
				case 'prosentti':
					$tj_hakuWhere = " AND tyomaara LIKE '%" . $_POST['tj_hakusana'] . "%'";
					break;
				case 'reservitausta':
					$tj_hakuWhere = " AND reservitausta_id IN(SELECT id FROM reservitausta WHERE selite LIKE '%" . $_POST['tj_hakusana'] . "%' OR numero LIKE '%" . $_POST['tj_hakusana'] . "%')";
					break;
				case 'kommentti':
					$tj_hakuWhere = " AND kommentti LIKE '%" . $_POST['tj_hakusana'] . "%'";
					break;
			}
		}

		//Haetaan reserviläisen tiedot
		$sql = "SELECT id, vakanssinumero, nimi, (SELECT lyhenne FROM nimike WHERE id = nimike_id) AS nimike FROM reservilainen WHERE aktiivinen = 1 AND id IN(" . $reservilainen_idt . ")" . $re_hakuWhere . " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];
		$values = $con->prepare($sql);
		$values->execute();
		$reservilaiset = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($reservilaiset); $i++) {
			$reservilais_id = $reservilaiset[$i]['id'];
			$tyomaara = 0;
			$aktiivinen_jaksomaara = 0;
			$jaksot_yhteensa_ajalle = 0;
			$naytettavat_jaksot_ajalle = 0;

			//Haetaan alittuvat työjaksot
			$aikavalit = array();
			$alittuvat_tyomaara_tiedot = array();
			if ($_POST['re_varoitus'] == 0) {
				$alkupvm = $alku_pvm;
				$loppupvm = $loppu_pvm;

				$sql = "SELECT (CASE WHEN (:alku_pvm > alku_pvm) THEN :alku_pvm ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id" . $tj_pvmWhere . " UNION SELECT (CASE WHEN (:loppu_pvm < loppu_pvm) THEN :loppu_pvm ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id" . $tj_pvmWhere . " ORDER BY pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':alku_pvm', $alkupvm);
				$values->bindParam(':loppu_pvm', $loppupvm);
				$values->bindParam(':reservilainen_id', $reservilais_id);
			} else {
				$alkupvm = date("Y-m-d");
				$loppupvm = date("Y-m-d");

				$sql = "SELECT (CASE WHEN (CURDATE() > alku_pvm) THEN CURDATE() ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) UNION SELECT (CASE WHEN (CURDATE() < loppu_pvm) THEN CURDATE() ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= CURDATE() AND loppu_pvm >= CURDATE()) ORDER BY pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':reservilainen_id', $reservilais_id);
			}
			$values->execute();
			$aikavalit = $values->fetchAll(PDO::FETCH_ASSOC);
			for ($j = 0; $j < count($aikavalit); $j++) {
				$tyojakso = array();
				if (($j + 1) < count($aikavalit)) {
					$tyomaara_yhteensa = 0;
					$tyojakso_alku_pvm = $aikavalit[$j]['pvm'];
					$tyojakso_loppu_pvm = $aikavalit[$j + 1]['pvm'];
					$tyojakso_alku_tyyppi = $aikavalit[$j]['tyyppi'];
					$tyojakso_loppu_tyyppi = $aikavalit[$j + 1]['tyyppi'];

					if ($tyojakso_alku_tyyppi == $tyojakso_loppu_tyyppi) {
						$tyojakso_uusi_alku_pvm = new DateTime($tyojakso_alku_pvm);
						$tyojakso_uusi_alku_pvm->modify('+1 day');
						$tyojakso_alku_pvm = $tyojakso_uusi_alku_pvm->format('Y-m-d');
					}

					if (!($tyojakso_alku_tyyppi == 'L' && $tyojakso_loppu_tyyppi == 'A')) {
						$sql = "SELECT tyomaara AS tyomaara_prosentti FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm)";
						$values = $con->prepare($sql);
						$values->bindParam(':alku_pvm', $tyojakso_alku_pvm);
						$values->bindParam(':loppu_pvm', $tyojakso_loppu_pvm);
						$values->bindParam(':reservilainen_id', $reservilais_id);
						$values->execute();
						while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
							if ($row['tyomaara_prosentti'] != null) {
								$tyomaara_yhteensa += $row['tyomaara_prosentti'];
							}
						}

						if ($tyomaara_yhteensa > 0 && $tyomaara_yhteensa < 100) {
							if (array_key_exists($tyomaara_yhteensa, $alittuvat_tyomaara_tiedot)) {
								$alittuvat_tyomaara_tiedot[$tyomaara_yhteensa]++;
							} else {
								$alittuvat_tyomaara_tiedot[$tyomaara_yhteensa] = 1;
							}
						}
					}
				}
			}

			//Haetaan aktiiviset työjaksot
			$sql = "SELECT COUNT(id) AS aktiivinen_jaksomaara FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND alku_pvm <= '" . date("Y-m-d") . "' AND loppu_pvm >= '" . date("Y-m-d") . "'";
			$values = $con->prepare($sql);
			$values->bindParam(':reservilainen_id', $reservilais_id);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if ($row != null) {
				$aktiivinen_jaksomaara = $row['aktiivinen_jaksomaara'];
			}

			//Haetaan työjaksot yhteensä
			$sql = "SELECT COUNT(id) AS tyojaksot FROM tyojakso WHERE reservilainen_id = :reservilainen_id" . $tj_pvmWhere;
			$values = $con->prepare($sql);
			$values->bindParam(':reservilainen_id', $reservilais_id);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			$jaksot_yhteensa_ajalle = $row['tyojaksot'];

			//Haetaan näytettävät työjaksot yhteensä
			if ($_POST['tj_hakusana'] != "") {
				$sql = "SELECT COUNT(id) AS tyojaksot FROM tyojakso WHERE reservilainen_id = :reservilainen_id" . $tj_pvmWhere . $tj_hakuWhere;
				$values = $con->prepare($sql);
				$values->bindParam(':reservilainen_id', $reservilais_id);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$naytettavat_jaksot_ajalle = $row['tyojaksot'];
			} else {
				$naytettavat_jaksot_ajalle = $jaksot_yhteensa_ajalle;
			}

			$row_array['id'] = $reservilaiset[$i]['id'];
			$row_array['vakanssinumero'] = $reservilaiset[$i]['vakanssinumero'];
			$row_array['nimi'] = $reservilaiset[$i]['nimi'];
			$row_array['nimike'] = $reservilaiset[$i]['nimike'];
			$row_array['tyomaara'] = $tyomaara;
			$row_array['aktiiviset_jaksot'] = $aktiivinen_jaksomaara;
			$row_array['ajanjakson_jaksot'] = $jaksot_yhteensa_ajalle;
			$row_array['naytettavat_jaksot'] = $naytettavat_jaksot_ajalle;
			$row_array['alittuvat_tyomaara_tiedot'] = $alittuvat_tyomaara_tiedot;
			array_push($return_arr, $row_array);
			$rivimaara++;
		}

		array_unshift($return_arr, $rivimaara);

		$con = null;
		$values = null;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		echo "Tietokantavirhe: " . $e->getMessage();
	}
} else {
	echo "parametri";
}
