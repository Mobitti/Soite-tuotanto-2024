<?php

include_once '../config/config.php';

if (
	isset($_POST['reservilainen_id'])
	&& isset($_POST['tyojakso_id'])
	&& isset($_POST['osasto_id'])
	&& isset($_POST['alku_pvm'])
	&& isset($_POST['loppu_pvm'])
	&& isset($_POST['tyomaara'])
	&& isset($_POST['reservitausta_id'])
	&& isset($_POST['kommentti'])
) {
	try {
		$return_arr = array();
		$paivitysWhere = "";
		$alku_pvm = substr($_POST['alku_pvm'], 6, 4) . "-" . substr($_POST['alku_pvm'], 3, 2) . "-" . substr($_POST['alku_pvm'], 0, 2);
		$loppu_pvm = substr($_POST['loppu_pvm'], 6, 4) . "-" . substr($_POST['loppu_pvm'], 3, 2) . "-" . substr($_POST['loppu_pvm'], 0, 2);
		$tyomaara = 0;
		$alittuvat_jakso_tiedot = array();
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$tyomaara = $_POST['tyomaara'];

		if ($_POST['tyojakso_id'] == 0) {
			$aikavalit = array();
			$sql = "SELECT (CASE WHEN (:alku_pvm > alku_pvm) THEN :alku_pvm ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) UNION SELECT (CASE WHEN (:loppu_pvm < loppu_pvm) THEN :loppu_pvm ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) ORDER BY pvm ASC";
			$values = $con->prepare($sql);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->bindParam(':reservilainen_id', $_POST['reservilainen_id']);
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
						$values->bindParam(':reservilainen_id', $_POST['reservilainen_id']);
						$values->execute();
						while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
							if ($row['tyomaara_prosentti'] != null) {
								$tyomaara_yhteensa += $row['tyomaara_prosentti'];
							}
						}

						$tyomaara_yhteensa = $tyomaara_yhteensa + $tyomaara;

						if ($tyomaara_yhteensa > 100) {
							$con = null;
							$values = null;
							$row_array['virhe'] = "yli";
							$row_array['viesti'] = $tyomaara_yhteensa .  "%";
							array_push($return_arr, $row_array);
							echo json_encode($return_arr);
							return;
						}
					}
				}
			}

			$sql = "INSERT INTO tyojakso (id, reservilainen_id, osasto_id, alku_pvm, loppu_pvm, tyomaara, reservitausta_id, kommentti) 
				VALUES(NULL, :reservilainen_id, :osasto_id, :alku_pvm, :loppu_pvm, :tyomaara, :reservitausta_id, :kommentti)";
			$values = $con->prepare($sql);
			$values->bindParam(':reservilainen_id', $_POST['reservilainen_id']);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->bindParam(':tyomaara', $_POST['tyomaara']);
			$values->bindParam(':reservitausta_id', $_POST['reservitausta_id']);
			$values->bindParam(':kommentti', $_POST['kommentti']);
			$values->execute();
			$row_array['virhe'] = "";
			$row_array['viesti'] = "";
			array_push($return_arr, $row_array);
		} else {
			$aikavalit = array();
			$sql = "SELECT (CASE WHEN (:alku_pvm > alku_pvm) THEN :alku_pvm ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) UNION SELECT (CASE WHEN (:loppu_pvm < loppu_pvm) THEN :loppu_pvm ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) ORDER BY pvm ASC";
			$values = $con->prepare($sql);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->bindParam(':reservilainen_id', $_POST['reservilainen_id']);
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
						$sql = "SELECT tyomaara AS tyomaara_prosentti FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) AND id != :id";
						$values = $con->prepare($sql);
						$values->bindParam(':alku_pvm', $tyojakso_alku_pvm);
						$values->bindParam(':loppu_pvm', $tyojakso_loppu_pvm);
						$values->bindParam(':reservilainen_id', $_POST['reservilainen_id']);
						$values->bindParam(':id', $_POST['tyojakso_id']);
						$values->execute();
						while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
							if ($row['tyomaara_prosentti'] != null) {
								$tyomaara_yhteensa += $row['tyomaara_prosentti'];
							}
						}

						$tyomaara_yhteensa = $tyomaara_yhteensa + $tyomaara;

						if ($tyomaara_yhteensa > 100) {
							$con = null;
							$values = null;
							$row_array['virhe'] = "yli";
							$row_array['viesti'] = $tyomaara_yhteensa . "%";
							array_push($return_arr, $row_array);
							echo json_encode($return_arr);
							return;
						}
					}
				}
			}

			$sql = "UPDATE tyojakso SET osasto_id = :osasto_id, alku_pvm = :alku_pvm, loppu_pvm = :loppu_pvm, 
					tyomaara = :tyomaara, reservitausta_id = :reservitausta_id, kommentti = :kommentti WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':osasto_id', $_POST['osasto_id']);
			$values->bindParam(':alku_pvm', $alku_pvm);
			$values->bindParam(':loppu_pvm', $loppu_pvm);
			$values->bindParam(':tyomaara', $_POST['tyomaara']);
			$values->bindParam(':reservitausta_id', $_POST['reservitausta_id']);
			$values->bindParam(':kommentti', $_POST['kommentti']);
			$values->bindParam(':id', $_POST['tyojakso_id']);
			$values->execute();
			$row_array['virhe'] = "";
			$row_array['viesti'] = "";
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
