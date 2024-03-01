<?php

include_once '../config/config.php';

if (
	isset($_POST['pvm'])
	&& isset($_POST['hoitajatila'])
	&& isset($_POST['toimialue_idt'])
	&& isset($_POST['hakusana'])
	&& isset($_POST['haettavaarvo'])
	&& isset($_POST['jarjestys'])
	&& isset($_POST['jarjestettavaarvo'])
	&& isset($_POST['muokkausoikeudet'])
) {
	try {
		$jarjestysarvo = "";
		$hakusana = "";
		$hakuWhere = "";
		$toimialueWhere = "'" . implode("','", $_POST['toimialue_idt']) . "'";
		$sijainen_idt = "";
		$sijainen_tieto_idt = "";
		$vuoromaara = 0;
		$vuorotiedot = array();
		$sijaistiedot = array();
		$haettavaarvo = strtolower($_POST['haettavaarvo']);
		$return_arr = array();
		$pvm = substr($_POST['pvm'], 6, 4) . "-" . substr($_POST['pvm'], 3, 2) . "-" . substr($_POST['pvm'], 0, 2);

		$today = new DateTime("now");
		$targetDate = new DateTime($pvm);
		$diff = $today->diff($targetDate);

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		//Hae kaikki sihteeri nimike_idt
		$sihteerinimike_idt = "";
		$sql = "SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%'";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$sihteerinimike_idt .= "," . $row['id'];
		}

		if (strlen($sihteerinimike_idt) > 0) {
			$sihteerinimike_idt = substr($sihteerinimike_idt, 1);
		} else {
			$sihteerinimike_idt = '-1';
		}

		if ($_POST['hoitajatila']) {
			//Kaikki hoitaja sijaiset
			$sql = "SELECT id FROM sijainen WHERE nimike_id NOT IN(" . $sihteerinimike_idt . ") AND aktiivinen = 1 AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN(" . $toimialueWhere . "))";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijainen_idt .= "," . $row['id'];
			}

			if (strlen($sijainen_idt) > 0) {
				$sijainen_idt = substr($sijainen_idt, 1);
			} else {
				$sijainen_idt = '-1';
			}
		} else {
			//Kaikki sihteeri sijaiset
			$sql = "SELECT id FROM sijainen WHERE nimike_id IN(" . $sihteerinimike_idt . ") AND aktiivinen = 1 AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN(" . $toimialueWhere . "))";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijainen_idt .= "," . $row['id'];
			}

			if (strlen($sijainen_idt) > 0) {
				$sijainen_idt = substr($sijainen_idt, 1);
			} else {
				$sijainen_idt = '-1';
			}
		}

		if ($sijainen_idt == -1) {
			$return_arr["vuoromaara"] = 0;
			$return_arr["vuorot"] = [];
			$return_arr["sijaistiedot"] = [];

			$con = null;
			$values = null;
			echo json_encode($return_arr);
			return;
		}

		if ($_POST['hakusana'] != "") {
			switch ($haettavaarvo) {
				case 'nimi':
					$hakuWhere = " AND sijainen_id IN(SELECT id FROM sijainen WHERE nimi LIKE '%" . $_POST['hakusana'] . "%')";
					break;
				case 'nimike':
					$hakuWhere = " AND sijainen_id IN(SELECT id FROM sijainen WHERE nimike_id IN (SELECT id FROM nimike WHERE lyhenne LIKE '%" . $_POST['hakusana'] . "%'))";
					break;
				case 'kotiosasto':
					$hakuWhere = " AND sijainen_id IN(SELECT sijainen_id FROM sijainenosasto WHERE osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%" . $_POST['hakusana'] . "%') AND osastotyyppi = 1)";
					break;
				case 'muut_osastot':
					$hakuWhere = " AND sijainen_id IN(SELECT sijainen_id FROM sijainenosasto WHERE osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%" . $_POST['hakusana'] . "%') AND osastotyyppi = 0)";
					break;
				case 'kommentti':
					$hakuWhere = " AND sijainen_id IN(SELECT id FROM sijainen WHERE kommentti LIKE '%" . $_POST['hakusana'] . "%')";
					break;
				case 'iv':
					$hakuWhere = " AND sijainen_id IN(SELECT id FROM sijainen WHERE iv LIKE '%" . $_POST['hakusana'] . "%')";
					break;
				case 'laakelupa':
					$hakuWhere = " AND sijainen_id IN(SELECT id FROM sijainen WHERE (SELECT CASE laakelupa WHEN 0 THEN 'Lääkl-' ELSE 'Lääkl+' END) LIKE '%" . $_POST['hakusana'] . "%')";
					break;
				case 'vuorotyyppi':
					$hakuWhere = " AND vuorotyyppi = '" . $_POST['hakusana'] . "'";
					break;
				case 'sijaisuusosasto':
					$hakuWhere = " AND (raportti_osasto_id IN(SELECT id FROM osasto WHERE nimi LIKE '%" . $_POST['hakusana'] . "%' OR lyhenne LIKE '%" . $_POST['hakusana'] . "%') OR osasto_id IN(SELECT id FROM osasto WHERE nimi LIKE '%" . $_POST['hakusana'] . "%' OR lyhenne LIKE '%" . $_POST['hakusana'] . "%'))";
					break;
				case 'sijaisuustausta':
					$hakuWhere = " AND tausta_id IN(SELECT id FROM tausta WHERE selite LIKE '%" . $_POST['hakusana'] . "%' OR numero = '" . $_POST['hakusana'] . "')";
					break;
				case 'sijaisuustaustakommentti':
					$hakuWhere = " AND tausta_kommentti LIKE '%" . $_POST['hakusana'] . "%'";
					break;
			}
		}

		switch ($_POST['jarjestettavaarvo']) {
			case 'nimi':
				$jarjestysarvo = "(SELECT nimi FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'nimike':
				$jarjestysarvo = "(SELECT (SELECT lyhenne FROM nimike WHERE id = nimike_id) FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'kotiosasto':
				$jarjestysarvo = "(SELECT (SELECT (SELECT lyhenne FROM osasto WHERE id = osasto_id) FROM sijainenosasto WHERE osastotyyppi = 1 AND sijainen_id = sijainen.id) FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'muut_osastot':
				$jarjestysarvo =  "(SELECT (SELECT GROUP_CONCAT((SELECT lyhenne FROM osasto WHERE id = osasto_id) ORDER BY (SELECT lyhenne FROM osasto WHERE id = osasto_id) SEPARATOR ', ') FROM sijainenosasto WHERE osastotyyppi = 0 AND sijainen_id = sijainen.id) FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'kommentti':
				$jarjestysarvo = "(SELECT kommentti FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'iv':
				$jarjestysarvo = "(SELECT iv FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'laakelupa':
				$jarjestysarvo = "(SELECT laakelupa FROM sijainen WHERE id = sijainen_id)";
				break;
			case 'vuorotyyppi':
				$jarjestysarvo = $_POST['jarjestettavaarvo'];
				break;
			case 'sijaisuusosasto':
				$jarjestysarvo = "(SELECT raporttinumero FROM osasto WHERE id = osasto_id)";
				break;
			case 'sijaisuustausta':
				$jarjestysarvo = "(SELECT numero FROM tausta WHERE id = tausta_id)";
				break;
		}
		if ($_POST['jarjestettavaarvo'] != 'vuorotyyppi') {
			$jarjestysOrder = " ORDER BY " . $jarjestysarvo . " " . $_POST['jarjestys'] . ", vuorotyyppi ASC";
		} else {
			$jarjestysOrder = " ORDER BY " . $jarjestysarvo . " " . $_POST['jarjestys'];
		}

		$sql = "SELECT DISTINCT(sijainen_id) AS sijainen_id FROM vuoro WHERE sijainen_id IN(" . $sijainen_idt . ") AND pvm = :pvm AND nakyvyys = 0" . $hakuWhere;
		$values = $con->prepare($sql);
		$values->bindParam(':pvm', $pvm);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$sijainen_tieto_idt .= ",'" . $row['sijainen_id'] . "'";
		}

		if (strlen($sijainen_tieto_idt) > 0) {
			$sijainen_tieto_idt = substr($sijainen_tieto_idt, 1);
		} else {
			$return_arr["vuoromaara"] = 0;
			$return_arr["vuorot"] = [];
			$return_arr["sijaistiedot"] = [];

			$con = null;
			$values = null;
			echo json_encode($return_arr);
			return;
		}

		$sql = "SELECT s.id, s.nimi,n.lyhenne AS nimike, s.kommentti, s.iv, s.laakelupa FROM sijainen s LEFT JOIN nimike n ON s.nimike_id = n.id WHERE s.id IN(" . $sijainen_tieto_idt . ")";
		$values = $con->prepare($sql);
		$values->execute();
		$sijaiset = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($sijaiset); $i++) {
			$row_array = array();
			$sijainen_id = $sijaiset[$i]['id'];
			$row_array['nimi'] = $sijaiset[$i]['nimi'];
			$row_array['nimike'] = $sijaiset[$i]['nimike'];
			$row_array['kommentti'] = $sijaiset[$i]['kommentti'];
			$row_array['iv'] = $sijaiset[$i]['iv'];
			$row_array['laakelupa'] = $sijaiset[$i]['laakelupa'];

			/*Sijaisen osastojen nimet*/
			$kotiosasto = "";
			$muut_osastot = "";
			$mahdolliset_osastot = "";

			$sql = "SELECT so.osastotyyppi, o.lyhenne FROM sijainenosasto so LEFT JOIN osasto o ON so.osasto_id = o.id WHERE so.sijainen_id = :sijainen_id ORDER BY FIELD(so.osastotyyppi,'1','0','2'), o.lyhenne";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $sijainen_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				if ($row['osastotyyppi'] == 0) {
					$muut_osastot .= ", " . $row['lyhenne'];
				} else if ($row['osastotyyppi'] == 1) {
					$kotiosasto = $row['lyhenne'];
				} else if ($row['osastotyyppi'] == 2) {
					$mahdolliset_osastot .= ", " . $row['lyhenne'];
				}
			}

			if (strlen($muut_osastot) > 0) {
				$muut_osastot = substr($muut_osastot, 1);
			}

			if (strlen($mahdolliset_osastot) > 0) {
				$mahdolliset_osastot = substr($mahdolliset_osastot, 1);
			}

			$row_array['kotiosasto'] = $kotiosasto;
			$row_array['muut_osastot'] = $muut_osastot;
			$row_array['mahd_osastot'] = $mahdolliset_osastot;

			/*Osastot valinnat*/
			$osasto_idt = "";
			$sql = "SELECT so.osasto_id, o.lyhenne, o.toimialue_id FROM sijainenosasto so LEFT JOIN osasto o ON so.osasto_id = o.id WHERE so.sijainen_id = :sijainen_id ORDER BY FIELD(so.osastotyyppi,'1','0','2'), o.toimialue_id, o.lyhenne";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $sijainen_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_idt .= "," . $row['osasto_id'];
			}
			if (strlen($osasto_idt) > 0) {
				$osasto_idt = substr($osasto_idt, 1);
			}
			$row_array['osasto_idt'] = $osasto_idt;

			$sijaistiedot[$sijainen_id] = $row_array;
		}

		$sql = "SELECT id, sijainen_id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE sijainen_id IN(" . $sijainen_idt . ") AND pvm = :pvm AND nakyvyys = 0" . $hakuWhere . $jarjestysOrder;
		$values = $con->prepare($sql);
		$values->bindParam(':pvm', $pvm);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$vuoromaara++;
			$row_array = array();
			$row_array['id']	= $row['id'];
			$row_array['sijainen_id'] = $row['sijainen_id'];
			$row_array['vuorotyyppi'] = $row['vuorotyyppi'];
			$row_array['osasto_id'] = $row['osasto_id'];
			$row_array['raportti_osasto_id'] = $row['raportti_osasto_id'];
			$row_array['tausta_id'] = $row['tausta_id'];
			$row_array['tausta_kommentti'] = $row['tausta_kommentti'];

			if (!$_POST['muokkausoikeudet'] && $diff->format('%m') >= 1) {
				$row_array['luku'] = 1;
			} else {
				$row_array['luku'] = $row['luku'];
			}

			array_push($vuorotiedot, $row_array);
		}

		$return_arr["vuoromaara"] = $vuoromaara;
		$return_arr["vuorot"] = $vuorotiedot;
		$return_arr["sijaistiedot"] = $sijaistiedot;

		$con = null;
		$values = null;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		$con = null;
		$values = null;
		echo "Tietokantavirhe: " . $e->getMessage();
	}
} else {
	echo "parametri";
}
