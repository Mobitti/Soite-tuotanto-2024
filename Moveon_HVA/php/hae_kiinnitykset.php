<?php

include_once '../config/config.php';

if (isset($_POST['id'])) {
	try {
		$return_arr = array();
		$kiinnitykset = array();
		$suunniteltu_vuorotyyppi = "";
		$sijaisen_kotiosasto = 0;
		$kiinnitykset_julkaistu = false;

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		//Haetaan suunnitellut_kiinnitykset
		$sql = "SELECT id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id ORDER BY vuorotyyppi";
		$values = $con->prepare($sql);
		$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$suunnittelu_tiedot['id'] = $row['id'];
			$suunnittelu_tiedot['vuorotyyppi'] = $row['vuorotyyppi'];
			$suunnittelu_tiedot['raportti_osasto_id'] = $row['raportti_osasto_id'];
			$suunnittelu_tiedot['osasto_id'] = $row['osasto_id'];
			$suunnittelu_tiedot['tausta_id'] = $row['tausta_id'];
			$suunnittelu_tiedot['tausta_kommentti'] = $row['tausta_kommentti'];
			$suunnittelu_tiedot['luku'] = $row['luku'];

			array_push($kiinnitykset, $suunnittelu_tiedot);
		}

		if (count($kiinnitykset) <= 0) {
			//Haetaan vuorojen kiinnitykset jos suunniteltuja kiinnityksiä ei löytynyt
			$sql = "SELECT id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id ORDER BY vuorotyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$vuoro_tiedot['id'] = $row['id'];
				$vuoro_tiedot['vuorotyyppi'] = $row['vuorotyyppi'];
				$vuoro_tiedot['raportti_osasto_id'] = $row['raportti_osasto_id'];
				$vuoro_tiedot['osasto_id'] = $row['osasto_id'];
				$vuoro_tiedot['tausta_id'] = $row['tausta_id'];
				$vuoro_tiedot['tausta_kommentti'] = $row['tausta_kommentti'];
				$vuoro_tiedot['luku'] = $row['luku'];

				array_push($kiinnitykset, $vuoro_tiedot);
			}

			if (count($kiinnitykset) > 0) {
				$kiinnitykset_julkaistu = true;
			}
		}

		if (count($kiinnitykset) <= 0) {
			//Palautetaan tyhjät kiinnitykset jos suunnitellut kiinnitykset ja vuorojen kiinnitykset ovat tyhjät
			$sql = "SELECT vuorotyyppi, sijainen_id FROM suunniteltuvuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if ($row != null) {
				$sijainen_id = $row['sijainen_id'];
				$suunniteltu_vuorotyyppi = $row['vuorotyyppi'];
			}

			//Vuoroyhdistelmien haku
			$sql = "SELECT tyyppi, vuorotyypit FROM vuoroyhdistelma";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$vuoroyhdistelmat[$row['tyyppi']]['vuorotyypit'] = preg_split('//u', $row['vuorotyypit'], -1, PREG_SPLIT_NO_EMPTY); //Pilkotaan vuoroyhdistelmän vuorotyypit
			}

			//Tarkistetaan löytyykö suunniteltuavuoroa vuoroyhdistelmistä
			if (array_key_exists($suunniteltu_vuorotyyppi, $vuoroyhdistelmat)) {
				$suunnitellut_vuorotyypit = $vuoroyhdistelmat[$suunniteltu_vuorotyyppi]['vuorotyypit'];
			} else {
				$suunnitellut_vuorotyypit = array($suunniteltu_vuorotyyppi);
			}

			//Vuorolukituksien haku (raportti_osasto_id = -1 ==> Sijaisen kotiosasto)
			$sql = "SELECT vuorotyyppi, raportti_osasto_id, osasto_id FROM vuorolukitus";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$vuorolukitukset[$row['vuorotyyppi']]['raportti_osasto_id'] = $row['raportti_osasto_id'];
				$vuorolukitukset[$row['vuorotyyppi']]['osasto_id'] = $row['osasto_id'];
			}

			//Sijaisen kotiosaston haku
			$sql = "SELECT osasto_id FROM sijainenosasto WHERE osastotyyppi = 1 AND sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $sijainen_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijaisen_kotiosasto = $row['osasto_id'];
			}

			for ($i = 0; $i < count($suunnitellut_vuorotyypit); $i++) {
				$vuorotyyppi = $suunnitellut_vuorotyypit[$i];
				$raportti_osasto_id = 0;
				$osasto_id = 0;
				$tausta_id = 0;
				$tausta_kommentti = "";
				$luku = 0;

				//Tarkistetaan löytyykö vuorotyyppiä vuorolukituksista
				if (array_key_exists($vuorotyyppi, $vuorolukitukset)) {
					$raportti_osasto_id = $vuorolukitukset[$vuorotyyppi]['raportti_osasto_id'];
					if ($suunniteltuvuoro_raportti_osasto_id == -1) {
						$raportti_osasto_id = $sijaisen_kotiosasto;
					}
					$osasto_id = $vuorolukitukset[$vuorotyyppi]['osasto_id'];
					$luku = 1;
				}

				$kiinnitys_tiedot['id'] = "";
				$kiinnitys_tiedot['vuorotyyppi'] = $vuorotyyppi;
				$kiinnitys_tiedot['raportti_osasto_id'] = $raportti_osasto_id;
				$kiinnitys_tiedot['osasto_id'] = $osasto_id;
				$kiinnitys_tiedot['tausta_id'] = $tausta_id;
				$kiinnitys_tiedot['tausta_kommentti'] = $tausta_kommentti;
				$kiinnitys_tiedot['luku'] = $luku;

				array_push($kiinnitykset, $kiinnitys_tiedot);
			}
		}

		$return_arr['kiinnitykset'] = $kiinnitykset;
		$return_arr['kiinnitykset_julkaistu'] = $kiinnitykset_julkaistu;

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
