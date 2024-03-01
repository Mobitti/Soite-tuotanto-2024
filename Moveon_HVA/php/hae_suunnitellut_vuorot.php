<?php

include_once '../config/config.php';

if (
	isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
	&& isset($_POST['sijainen_idt'])
) {

	try {
		$return_arr = array();
		$vuoromaara = 0;
		$suunnitellut_vuoro_idt = array();
		$vuoro_kiinnitykset = array();
		$suunnitellut_kiinnitykset = array();
		$suunnitellut_vuoro_tiedot = array();
		$nakyvyys_tiedot = array();
		$vuoroyhdistelmat = array();
		$sijainen_idt = "'" . implode("','", $_POST['sijainen_idt']) . "'";

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT tyyppi, vuorotyypit FROM vuoroyhdistelma";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$vuoroyhdistelmat[$tyyppi] == strlen($row['vuorotyypit']);
		}

		$sql = "SELECT id, alkupvm, loppupvm, vuorotyyppi, sijainen_id, luku, muokattu FROM suunniteltuvuoro WHERE poisto = 0 AND DATE(alkupvm) >= DATE(:alkupvm) AND DATE(loppupvm) <= DATE(:loppupvm) AND sijainen_id IN(" . $sijainen_idt . ") ORDER BY alkupvm, sijainen_id";
		$values = $con->prepare($sql);
		$values->bindParam(':alkupvm', $_POST['alkupvm']);
		$values->bindParam(':loppupvm', $_POST['loppupvm']);
		$values->execute();
		$suunnitellut_vuorot = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($suunnitellut_vuorot); $i++) {
			if (array_key_exists($suunnitellut_vuorot[$i]['vuorotyyppi'], $vuoroyhdistelmat)) {
				$vuoromaara += $vuoroyhdistelmat[$suunnitellut_vuorot[$i]['vuorotyyppi']];
			} else {
				$vuoromaara++;
			}

			$row_array = array();
			$row_array['id'] = $suunnitellut_vuorot[$i]['id'];
			$row_array['start_date'] = $suunnitellut_vuorot[$i]['alkupvm'];
			$row_array['end_date'] = $suunnitellut_vuorot[$i]['loppupvm'];
			$row_array['color'] = "#ffffff";
			$row_array['vuorotyyppi'] = $suunnitellut_vuorot[$i]['vuorotyyppi'];
			$row_array['sijainen_id'] = $suunnitellut_vuorot[$i]['sijainen_id'];
			$row_array['luku'] = $suunnitellut_vuorot[$i]['luku'];
			$row_array['muokattu'] = $suunnitellut_vuorot[$i]['muokattu'];
			$row_array['nakyvyys'] = -1;

			array_push($suunnitellut_vuoro_idt, $suunnitellut_vuorot[$i]['id']);
			array_push($suunnitellut_vuoro_tiedot, $row_array);
		}

		$sql = "SELECT DISTINCT(suunniteltuvuoro_id), nakyvyys FROM vuoro WHERE suunniteltuvuoro_id IN ('" . implode("','", $suunnitellut_vuoro_idt) . "')";
		$values = $con->prepare($sql);
		$values->execute();
		$nakyvyydet = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($nakyvyydet); $i++) {
			$nakyvyys_tiedot[$nakyvyydet[$i]['suunniteltuvuoro_id']] = $nakyvyydet[$i]['nakyvyys'];
		}

		$sql = "SELECT suunniteltuvuoro_id, vuorotyyppi, luku, osasto_id, (SELECT lyhenne FROM osasto WHERE id = osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = tausta_id) AS tausta FROM vuoro WHERE suunniteltuvuoro_id IN ('" . implode("','", $suunnitellut_vuoro_idt) . "') AND osasto_id != 0 ORDER BY id";
		$values = $con->prepare($sql);
		$values->execute();
		$vuorot = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($vuorot); $i++) {
			$vuoro_tiedot = array();
			$vuoro_tiedot['vuorotyyppi'] = $vuorot[$i]['vuorotyyppi'];
			$vuoro_tiedot['osasto'] = $vuorot[$i]['osasto'];
			$vuoro_tiedot['osasto_id'] = $vuorot[$i]['osasto_id'];
			if ($vuorot[$i]['tausta'] == null) {
				$vuoro_tiedot['tausta'] = "";
			} else {
				$vuoro_tiedot['tausta'] = $vuorot[$i]['tausta'];
			}

			$vuoro_tiedot['luku'] = $vuorot[$i]['luku'];

			if (array_key_exists($vuorot[$i]['suunniteltuvuoro_id'], $vuoro_kiinnitykset)) {
				array_push($vuoro_kiinnitykset[$vuorot[$i]['suunniteltuvuoro_id']], $vuoro_tiedot);
			} else {
				$vuoro_kiinnitykset[$vuorot[$i]['suunniteltuvuoro_id']] = array();
				array_push($vuoro_kiinnitykset[$vuorot[$i]['suunniteltuvuoro_id']], $vuoro_tiedot);
			}
		}

		$sql = "SELECT suunniteltuvuoro_id, vuorotyyppi, luku, osasto_id, (SELECT lyhenne FROM osasto WHERE id = osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = tausta_id) AS tausta FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id IN ('" . implode("','", $suunnitellut_vuoro_idt) . "') ORDER BY id";
		$values = $con->prepare($sql);
		$values->execute();
		$kiinnitykset = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($kiinnitykset); $i++) {
			$suunnitellut_tiedot = array();
			$suunnitellut_tiedot['vuorotyyppi'] = $kiinnitykset[$i]['vuorotyyppi'];
			if ($kiinnitykset[$i]['osasto'] == null) {
				$suunnitellut_tiedot['osasto'] = "";
				$suunnitellut_tiedot['osasto_id'] = "";
			} else {
				$suunnitellut_tiedot['osasto'] = $kiinnitykset[$i]['osasto'];
				$suunnitellut_tiedot['osasto_id'] = $kiinnitykset[$i]['osasto_id'];
			}

			if ($kiinnitykset[$i]['tausta'] == null) {
				$suunnitellut_tiedot['tausta'] = "";
			} else {
				$suunnitellut_tiedot['tausta'] = $kiinnitykset[$i]['tausta'];
			}

			$suunnitellut_tiedot['luku'] = $kiinnitykset[$i]['luku'];

			if (array_key_exists($kiinnitykset[$i]['suunniteltuvuoro_id'], $suunnitellut_kiinnitykset)) {
				array_push($suunnitellut_kiinnitykset[$kiinnitykset[$i]['suunniteltuvuoro_id']], $suunnitellut_tiedot);
			} else {
				$suunnitellut_kiinnitykset[$kiinnitykset[$i]['suunniteltuvuoro_id']] = array();
				array_push($suunnitellut_kiinnitykset[$kiinnitykset[$i]['suunniteltuvuoro_id']], $suunnitellut_tiedot);
			}
		}

		for ($i = 0; $i < count($suunnitellut_vuoro_tiedot); $i++) {
			if (array_key_exists($suunnitellut_vuoro_tiedot[$i]['id'], $vuoro_kiinnitykset)) {
				$suunnitellut_vuoro_tiedot[$i]['vuoro_kiinnitykset'] = $vuoro_kiinnitykset[$suunnitellut_vuoro_tiedot[$i]['id']];
			} else {
				$suunnitellut_vuoro_tiedot[$i]['vuoro_kiinnitykset'] = array();
			}

			if (array_key_exists($suunnitellut_vuoro_tiedot[$i]['id'], $suunnitellut_kiinnitykset)) {
				$suunnitellut_vuoro_tiedot[$i]['suunnitellut_kiinnitykset'] = $suunnitellut_kiinnitykset[$suunnitellut_vuoro_tiedot[$i]['id']];
			} else {
				$suunnitellut_vuoro_tiedot[$i]['suunnitellut_kiinnitykset'] = array();
			}

			if (array_key_exists($suunnitellut_vuoro_tiedot[$i]['id'], $nakyvyys_tiedot)) {
				$suunnitellut_vuoro_tiedot[$i]['nakyvyys'] = $nakyvyys_tiedot[$suunnitellut_vuoro_tiedot[$i]['id']];
			} else {
				$suunnitellut_vuoro_tiedot[$i]['nakyvyys'] = -1;
			}
		}

		$return_arr = $suunnitellut_vuoro_tiedot;
		array_unshift($return_arr, $vuoromaara);

		$con = null;
		$values = null;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
