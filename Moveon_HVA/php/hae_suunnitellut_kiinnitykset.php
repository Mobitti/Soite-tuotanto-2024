<?php

include_once '../config/config.php';

if (
	isset($_POST['id'])
	&& isset($_POST['tyyppi'])
) {
	try {
		$return_arr = array();
		$suunnitellut_kiinnitykset = array();
		$suunnitellut_vuorotyypit = array();
		$kiinnitetyt_vuorotyypit = array();
		$sijaisen_kotiosasto = 0;
		$vuorolukitukset = array();
		$vuoroyhdistelmat = array();
		$suunniteltu_vuorotyyppi = $_POST['tyyppi'];

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT sijainen_id FROM suunniteltuvuoro WHERE id = :id";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if ($row != null) {
			$sijainen_id = $row['sijainen_id'];

			//Vuoroyhdistelmien haku
			$sql = "SELECT tyyppi, vuorotyypit FROM vuoroyhdistelma";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$vuoroyhdistelmat[$row['tyyppi']]['vuorotyypit'] = preg_split('//u', $row['vuorotyypit'], -1, PREG_SPLIT_NO_EMPTY); //Pilkotaan vuoroyhdistelmän vuorotyypit
			}

			//Tarkistetaan löytyykö suunniteltua vuoroa vuoroyhdistelmistä
			if (array_key_exists($suunniteltu_vuorotyyppi, $vuoroyhdistelmat)) {
				$suunnitellut_vuorotyypit = array_fill_keys($vuoroyhdistelmat[$suunniteltu_vuorotyyppi]['vuorotyypit'], '');
			} else {
				$suunnitellut_vuorotyypit = array_fill_keys(array($suunniteltu_vuorotyyppi), '');
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

			//Hae suunnitellut kiinnitykset
			$sql = "SELECT vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id ORDER BY vuorotyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$suunnittelu_tiedot['vuorotyyppi'] = $row['vuorotyyppi'];
				$suunnittelu_tiedot['raportti_osasto_id'] = $row['raportti_osasto_id'];
				$suunnittelu_tiedot['osasto_id'] = $row['osasto_id'];
				$suunnittelu_tiedot['tausta_id'] = $row['tausta_id'];
				$suunnittelu_tiedot['tausta_kommentti'] = $row['tausta_kommentti'];
				$suunnittelu_tiedot['luku'] = $row['luku'];

				$kiinnitetyt_vuorotyypit[$row['vuorotyyppi']] = $suunnittelu_tiedot;
			}

			if (count($kiinnitetyt_vuorotyypit) <= 0) {
				//Hae vuorojen kiinnitykset
				$sql = "SELECT vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id ORDER BY vuorotyyppi";
				$values = $con->prepare($sql);
				$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$vuoro_tiedot['vuorotyyppi'] = $row['vuorotyyppi'];
					$vuoro_tiedot['raportti_osasto_id'] = $row['raportti_osasto_id'];
					$vuoro_tiedot['osasto_id'] = $row['osasto_id'];
					$vuoro_tiedot['tausta_id'] = $row['tausta_id'];
					$vuoro_tiedot['tausta_kommentti'] = $row['tausta_kommentti'];
					$vuoro_tiedot['luku'] = $row['luku'];

					$kiinnitetyt_vuorotyypit[$row['vuorotyyppi']] = $vuoro_tiedot;
				}
			}

			//Verrataan suunnitellunvuoron vuorotyyppejä kiinnityksien vuorotyyppeihin
			$suunniteltuvuoro_samat_vuorot = array_keys(array_intersect_key($suunnitellut_vuorotyypit, $kiinnitetyt_vuorotyypit));
			$suunniteltuvuoro_eriavat_vuorot = array_keys(array_diff_key($suunnitellut_vuorotyypit, $kiinnitetyt_vuorotyypit));
			$suunniteltuvuoro_eriavat_kiinnitys_vuorot = array_keys(array_diff_key($kiinnitetyt_vuorotyypit, $suunnitellut_vuorotyypit));

			//Vuorot, joita ei löytnyt kiinnityksistä, käydään nämä läpi.
			for ($i = 0; $i < count($suunniteltuvuoro_eriavat_vuorot); $i++) {
				$vuorotyyppi = $suunniteltuvuoro_eriavat_vuorot[$i];
				$raportti_osasto_id = 0;
				$osasto_id = 0;
				$tausta_id = 0;
				$tausta_kommentti = "";
				$luku = 0;

				//Tarkistetaan löytyykö vuorotyyppiä vuorolukituksista
				if (array_key_exists($vuorotyyppi, $vuorolukitukset)) {
					$raportti_osasto_id = $vuorolukitukset[$vuorotyyppi]['raportti_osasto_id'];
					if ($raportti_osasto_id == -1) {
						$raportti_osasto_id = $sijaisen_kotiosasto;
					}
					$osasto_id = $vuorolukitukset[$vuorotyyppi]['osasto_id'];
					$luku = 1;
				} else if (count($suunniteltuvuoro_eriavat_kiinnitys_vuorot) > 0) {
					$kiinnitys_vuorotyyppi = $suunniteltuvuoro_eriavat_kiinnitys_vuorot[0];

					$raportti_osasto_id = $kiinnitetyt_vuorotyypit[$kiinnitys_vuorotyyppi]['raportti_osasto_id'];
					$osasto_id = $kiinnitetyt_vuorotyypit[$kiinnitys_vuorotyyppi]['osasto_id'];
					$tausta_id = $kiinnitetyt_vuorotyypit[$kiinnitys_vuorotyyppi]['tausta_id'];
					$tausta_kommentti = $kiinnitetyt_vuorotyypit[$kiinnitys_vuorotyyppi]['tausta_kommentti'];
					$luku = 0;
					//$luku = $kiinnitetyt_vuorotyypit[$kiinnitys_vuorotyyppi]['luku'];	

					array_shift($suunniteltuvuoro_eriavat_kiinnitys_vuorot);
				}

				$kiinnitys_tiedot['vuorotyyppi'] = $vuorotyyppi;
				$kiinnitys_tiedot['raportti_osasto_id'] = $raportti_osasto_id;
				$kiinnitys_tiedot['osasto_id'] = $osasto_id;
				$kiinnitys_tiedot['tausta_id'] = $tausta_id;
				$kiinnitys_tiedot['tausta_kommentti'] = $tausta_kommentti;
				$kiinnitys_tiedot['luku'] = $luku;

				array_push($suunnitellut_kiinnitykset, $kiinnitys_tiedot);
			}

			//Vuorot, jotka löytyivät kiinnityksistä. Siirretään kiinnitykset.
			for ($i = 0; $i < count($suunniteltuvuoro_samat_vuorot); $i++) {
				$vuorotyyppi = $suunniteltuvuoro_samat_vuorot[$i];

				$kiinnitys_tiedot['vuorotyyppi'] = $vuorotyyppi;
				$kiinnitys_tiedot['raportti_osasto_id'] = $kiinnitetyt_vuorotyypit[$vuorotyyppi]['raportti_osasto_id'];
				$kiinnitys_tiedot['osasto_id'] = $kiinnitetyt_vuorotyypit[$vuorotyyppi]['osasto_id'];
				$kiinnitys_tiedot['tausta_id'] = $kiinnitetyt_vuorotyypit[$vuorotyyppi]['tausta_id'];
				$kiinnitys_tiedot['tausta_kommentti'] = $kiinnitetyt_vuorotyypit[$vuorotyyppi]['tausta_kommentti'];
				$kiinnitys_tiedot['luku'] = $kiinnitetyt_vuorotyypit[$vuorotyyppi]['luku'];

				array_push($suunnitellut_kiinnitykset, $kiinnitys_tiedot);
			}
		}

		$row_array['suunnitellut_kiinnitykset'] = $suunnitellut_kiinnitykset;
		array_push($return_arr, $row_array);

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
