<?php

include_once '../config/config.php';
include_once 'laheta_viesti.php';

if (
	isset($_POST['nakyvyys'])
	&& isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
	&& isset($_POST['sijainen_idt'])
	&& isset($_POST['kayttaja'])
) {

	try {
		$alkupvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
		$loppupvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
		$return_arr = array();
		$suunnitellut_vuorot = array();
		$poistetut_vuorot = 0;
		$poistetut_haamuvuorot = 0;
		$paivitetyt_vuorot = 0;
		$luodut_vuorot = 0;
		$paivitetyt_kiinnitykset = 0;
		$suunnittelu_vuoro_idt = array();
		$sijaisten_puhelin_tiedot = array();
		$sijaisten_kotiosastot = array();
		$vuorolukitukset = array();
		$vuoroyhdistelmat = array();
		$osastotiedot = array();
		$taustatiedot = array();
		$lokitapahtumat = array();
		$sijainen_idt = "'" . implode("','", $_POST['sijainen_idt']) . "'";

		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		//Hae osastojen nimet
		$sql = "SELECT id, lyhenne FROM osasto";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$osastotiedot[$row['id']] = $row['lyhenne'];
		}

		//Hae taustojen nimet
		$sql = "SELECT id, selite FROM tausta";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$taustatiedot[$row['id']] = $row['selite'];
		}

		//Sijaisten kotiosastojen haku
		$sql = "SELECT sijainen_id, osasto_id FROM sijainenosasto WHERE osastotyyppi = 1";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$sijaisten_kotiosastot[$row['sijainen_id']] = $row['osasto_id'];
		}

		//Sijaisten sms asetukset
		$sql = "SELECT id, puhelin, kiinnitys_sms FROM sijainen WHERE aktiivinen = 1";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$sijaisten_puhelin_tiedot[$row['id']]["sms"] = $row['kiinnitys_sms'];
			$sijaisten_puhelin_tiedot[$row['id']]["puhelin"] = $row['puhelin'];
		}

		//Vuorolukituksien haku (raportti_osasto_id = -1 ==> Sijaisen kotiosasto)
		$sql = "SELECT vuorotyyppi, raportti_osasto_id, osasto_id FROM vuorolukitus";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$vuorolukitukset[$row['vuorotyyppi']]['raportti_osasto_id'] = $row['raportti_osasto_id'];
			$vuorolukitukset[$row['vuorotyyppi']]['osasto_id'] = $row['osasto_id'];
		}

		//Vuoroyhdistelmien haku
		$sql = "SELECT tyyppi, vuorotyypit FROM vuoroyhdistelma";
		$values = $con->prepare($sql);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$vuoroyhdistelmat[$row['tyyppi']]['vuorotyypit'] = preg_split('//u', $row['vuorotyypit'], -1, PREG_SPLIT_NO_EMPTY); //Pilkotaan vuoroyhdistelmän vuorotyypit
		}

		//Haetaan poistettavat vuorot
		$sql = "SELECT id, pvm, vuorotyyppi, (SELECT nimi FROM sijainen WHERE sijainen.id = sijainen_id) AS sijaisen_nimi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE suunniteltuvuoro_id IN(SELECT id FROM suunniteltuvuoro WHERE poisto = 1 AND sijainen_id IN(" . $sijainen_idt . "))";
		$values = $con->prepare($sql);
		$values->execute();
		$poistettavat_vuorot = $values->fetchAll(PDO::FETCH_ASSOC);
		for ($i = 0; $i < count($poistettavat_vuorot); $i++) {
			//Poistetaan vuoro
			$sql = "DELETE FROM vuoro WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $poistettavat_vuorot[$i]['id']);
			$values->execute();
			if ($values->rowCount() > 0) {
				$poistetut_vuorot++;

				$lokitapahtuma["aikaleima"] = date("Y-m-d H:i:s");
				$lokitapahtuma["nakyma"] = "Vuorosuunnittelu";
				$lokitapahtuma["kayttaja"] = $_POST['kayttaja'];
				$lokitapahtuma["tapahtuma"] = "Vuoro poistettu";
				$lokitapahtuma["tunniste"] = substr($poistettavat_vuorot[$i]['pvm'], 8, 2) . "." . substr($poistettavat_vuorot[$i]['pvm'], 5, 2) . "." . substr($poistettavat_vuorot[$i]['pvm'], 0, 4) . " " . $poistettavat_vuorot[$i]['sijaisen_nimi'] . " " . $poistettavat_vuorot[$i]['vuorotyyppi'];

				$ed_kommentti = $poistettavat_vuorot[$i]['tausta_kommentti'];
				$ed_raporttiosasto = $poistettavat_vuorot[$i]['raportti_osasto_id'];
				$ed_osasto = $poistettavat_vuorot[$i]['osasto_id'];
				$ed_tausta = $poistettavat_vuorot[$i]['tausta_id'];
				$ed_luku = "Ei";

				if ($poistettavat_vuorot[$i]['luku'] == 1) {
					$ed_luku = "Kyllä";
				}

				$lokitapahtuma["edellinen_tieto"] = "Vuorotyyppi:" . $poistettavat_vuorot[$i]['vuorotyyppi'] . ", Kustannus:" . $ed_raporttiosasto . ", Osasto:"  . $ed_osasto . ", Tausta:" . $ed_tausta . ", Kommentti:" . $ed_kommentti . ", Luku:" . $ed_luku;
				$lokitapahtuma["tieto"] = "";
				array_push($lokitapahtumat, $lokitapahtuma);
			}
		}

		///Poistetaan poistettavat suunnitellut vuorot
		$sql = "DELETE FROM suunniteltuvuoro WHERE poisto = 1";
		$values = $con->prepare($sql);
		$values->execute();

		//Poistaa kaikki vuorot jolla ei löyty suunniteltua vuoroa
		$sql = "DELETE FROM vuoro WHERE suunniteltuvuoro_id NOT IN(SELECT id FROM suunniteltuvuoro)";
		$values = $con->prepare($sql);
		$values->execute();
		$poistetut_haamuvuorot = $values->rowCount();

		//Haetaan julkaistavat vuorot
		$sql = "SELECT id, alkupvm, vuorotyyppi, sijainen_id, (SELECT nimi FROM sijainen WHERE sijainen.id = sijainen_id) AS sijaisen_nimi FROM suunniteltuvuoro WHERE luku = 0 AND muokattu = 1 AND DATE(alkupvm) >= DATE(:alkupvm) AND DATE(alkupvm) <= DATE(:loppupvm) AND sijainen_id IN(" . $sijainen_idt . ") ORDER BY alkupvm, sijainen_id";
		$values = $con->prepare($sql);
		$values->bindParam(':alkupvm', $alkupvm);
		$values->bindParam(':loppupvm', $loppupvm);
		$values->execute();
		while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
			$row_array['id'] = $row['id'];
			$row_array['sijainen_id'] = $row['sijainen_id'];
			$row_array['sijaisen_nimi'] = $row['sijaisen_nimi'];
			$row_array['pvm'] = $row['alkupvm'];
			$row_array['vuorotyyppi'] = $row['vuorotyyppi'];

			array_push($suunnitellut_vuorot, $row_array);
			array_push($suunnittelu_vuoro_idt, $row['id']);
		}

		//Käydään läpi julkaistavat vuorot
		for ($i = 0; $i < count($suunnitellut_vuorot); $i++) {
			$suunniteltuvuoro_id = $suunnitellut_vuorot[$i]['id'];
			$suunniteltuvuoro_sijainen_id = $suunnitellut_vuorot[$i]['sijainen_id'];
			$suunniteltuvuoro_sijaisen_nimi = $suunnitellut_vuorot[$i]['sijaisen_nimi'];
			$suunniteltuvuoro_pvm = $suunnitellut_vuorot[$i]['pvm'];
			$suunniteltuvuoro_vuorotyyppi = $suunnitellut_vuorot[$i]['vuorotyyppi'];
			$suunniteltuvuoro_raportti_osasto_id = 0;
			$suunniteltuvuoro_osasto_id = 0;
			$suunniteltuvuoro_tausta_id = 0;
			$suunniteltuvuoro_tausta_kommentti = "";
			$suunniteltuvuoro_luku = 0;
			$suunniteltuvuoro_suunnittelu_vuorotyypit = array();
			$suunniteltuvuoro_vuoro_vuorotyypit = array();
			$suunniteltuvuoro_paivitys_vuorotyypit = array();
			$suunniteltuvuoro_vuoro_tiedot = array();

			//Tarkistetaan löytyykö suunniteltuavuoroa vuoroyhdistelmistä
			if (array_key_exists($suunniteltuvuoro_vuorotyyppi, $vuoroyhdistelmat)) {
				$suunniteltuvuoro_suunnittelu_vuorotyypit = array_fill_keys($vuoroyhdistelmat[$suunniteltuvuoro_vuorotyyppi]['vuorotyypit'], '');
			} else {
				$suunniteltuvuoro_suunnittelu_vuorotyypit = array_fill_keys(array($suunniteltuvuoro_vuorotyyppi), '');
			}

			//Tarkistetaan suunniteltuavuoroa vastaavat vuorot
			$sql = "SELECT id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id ORDER BY vuorotyyppi";
			$values = $con->prepare($sql);
			$values->bindParam(':suunniteltuvuoro_id', $suunniteltuvuoro_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$suunniteltuvuoro_vuoro_vuorotyypit[$row['vuorotyyppi']] = $row['id'];

				$vuorotiedot = array();
				$vuorottiedot["vuorotyyppi"] = $row['vuorotyyppi'];
				$vuorottiedot["raportti_osasto_id"] = $row['raportti_osasto_id'];
				$vuorottiedot["osasto_id"] = $row['osasto_id'];
				$vuorottiedot["tausta_id"] = $row['tausta_id'];
				$vuorottiedot["tausta_kommentti"] = $row['tausta_kommentti'];
				$vuorottiedot["luku"] = $row['luku'];
				$suunniteltuvuoro_vuoro_tiedot[$row['vuorotyyppi']] = $vuorottiedot;
			}

			//Verrataan suunnitellunvuoron vuorotyyppejä julkaistujen vuorojen vuorotyyppeihin
			$suunniteltuvuoro_puuttuvat_vuorot = array_keys(array_diff_key($suunniteltuvuoro_suunnittelu_vuorotyypit, $suunniteltuvuoro_vuoro_vuorotyypit));
			$suunniteltuvuoro_verrattavat_vuorot = array_keys(array_diff_key($suunniteltuvuoro_vuoro_vuorotyypit, $suunniteltuvuoro_suunnittelu_vuorotyypit));
			$suunniteltuvuoro_samat_vuorot = array_keys(array_intersect_key($suunniteltuvuoro_suunnittelu_vuorotyypit, $suunniteltuvuoro_vuoro_vuorotyypit));
			$suunniteltuvuoro_paivitetyt_vuorot = array();
			$suunniteltuvuoro_poistettavat_vuorot = array();

			//Tarkistetaanko onko julkaistuilla vuoroilla suunniteltuja kiinnityksiä
			if (count($suunniteltuvuoro_samat_vuorot) > 0) {
				for ($j = 0; $j < count($suunniteltuvuoro_samat_vuorot); $j++) {
					$suunniteltuvuoro_suunniteltu_vuorotyyppi = $suunniteltuvuoro_samat_vuorot[$j];  //Sama vuorotyyppi
					//Tarkistetaan löytyykö vuorolle suunniteltuja kiinnityksiä
					$sql = "SELECT raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id AND vuorotyyppi = :vuorotyyppi";
					$values = $con->prepare($sql);
					$values->bindParam(':suunniteltuvuoro_id', $suunniteltuvuoro_id);
					$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					if ($row != null) {
						$suunniteltuvuoro_vuoro_id = $suunniteltuvuoro_vuoro_vuorotyypit[$suunniteltuvuoro_suunniteltu_vuorotyyppi];
						$suunniteltuvuoro_raportti_osasto_id = $row['raportti_osasto_id'];
						$suunniteltuvuoro_osasto_id = $row['osasto_id'];
						$suunniteltuvuoro_tausta_id = $row['tausta_id'];
						$suunniteltuvuoro_tausta_kommentti = $row['tausta_kommentti'];
						$suunniteltuvuoro_luku = $row['luku'];

						//Päivitetään kiinnitykset
						$sql = "UPDATE vuoro SET raportti_osasto_id = :raportti_osasto_id, osasto_id = :osasto_id, tausta_id = :tausta_id, tausta_kommentti = :tausta_kommentti, luku = :luku WHERE id = :id";
						$values = $con->prepare($sql);
						$values->bindParam(':raportti_osasto_id', $suunniteltuvuoro_raportti_osasto_id);
						$values->bindParam(':osasto_id', $suunniteltuvuoro_osasto_id);
						$values->bindParam(':tausta_id', $suunniteltuvuoro_tausta_id);
						$values->bindParam(':tausta_kommentti', $suunniteltuvuoro_tausta_kommentti);
						$values->bindParam(':luku', $suunniteltuvuoro_luku);
						$values->bindParam(':id', $suunniteltuvuoro_vuoro_id);
						$values->execute();

						if ($values->rowCount() > 0) {
							$paivitetyt_kiinnitykset++;
							$lokitapahtuma["aikaleima"] = date("Y-m-d H:i:s");
							$lokitapahtuma["nakyma"] = "Vuorosuunnittelu";
							$lokitapahtuma["kayttaja"] = $_POST['kayttaja'];
							$lokitapahtuma["tapahtuma"] = "Vuoro päivitetty";
							$lokitapahtuma["tunniste"] = substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $suunniteltuvuoro_sijaisen_nimi . " " . $suunniteltuvuoro_suunniteltu_vuorotyyppi;

							$ed_kommentti = "Tietoa ei saatavilla";
							$ed_raporttiosasto = "Tietoa ei saatavilla";
							$ed_osasto = "Tietoa ei saatavilla";
							$ed_tausta = "Tietoa ei saatavilla";
							$ed_luku = "Tietoa ei saatavilla";

							if (array_key_exists($suunniteltuvuoro_suunniteltu_vuorotyyppi, $suunniteltuvuoro_vuoro_tiedot)) {
								$vuorotieto = $suunniteltuvuoro_vuoro_tiedot[$suunniteltuvuoro_suunniteltu_vuorotyyppi];

								if (array_key_exists($vuorotieto["raportti_osasto_id"], $osastotiedot)) {
									$ed_raporttiosasto = $osastotiedot[$vuorotieto["raportti_osasto_id"]];
								}

								if (array_key_exists($vuorotieto["osasto_id"], $osastotiedot)) {
									$ed_osasto = $osastotiedot[$vuorotieto["osasto_id"]];
								}

								if (array_key_exists($vuorotieto["tausta_id"], $taustatiedot)) {
									$ed_tausta = $taustatiedot[$vuorotieto["tausta_id"]];
								}

								$ed_kommentti = $vuorotieto["tausta_kommentti"];

								if ($vuorotieto["luku"] == 1) {
									$ed_luku = "Kyllä";
								} else if ($vuorotieto["luku"] == 0) {
									$ed_luku = "Ei";
								}
							}

							$lokitapahtuma["edellinen_tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_suunniteltu_vuorotyyppi . ", Kustannus:" . $ed_raporttiosasto . ", Osasto:"  . $ed_osasto . ", Tausta:" . $ed_tausta . ", Kommentti:" . $ed_kommentti . ", Luku:" . $ed_luku;

							$raporttiosasto = "Tietoa ei saatavilla";
							$osasto = "Tietoa ei saatavilla";
							$tausta = "Tietoa ei saatavilla";
							$luku = "Ei";

							if (array_key_exists($suunniteltuvuoro_raportti_osasto_id, $osastotiedot)) {
								$raporttiosasto = $osastotiedot[$suunniteltuvuoro_raportti_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_osasto_id, $osastotiedot)) {
								$osasto = $osastotiedot[$suunniteltuvuoro_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_tausta_id, $taustatiedot)) {
								$tausta = $taustatiedot[$suunniteltuvuoro_tausta_id];
							}

							if ($suunniteltuvuoro_luku == 1) {
								$luku = "Kyllä";
							}

							$lokitapahtuma["tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_suunniteltu_vuorotyyppi . ", Kustannus:" . $raporttiosasto . ", Osasto:"  . $osasto . ", Tausta:" . $tausta . ", Kommentti:" . $suunniteltuvuoro_tausta_kommentti . ", Luku:" . $luku;
							array_push($lokitapahtumat, $lokitapahtuma);

							//Lähetä tekstiviesti jos sijaisella asetettu sms kiinnityksestä
							if ($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["sms"] == 1) {
								$viesti = "Sinulla on varaus " . substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $osasto . " yksikköön";
								//laheta_sms_curl($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["puhelin"], $viesti, "Rekry", 49);
							}
						}
					}
				}
			}

			//Tarkistetaan onko puuttuvia vuoroja
			if (count($suunniteltuvuoro_puuttuvat_vuorot) > 0) {
				//Tarkistetaan luodaanko uusi vai päivitetäänkö olemassa oleva vuoro
				for ($j = 0; $j < count($suunniteltuvuoro_puuttuvat_vuorot); $j++) {
					$suunniteltuvuoro_suunniteltu_vuorotyyppi = $suunniteltuvuoro_puuttuvat_vuorot[$j];  //Puuttuva vuorotyyppi

					//Tarkistetaan löytyykö vuorolle suunniteltuja kiinnityksiä
					$sql = "SELECT raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id AND vuorotyyppi = :vuorotyyppi";
					$values = $con->prepare($sql);
					$values->bindParam(':suunniteltuvuoro_id', $suunniteltuvuoro_id);
					$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					if ($row != null) {
						$suunniteltuvuoro_raportti_osasto_id = $row['raportti_osasto_id'];
						$suunniteltuvuoro_osasto_id = $row['osasto_id'];
						$suunniteltuvuoro_tausta_id = $row['tausta_id'];
						$suunniteltuvuoro_tausta_kommentti = $row['tausta_kommentti'];
						$suunniteltuvuoro_luku = $row['luku'];
					} else {
						//Tarkistetaan löytyykö vuorotyyppiä vuorolukituksista
						if (array_key_exists($suunniteltuvuoro_suunniteltu_vuorotyyppi, $vuorolukitukset)) {
							$suunniteltuvuoro_luku = 1;
							$suunniteltuvuoro_raportti_osasto_id = $vuorolukitukset[$suunniteltuvuoro_suunniteltu_vuorotyyppi]['raportti_osasto_id'];
							$suunniteltuvuoro_osasto_id = $vuorolukitukset[$suunniteltuvuoro_suunniteltu_vuorotyyppi]['osasto_id'];
							if ($suunniteltuvuoro_raportti_osasto_id == -1) {
								if (array_key_exists($suunniteltuvuoro_sijainen_id, $sijaisten_kotiosastot)) {
									$suunniteltuvuoro_raportti_osasto_id = $sijaisten_kotiosastot[$suunniteltuvuoro_sijainen_id];
								} else {
									$suunniteltuvuoro_raportti_osasto_id = 0;
								}
							}
						}
					}

					if ($j + 1 > count($suunniteltuvuoro_verrattavat_vuorot)) { //Tarkistetaan onko verrattavissa vuoroissa vuorotyyppiä jota voidaan päivittää
						//Päivitettävää vuoroa ei löytynyt, luodaan uusi vuoro
						$sql = "INSERT INTO vuoro (id, suunniteltuvuoro_id, sijainen_id, pvm, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku) VALUES(NULL, :suunniteltuvuoro_id, :sijainen_id, :pvm, :vuorotyyppi, :raportti_osasto_id, :osasto_id, :tausta_id, :tausta_kommentti, :luku)";
						$values = $con->prepare($sql);
						$values->bindParam(':suunniteltuvuoro_id', $suunniteltuvuoro_id);
						$values->bindParam(':sijainen_id', $suunniteltuvuoro_sijainen_id);
						$values->bindParam(':pvm', $suunniteltuvuoro_pvm);
						$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
						$values->bindParam(':raportti_osasto_id', $suunniteltuvuoro_raportti_osasto_id);
						$values->bindParam(':osasto_id', $suunniteltuvuoro_osasto_id);
						$values->bindParam(':tausta_id', $suunniteltuvuoro_tausta_id);
						$values->bindParam(':tausta_kommentti', $suunniteltuvuoro_tausta_kommentti);
						$values->bindParam(':luku', $suunniteltuvuoro_luku);
						$values->execute();
						if ($values->rowCount() > 0) {
							$luodut_vuorot++;

							$lokitapahtuma["aikaleima"] = date("Y-m-d H:i:s");
							$lokitapahtuma["nakyma"] = "Vuorosuunnittelu";
							$lokitapahtuma["kayttaja"] = $_POST['kayttaja'];
							$lokitapahtuma["tapahtuma"] = "Vuoro luotu";
							$lokitapahtuma["tunniste"] = substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $suunniteltuvuoro_sijaisen_nimi . " " . $suunniteltuvuoro_suunniteltu_vuorotyyppi;
							$lokitapahtuma["edellinen_tieto"] = "";

							$raporttiosasto = "Tietoa ei saatavilla";
							$osasto = "Tietoa ei saatavilla";
							$tausta = "Tietoa ei saatavilla";
							$luku = "Ei";

							if (array_key_exists($suunniteltuvuoro_raportti_osasto_id, $osastotiedot)) {
								$raporttiosasto = $osastotiedot[$suunniteltuvuoro_raportti_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_osasto_id, $osastotiedot)) {
								$osasto = $osastotiedot[$suunniteltuvuoro_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_tausta_id, $taustatiedot)) {
								$tausta = $taustatiedot[$suunniteltuvuoro_tausta_id];
							}

							if ($suunniteltuvuoro_luku == 1) {
								$luku = "Kyllä";
							}

							$lokitapahtuma["tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_suunniteltu_vuorotyyppi . ", Kustannus:" . $raporttiosasto . ", Osasto:"  . $osasto . ", Tausta:" . $tausta . ", Kommentti:" . $suunniteltuvuoro_tausta_kommentti . ", Luku:" . $luku;
							array_push($lokitapahtumat, $lokitapahtuma);

							//Lähetä tekstiviesti jos sijaisella asetettu sms kiinnityksestä
							if ($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["sms"] == 1) {
								$viesti = "Sinulla on varaus " . substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $osasto . " yksikköön";
								//laheta_sms_curl($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["puhelin"], $viesti, "Rekry", 49);
							}
						}
					} else { //Päivitetään vuoro
						$suunniteltuvuoro_vuoro_vuorotyyppi = $suunniteltuvuoro_verrattavat_vuorot[$j];
						$suunniteltuvuoro_vuoro_id = $suunniteltuvuoro_vuoro_vuorotyypit[$suunniteltuvuoro_vuoro_vuorotyyppi];

						$sql = "UPDATE vuoro SET vuorotyyppi = :vuorotyyppi, raportti_osasto_id = :raportti_osasto_id, osasto_id = :osasto_id, tausta_id = :tausta_id, tausta_kommentti = :tausta_kommentti, luku = :luku WHERE id = :id";
						$values = $con->prepare($sql);
						$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
						$values->bindParam(':raportti_osasto_id', $suunniteltuvuoro_raportti_osasto_id);
						$values->bindParam(':osasto_id', $suunniteltuvuoro_osasto_id);
						$values->bindParam(':tausta_id', $suunniteltuvuoro_tausta_id);
						$values->bindParam(':tausta_kommentti', $suunniteltuvuoro_tausta_kommentti);
						$values->bindParam(':luku', $suunniteltuvuoro_luku);
						$values->bindParam(':id', $suunniteltuvuoro_vuoro_id);
						$values->execute();

						if ($values->rowCount() > 0) {
							$paivitetyt_vuorot++;
							array_push($suunniteltuvuoro_paivitetyt_vuorot, $suunniteltuvuoro_vuoro_vuorotyyppi);

							$lokitapahtuma["aikaleima"] = date("Y-m-d H:i:s");
							$lokitapahtuma["nakyma"] = "Vuorosuunnittelu";
							$lokitapahtuma["kayttaja"] = $_POST['kayttaja'];
							$lokitapahtuma["tapahtuma"] = "Vuoro päivitetty";
							$lokitapahtuma["tunniste"] = substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $suunniteltuvuoro_sijaisen_nimi . " " . $suunniteltuvuoro_suunniteltu_vuorotyyppi;

							$ed_kommentti = "Tietoa ei saatavilla";
							$ed_raporttiosasto = "Tietoa ei saatavilla";
							$ed_osasto = "Tietoa ei saatavilla";
							$ed_tausta = "Tietoa ei saatavilla";
							$ed_luku = "Tietoa ei saatavilla";

							if (array_key_exists($suunniteltuvuoro_vuoro_vuorotyyppi, $suunniteltuvuoro_vuoro_tiedot)) {
								$vuorotieto = $suunniteltuvuoro_vuoro_tiedot[$suunniteltuvuoro_vuoro_vuorotyyppi];

								if (array_key_exists($vuorotieto["raportti_osasto_id"], $osastotiedot)) {
									$ed_raporttiosasto = $osastotiedot[$vuorotieto["raportti_osasto_id"]];
								}

								if (array_key_exists($vuorotieto["osasto_id"], $osastotiedot)) {
									$ed_osasto = $osastotiedot[$vuorotieto["osasto_id"]];
								}

								if (array_key_exists($vuorotieto["tausta_id"], $taustatiedot)) {
									$ed_tausta = $taustatiedot[$vuorotieto["tausta_id"]];
								}

								$ed_kommentti = $vuorotieto["tausta_kommentti"];

								if ($vuorotieto["luku"] == 1) {
									$ed_luku = "Kyllä";
								} else if ($vuorotieto["luku"] == 0) {
									$ed_luku = "Ei";
								}
							}

							$lokitapahtuma["edellinen_tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_vuoro_vuorotyyppi . ", Kustannus:" . $ed_raporttiosasto . ", Osasto:"  . $ed_osasto . ", Tausta:" . $ed_tausta . ", Kommentti:" . $ed_kommentti . ", Luku:" . $ed_luku;

							$raporttiosasto = "Tietoa ei saatavilla";
							$osasto = "Tietoa ei saatavilla";
							$tausta = "Tietoa ei saatavilla";
							$luku = "Ei";

							if (array_key_exists($suunniteltuvuoro_raportti_osasto_id, $osastotiedot)) {
								$raporttiosasto = $osastotiedot[$suunniteltuvuoro_raportti_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_osasto_id, $osastotiedot)) {
								$osasto = $osastotiedot[$suunniteltuvuoro_osasto_id];
							}

							if (array_key_exists($suunniteltuvuoro_tausta_id, $taustatiedot)) {
								$tausta = $taustatiedot[$suunniteltuvuoro_tausta_id];
							}

							if ($suunniteltuvuoro_luku == 1) {
								$luku = "Kyllä";
							}

							$lokitapahtuma["tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_suunniteltu_vuorotyyppi . ", Kustannus:" . $raporttiosasto . ", Osasto:"  . $osasto . ", Tausta:" . $tausta . ", Kommentti:" . $suunniteltuvuoro_tausta_kommentti . ", Luku:" . $luku;
							array_push($lokitapahtumat, $lokitapahtuma);

							//Lähetä tekstiviesti jos sijaisella asetettu sms kiinnityksestä
							if ($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["sms"] == 1) {
								$viesti = "Sinulla on varaus " . substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $osasto . " yksikköön";
								//laheta_sms_curl($sijaisten_puhelin_tiedot[$suunniteltuvuoro_sijainen_id]["puhelin"], $viesti, "Rekry", 49);
							}
						}

						/*
						//Uusi vuoro on lukittu vuoro, päivitetään myös kiinnitykset
						if($suunniteltuvuoro_luku == 1) {
							$sql = "UPDATE vuoro SET vuorotyyppi = :vuorotyyppi, raportti_osasto_id = :raportti_osasto_id, osasto_id = :osasto_id, tausta_id = 0, tausta_kommentti = '', luku = :luku WHERE id = :id";
							$values = $con->prepare($sql);
							$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
							$values->bindParam(':raportti_osasto_id', $suunniteltuvuoro_raportti_osasto_id);
							$values->bindParam(':osasto_id', $suunniteltuvuoro_osasto_id);
							$values->bindParam(':luku', $suunniteltuvuoro_luku);
							$values->bindParam(':id', $suunniteltuvuoro_vuoro_id);
							$values->execute();
						}
						else { //Uusi vuoro ei ole lukittu, päivitetään vain vuorotyyppi ja luku tila
							$sql = "UPDATE vuoro SET vuorotyyppi = :vuorotyyppi, luku = :luku WHERE id = :id";
							$values = $con->prepare($sql);
							$values->bindParam(':vuorotyyppi', $suunniteltuvuoro_suunniteltu_vuorotyyppi);
							$values->bindParam(':luku', $suunniteltuvuoro_luku);
							$values->bindParam(':id', $suunniteltuvuoro_vuoro_id);
							$values->execute();
						}
						*/
					}
				}
			}

			//Verrataan verrattavia vuoroja päivitettäviin vuoroihin
			$suunniteltuvuoro_poistettavat_vuorot = array_values(array_diff($suunniteltuvuoro_verrattavat_vuorot, $suunniteltuvuoro_paivitetyt_vuorot));

			//Tarkistetaan onko poistetettavia vuoroja
			if (count($suunniteltuvuoro_poistettavat_vuorot) > 0) {
				//Tarkistetaan onko ylimääräisiä vuoroja ja poistetaan ne
				for ($j = 0; $j < count($suunniteltuvuoro_poistettavat_vuorot); $j++) {
					$suunniteltuvuoro_vuoro_vuorotyyppi = $suunniteltuvuoro_poistettavat_vuorot[$j];
					$suunniteltuvuoro_vuoro_id = $suunniteltuvuoro_vuoro_vuorotyypit[$suunniteltuvuoro_vuoro_vuorotyyppi];
					//Poistetaan ylimääräinen vuoro
					$sql = "DELETE FROM vuoro WHERE id = :id";
					$values = $con->prepare($sql);
					$values->bindParam(':id', $suunniteltuvuoro_vuoro_id);
					$values->execute();
					if ($values->rowCount() > 0) {
						$poistetut_vuorot++;

						$lokitapahtuma["aikaleima"] = date("Y-m-d H:i:s");
						$lokitapahtuma["nakyma"] = "Vuorosuunnittelu";
						$lokitapahtuma["kayttaja"] = $_POST['kayttaja'];
						$lokitapahtuma["tapahtuma"] = "Vuoro poistettu";
						$lokitapahtuma["tunniste"] = substr($suunniteltuvuoro_pvm, 8, 2) . "." . substr($suunniteltuvuoro_pvm, 5, 2) . "." . substr($suunniteltuvuoro_pvm, 0, 4) . " " . $suunniteltuvuoro_sijaisen_nimi . " " . $suunniteltuvuoro_vuoro_vuorotyyppi;

						$ed_kommentti = "Tietoa ei saatavilla";
						$ed_raporttiosasto = "Tietoa ei saatavilla";
						$ed_osasto = "Tietoa ei saatavilla";
						$ed_tausta = "Tietoa ei saatavilla";
						$ed_luku = "Tietoa ei saatavilla";

						if (array_key_exists($suunniteltuvuoro_vuoro_vuorotyyppi, $suunniteltuvuoro_vuoro_tiedot)) {
							$vuorotieto = $suunniteltuvuoro_vuoro_tiedot[$suunniteltuvuoro_vuoro_vuorotyyppi];

							if (array_key_exists($vuorotieto["raportti_osasto_id"], $osastotiedot)) {
								$ed_raporttiosasto = $osastotiedot[$vuorotieto["raportti_osasto_id"]];
							}

							if (array_key_exists($vuorotieto["osasto_id"], $osastotiedot)) {
								$ed_osasto = $osastotiedot[$vuorotieto["osasto_id"]];
							}

							if (array_key_exists($vuorotieto["tausta_id"], $taustatiedot)) {
								$ed_tausta = $taustatiedot[$vuorotieto["tausta_id"]];
							}

							$ed_kommentti = $vuorotieto["tausta_kommentti"];

							if ($vuorotieto["luku"] == 1) {
								$ed_luku = "Kyllä";
							} else if ($vuorotieto["luku"] == 0) {
								$ed_luku = "Ei";
							}
						}

						$lokitapahtuma["edellinen_tieto"] = "Vuorotyyppi:" . $suunniteltuvuoro_vuoro_vuorotyyppi . ", Kustannus:" . $ed_raporttiosasto . ", Osasto:"  . $ed_osasto . ", Tausta:" . $ed_tausta . ", Kommentti:" . $ed_kommentti . ", Luku:" . $ed_luku;
						$lokitapahtuma["tieto"] = "";
						array_push($lokitapahtumat, $lokitapahtuma);
					}
				}
			}
		}

		//Päivitetään näkyvyys
		$sql = "UPDATE vuoro SET nakyvyys = :nakyvyys WHERE suunniteltuvuoro_id IN(SELECT id FROM suunniteltuvuoro WHERE DATE(alkupvm) >= DATE(:alkupvm) AND DATE(alkupvm) <= DATE(:loppupvm) AND sijainen_id IN(" . $sijainen_idt . "))";
		$values = $con->prepare($sql);
		$values->bindParam(':nakyvyys', $_POST['nakyvyys']);
		$values->bindParam(':alkupvm', $alkupvm);
		$values->bindParam(':loppupvm', $loppupvm);
		$values->execute();

		//Päivitetään julkaistut suunnitellut vuorot, asetetaan muokattu = 0
		$sql = "UPDATE suunniteltuvuoro SET muokattu = 0 WHERE id IN('" . implode("','", $suunnittelu_vuoro_idt) . "')";
		$values = $con->prepare($sql);
		$values->execute();

		//Poistetaan julkaistujen vuorojen suunnitellut kiinnitykset
		$sql = "DELETE FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id IN('" . implode("','", $suunnittelu_vuoro_idt) . "')";
		$values = $con->prepare($sql);
		$values->execute();

		//Kirjataan lokiin tapahtumat
		for ($i = 0; $i < count($lokitapahtumat); $i++) {
			$aikaleima = $lokitapahtumat[$i]['aikaleima'];
			$kayttaja = $lokitapahtumat[$i]['kayttaja'];
			$nakyma = $lokitapahtumat[$i]['nakyma'];
			$tapahtuma = $lokitapahtumat[$i]['tapahtuma'];
			$tunniste = $lokitapahtumat[$i]['tunniste'];
			$edellinen_tieto = $lokitapahtumat[$i]['edellinen_tieto'];
			$tieto = $lokitapahtumat[$i]['tieto'];

			$sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, :aikaleima, :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
			$values = $con->prepare($sql);
			$values->bindParam(':aikaleima', $aikaleima);
			$values->bindParam(':kayttaja', $kayttaja);
			$values->bindParam(':nakyma', $nakyma);
			$values->bindParam(':tapahtuma', $tapahtuma);
			$values->bindParam(':tunniste', $tunniste);
			$values->bindParam(':edellinen_tieto', $edellinen_tieto);
			$values->bindParam(':tieto', $tieto);
			$values->execute();
		}

		//Palautetaan lukumäärät
		$lukumaarat['poistetut'] = $poistetut_vuorot;
		$lukumaarat['paivitetyt'] = $paivitetyt_vuorot;
		$lukumaarat['luodut'] = $luodut_vuorot;
		$lukumaarat['yhteensa'] = $poistetut_vuorot + $paivitetyt_vuorot + $luodut_vuorot;
		$lukumaarat['kiinnitykset'] = $paivitetyt_kiinnitykset;
		$lukumaarat['haamuvuorot'] = $poistetut_haamuvuorot;
		array_push($return_arr, $lukumaarat);

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
