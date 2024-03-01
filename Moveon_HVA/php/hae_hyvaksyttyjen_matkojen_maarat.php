<?php
include_once '../config/config.php';
require '../fpdf/fpdf.php';

if (
	isset($_POST['sijainen_id'])
	&& isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
) {
	try {
		$return_arr = array();
		$matkamaara = 0;

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
			$pvmWhere = " AND (pvm <= '" . $loppu_pvm . "' AND pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['alkupvm'] != '') {
			$pvmWhere = " AND (pvm >= '" . $alku_pvm . "')";
		} else if ($_POST['loppupvm'] != '') {
			$pvmWhere = " AND (pvm <= '" . $loppu_pvm . "')";
		}

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT COUNT(id) AS matkamaara FROM matka WHERE sijainen_id = :sijainen_id AND tila = 3" . $pvmWhere;
		$values = $con->prepare($sql);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if ($row != null) {
			$matkamaara = $row['matkamaara'];
		}

		$return_arr['matkamaara'] = $matkamaara;

		$con = null;
		$values = null;
		echo json_encode($return_arr);
	} catch (PDOException $e) {
		$con = null;
		$values = null;
		echo "Tietokantavirhe" . $e->getMessage();
	}
} else {
	echo "parametri";
}
