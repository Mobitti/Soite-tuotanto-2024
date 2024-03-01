<?php

include_once '../config/config.php';

if (
	isset($_POST['sijainen_id'])
	&& isset($_POST['vuosi'])
	&& isset($_POST['kuukausi'])
) {
	try {
		$return_arr = array();

		$alku_pvm = date("Y-m-d", mktime(0, 0, 0, $_POST['kuukausi'], 1, $_POST['vuosi']));
		if ($_POST['kuukausi'] == 12) {
			$loppu_pvm = date("Y-m-d", mktime(0, 0, 0, 1, 1, ($_POST['vuosi'] + 1)));
		} else {
			$loppu_pvm = date("Y-m-d", mktime(0, 0, 0, ($_POST['kuukausi'] + 1), 1, $_POST['vuosi']));
		}

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT id, pvm, vuorotyyppi, (SELECT nimi FROM osasto WHERE id = osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = tausta_id) AS tausta FROM vuoro WHERE sijainen_id = :sijainen_id AND (vuorotyyppi = '*' OR osasto_id NOT IN(SELECT id FROM osasto WHERE toimialue_id = 0))  AND osasto_id NOT IN(SELECT osasto_id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osastotyyppi = 1) AND osasto_id != 0  AND (pvm < '" . $loppu_pvm . "' AND pvm >= '" . $alku_pvm . "') ORDER BY pvm ASC";
		$values = $con->prepare($sql);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->bindParam(':tausta_id', $kotiosastotausta_id);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$pvm = $row['pvm'];
			if (!array_key_exists($pvm, $return_arr)) {
				$return_arr[$pvm] = array();
			}

			$pvm_tiedot = array();
			$pvm_tiedot["id"] = $row['id'];
			$pvm_tiedot["vuorotyyppi"] = $row['vuorotyyppi'];
			if ($row['osasto'] != null) {
				$pvm_tiedot["osasto"] = $row['osasto'];
			} else {
				$pvm_tiedot["osasto"] = "Ei osastoa";
			}

			if ($row['tausta'] != null) {
				$pvm_tiedot["tausta"] = $row['tausta'];
			} else {
				$pvm_tiedot["tausta"] = "Ei taustaa";
			}

			array_push($return_arr[$pvm], $pvm_tiedot);
		}

		if (count($return_arr) == 0) {
			$return_arr = null;
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
