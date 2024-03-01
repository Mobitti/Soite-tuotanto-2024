<?php

include_once '../config/config.php';

if (
	isset($_POST['sijainen_id'])
	&& isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
	&& isset($_POST['tilat'])
) {
	try {
		$return_arr = array();

		$alku_pvm = "";
		$loppu_pvm = "";
		if ($_POST['alkupvm'] != "") {
			$alku_pvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
		}
		if ($_POST['loppupvm'] != "") {
			$loppu_pvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
		}

		$pvmWhere = "";
		if ($_POST['alkupvm'] != '' && $_POST['loppupvm'] != '') {
			$pvmWhere = " AND (m.pvm <= '" . $loppu_pvm . "' AND m.pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['alkupvm'] != '') {
			$pvmWhere = " AND (m.pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['loppupvm'] != '') {
			$pvmWhere = " AND (m.pvm <= '" . $loppu_pvm . "')";
		}
		/*
		$alku_pvm = date("Y-m-d",mktime(0,0,0,$_POST['kuukausi'],1,$_POST['vuosi']));
		if($_POST['kuukausi'] == 12) {
			$loppu_pvm = date("Y-m-d",mktime(0,0,0,1,1,($_POST['vuosi'] + 1)));
		}
		else {
			$loppu_pvm = date("Y-m-d",mktime(0,0,0,($_POST['kuukausi'] + 1),1,$_POST['vuosi']));
		}
		*/
		$tilaWhere = "'" . implode("','", $_POST['tilat']) . "'";

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT m.id, m.pvm, m.vuoro_id, m.matka, m.selite, m.lahtoaika, m.paluuaika, m.km, m.tila, v.vuorotyyppi, (SELECT lyhenne FROM osasto WHERE id = v.osasto_id) AS osasto FROM matka m LEFT JOIN vuoro v ON m.vuoro_id = v.id WHERE m.sijainen_id = :sijainen_id AND m.tila IN('" . implode("','", $_POST['tilat']) . "')" . $pvmWhere . " ORDER BY m.pvm ASC";
		$values = $con->prepare($sql);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['pvm'] =  substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4);
			$row_array['vuorotyyppi'] = $row['vuorotyyppi'];
			$row_array['osasto'] = $row['osasto'];
			$row_array['matka'] = $row['matka'];
			$row_array['selite'] = $row['selite'];
			$row_array['lahtoaika'] = substr($row['lahtoaika'], 0, 5);
			$row_array['paluuaika'] = substr($row['paluuaika'], 0, 5);
			$row_array['km'] = $row['km'];
			$row_array['tila'] = $row['tila'];

			array_push($return_arr, $row_array);
		}

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
