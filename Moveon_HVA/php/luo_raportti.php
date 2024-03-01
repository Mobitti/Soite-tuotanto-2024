<?php
include_once '../config/config.php';
require '../fpdf/fpdf.php';

if (
	isset($_POST['raporttityyppi'])
	&& isset($_POST['alkupvm'])
	&& isset($_POST['loppupvm'])
	&& isset($_POST['toimialue_idt'])
	&& isset($_POST['palvelualue_idt'])
	&& isset($_POST['henkilo_idt'])
	&& isset($_POST['tausta_idt'])
	&& isset($_POST['osasto_idt'])
	&& isset($_POST['henkilosto'])
	&& isset($_POST['tyhjat'])
) {
	try {
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$alkupvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
		$loppupvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
		$toimialue_idt = $_POST['toimialue_idt'];
		$palvelualue_idt = $_POST['palvelualue_idt'];
		$henkilo_idt = $_POST['henkilo_idt'];
		$tausta_idt = $_POST['tausta_idt'];
		$osastojen_idt = $_POST['osasto_idt'];
		$hoitajat = false;
		$sihteerit = false;
		$sissi_perehdytys_tausta_id = "";

		if ($_POST['henkilosto'] == 0) {
			$hoitajat = true;
		} else if ($_POST['henkilosto'] == 1) {
			$sihteerit = true;
		}

		if ($_POST['raporttityyppi'] == 0) { //Taloudellinen raportti - Sijaiset
			//Hae kaikki osasto id:t
			$osasto_raportti_idt = "";
			$osastovalintaWhere = "";

			$sql = "SELECT id FROM osasto WHERE id IN(" . $osastojen_idt . ") ORDER BY toimialue_id, raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_raportti_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($osasto_raportti_idt) > 0) {
				$osasto_raportti_idt = substr($osasto_raportti_idt, 1);
			}

			$osastovalintaWhere = " AND raportti_osasto_id IN(" . $osasto_raportti_idt . ")";

			/***************** Sijaisuustaustojen mukaan ***************************/
			$sijaisuustausta_idt = explode(',', str_replace('\'', '', $_POST['tausta_idt']));
			$sijaisuustausta_tiedot = array();
			$sijaisuustausta_hoitajat_yhteensa = 0;
			$sijaisuustausta_sihteerit_yhteensa = 0;
			$sijaisuustausta_henkilosto_yhteensa = 0;

			for ($i = 0; $i < count($sijaisuustausta_idt); $i++) {
				$sijaisuustausta_rivi = array();

				//Sijaisuustaustan tiedot
				$sql = "SELECT selite, numero FROM tausta WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $sijaisuustausta_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				if ($row != null) {
					$sijaisuustausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];
					if ($row['numero'] == 10) {
						$sissi_perehdytys_tausta_id = $sijaisuustausta_idt[$i];
					}
				} else {
					$sijaisuustausta_rivi['selite'] = "0000-0004, /, *, 5, K";
				}

				if ($hoitajat) {
					//Kaikki hoitajat
					$sql = "SELECT COUNT(id) AS h_maara FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ")" . $osastovalintaWhere . " AND tausta_id = :tausta_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':tausta_id', $sijaisuustausta_idt[$i]);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					$sijaisuustausta_rivi['hoitajat'] = $row['h_maara'];
					$sijaisuustausta_hoitajat_yhteensa += $sijaisuustausta_rivi['hoitajat'];
				}

				if ($sihteerit) {
					//Kaikki sihteerit
					$sql = "SELECT COUNT(id) AS s_maara FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ")" . $osastovalintaWhere . " AND tausta_id = :tausta_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':tausta_id', $sijaisuustausta_idt[$i]);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					$sijaisuustausta_rivi['sihteerit'] = $row['s_maara'];
					$sijaisuustausta_sihteerit_yhteensa += $sijaisuustausta_rivi['sihteerit'];
				}

				array_push($sijaisuustausta_tiedot, $sijaisuustausta_rivi);
			}

			/***************** Osastojen mukaan ***************/
			//Hae sihteerihinta
			$sihteerihinta = 0;
			$sql = "SELECT hinta FROM kustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm AND osasto_id IN (SELECT id FROM osasto WHERE lyhenne LIKE '%Sihteeri%' OR nimi LIKE '%Sihteeri%') LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sihteerihinta = $row['hinta'];
			}

			$osasto_idt = explode(',', str_replace('\'', '', $_POST['osasto_idt']));
			$osasto_tiedot = array();
			$osasto_hoitajat_yhteensa = 0;
			$osasto_sihteerit_yhteensa = 0;
			$osasto_hoitaja_kustannukset_yhteensa = 0;
			$osasto_sihteeri_kustannukset_yhteensa = 0;
			$hoitaja_sissi_perehdytys_yhteensa = 0;
			$sihteeri_sissi_perehdytys_yhteensa = 0;
			$hoitaja_sissi_perehdytys_kustannukset_yhteensa = 0;
			$sihteeri_sissi_perehdytys_kustannukset_yhteensa = 0;

			for ($i = 0; $i < count($osasto_idt); $i++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, lyhenne, toimialue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $osasto_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['raporttinumero'] = $row['raporttinumero'];
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];

				if ($hoitajat) {
					//Kaikki hoitajat kustannuksineen
					$h_maara = 0;
					$h_kustannukset = 0;
					$h_sissi_perehdytys_maara = 0;
					$h_sissi_perehdytys_kustannukset = 0;

					$sql = "SELECT tausta_id, (SELECT hinta FROM kustannus WHERE osasto_id = :raportti_osasto_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS hinta, (SELECT raporttinumero FROM osasto WHERE id = :raportti_osasto_id) AS raporttinumero FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") AND raportti_osasto_id = :raportti_osasto_id AND tausta_id IN(" . $tausta_idt . ")"; // (SELECT hinta FROM henkilokustannus WHERE henkilokustannus.sijainen_id = vuoro.sijainen_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS henkilo_hinta,
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':raportti_osasto_id', $osasto_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($row['raporttinumero'] > 4) {
							/*
							if($row['henkilo_hinta'] != null || $row['henkilo_hinta'] != "") {
								if($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
									$h_kustannukset += $row['henkilo_hinta'];
								}
								else {
									$h_sissi_perehdytys_kustannukset += $row['henkilo_hinta'];
								}
							}
							else
							*/

							if ($row['hinta'] != null || $row['hinta'] != "") {
								if ($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
									$h_kustannukset += $row['hinta'];
								} else {
									$h_sissi_perehdytys_kustannukset += $row['hinta'];
								}
							}
						}

						if ($row['hinta'] != null || $row['hinta'] != "") {
							$h_sissi_perehdytys_maara++;
						}

						$h_maara++;
					}
					$osasto_rivi['hoitajat'] = $h_maara;
					$osasto_hoitajat_yhteensa += $osasto_rivi['hoitajat'];
					$osasto_rivi['h_kustannukset'] = $h_kustannukset;
					$osasto_hoitaja_kustannukset_yhteensa += $osasto_rivi['h_kustannukset'];
					$hoitaja_sissi_perehdytys_yhteensa += $h_sissi_perehdytys_maara;
					$hoitaja_sissi_perehdytys_kustannukset_yhteensa += $h_sissi_perehdytys_kustannukset;
				}

				if ($sihteerit) {
					//Kaikki sihteerit kustannuksineen
					$s_maara = 0;
					$s_kustannukset = 0;
					$s_sissi_perehdytys_maara = 0;
					$s_sissi_perehdytys_kustannukset = 0;

					$sql = "SELECT tausta_id, (SELECT raporttinumero FROM osasto WHERE id = :raportti_osasto_id) AS raporttinumero FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") AND raportti_osasto_id = :raportti_osasto_id AND tausta_id IN(" . $tausta_idt . ")"; // (SELECT hinta FROM henkilokustannus WHERE henkilokustannus.sijainen_id = vuoro.sijainen_id AND alku_pvm <= pvm AND loppu_pvm >= pvm) AS henkilo_hinta,
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':raportti_osasto_id', $osasto_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($row['raporttinumero'] > 4) {
							/*
							if($row['henkilo_hinta'] != null || $row['henkilo_hinta'] != "") {
								if($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
									$s_kustannukset += $row['henkilo_hinta'];
								}
								else {
									$s_sissi_perehdytys_kustannukset += $row['henkilo_hinta'];
								}
							}
							else
							*/
							if ($sihteerihinta != null || $sihteerihinta != "") {
								if ($row['tausta_id'] != $sissi_perehdytys_tausta_id) {
									$s_kustannukset += $sihteerihinta;
								} else {
									$s_sissi_perehdytys_kustannukset += $sihteerihinta;
								}
							}
						}

						if ($sihteerihinta != null || $sihteerihinta != "") {
							$s_sissi_perehdytys_maara++;
						}

						$s_maara++;
					}
					$osasto_rivi['sihteerit'] = $s_maara;
					$osasto_sihteerit_yhteensa += $osasto_rivi['sihteerit'];
					$osasto_rivi['s_kustannukset'] = $s_kustannukset;
					$osasto_sihteeri_kustannukset_yhteensa += $osasto_rivi['s_kustannukset'];
					$sihteeri_sissi_perehdytys_yhteensa += $s_sissi_perehdytys_maara;
					$sihteeri_sissi_perehdytys_kustannukset_yhteensa += $s_sissi_perehdytys_kustannukset;
				}

				array_push($osasto_tiedot, $osasto_rivi);
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['toimialue_id'] == $row['id']) {
						$toimialue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($toimialue_osastot) > 0) {
					$toimialue_osastot = substr($toimialue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $toimialue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);

				$varitiedot[$row['id']] = $row['vari_hex'];
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Taloudellinen raportti - Sijaiset"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			if ($hoitajat) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien työvuorot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');
			} else if ($sihteerit) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien työvuorot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');
			}

			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$rivimaara = count($sijaisuustausta_tiedot) + 2;
			$rivikorkeus = 10;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
			}

			/**************** Sijaisuustaustoittain ******************/
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sijaisuustausta"), 1, 0, 'C');
			if ($hoitajat) {
				$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajat"), 1, 0, 'C');
				$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');
			} else {
				$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerit"), 1, 0, 'C');
				$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');
			}

			$sijaisuustausta_hoitaja_prosentti_yhteensa = 0;
			$sijaisuustausta_sihteeri_prosentti_yhteensa = 0;

			for ($i = 0; $i < count($sijaisuustausta_tiedot); $i++) {
				$sijaisuustausta_selite = $sijaisuustausta_tiedot[$i]['selite'];

				if ($hoitajat) {
					$sijaisuustausta_hoitajat = $sijaisuustausta_tiedot[$i]['hoitajat'];
					$sijaisuustausta_hoitaja_prosentti = 0;

					if ($sijaisuustausta_hoitajat_yhteensa > 0) {
						$sijaisuustausta_hoitaja_prosentti = round((($sijaisuustausta_hoitajat / $sijaisuustausta_hoitajat_yhteensa) * 100), 1);
						$sijaisuustausta_hoitaja_prosentti_yhteensa += (($sijaisuustausta_hoitajat / $sijaisuustausta_hoitajat_yhteensa) * 100);
					}
				}

				if ($sihteerit) {
					$sijaisuustausta_sihteerit = $sijaisuustausta_tiedot[$i]['sihteerit'];
					$sijaisuustausta_sihteeri_prosentti = 0;

					if ($sijaisuustausta_sihteerit_yhteensa > 0) {
						$sijaisuustausta_sihteeri_prosentti = round((($sijaisuustausta_sihteerit / $sijaisuustausta_sihteerit_yhteensa) * 100), 1);
						$sijaisuustausta_sihteeri_prosentti_yhteensa += (($sijaisuustausta_sihteerit / $sijaisuustausta_sihteerit_yhteensa) * 100);
					}
				}

				if ($_POST['tyhjat'] == 1 || ($hoitajat == true && $_POST['tyhjat'] == 0 && $sijaisuustausta_hoitajat > 0) || ($sihteerit == true && $_POST['tyhjat'] == 0 && $sijaisuustausta_sihteerit > 0)) {
					if (strlen($sijaisuustausta_selite) > '40') {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($sijaisuustausta_selite, 0, 40) . "."), 1, 0);
					} else {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_selite), 1, 0);
					}

					if ($hoitajat) {
						$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_hoitajat), 1, 0, 'C');
						$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_hoitaja_prosentti) . '%', 1, 1, 'C');
					} else if ($sihteerit) {
						$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_sihteerit), 1, 0, 'C');
						$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_sihteeri_prosentti) . '%', 1, 1, 'C');
					}
				}
			}

			$sijaisuustausta_hoitaja_prosentti_yhteensa = round($sijaisuustausta_hoitaja_prosentti_yhteensa, 0);
			$sijaisuustausta_sihteeri_prosentti_yhteensa = round($sijaisuustausta_sihteeri_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', $kirjainkoko);
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			if ($hoitajat) {
				$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_hoitajat_yhteensa), 1, 0, 'C');
				$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_hoitaja_prosentti_yhteensa) . '%', 1, 1, 'C');
			} else if ($sihteerit) {
				$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_sihteerit_yhteensa), 1, 0, 'C');
				$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_sihteeri_prosentti_yhteensa) . '%', 1, 1, 'C');
			}

			$pdf->SetFont('Helvetica', '', '10');
			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Osastot"), 1, 0, 'C');

			if ($hoitajat) {
				$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajat"), 1, 0, 'C');
				$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 0, 'C');
			}

			if ($sihteerit) {
				$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerit"), 1, 0, 'C');
				$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 0, 'C');
			}
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kustannus ") . chr(128), 1, 1, 'C'); //char 128 = €


			$osasto_hoitaja_prosentti_yhteensa = 0;
			$osasto_sihteeri_prosentti_yhteensa = 0;
			$osasto_kustannus_yhteensa = 0;

			for ($i = 0; $i < count($osasto_tiedot); $i++) {
				$osasto_selite = $osasto_tiedot[$i]['selite'];
				$osasto_toimialue = $osasto_tiedot[$i]['toimialue_id'];

				if ($hoitajat) {
					$osasto_hoitajat = $osasto_tiedot[$i]['hoitajat'];
					$osasto_hoitaja_prosentti = 0;
					$osasto_kustannus_rivi_yhteensa = 0;

					if ($osasto_hoitajat_yhteensa > 0) {
						$osasto_hoitaja_prosentti = round((($osasto_hoitajat / $osasto_hoitajat_yhteensa) * 100), 1);
						$osasto_hoitaja_prosentti_yhteensa += (($osasto_hoitajat / $osasto_hoitajat_yhteensa) * 100);
					}

					if (array_key_exists('h_kustannukset', $osasto_tiedot[$i])) {
						$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['h_kustannukset'];
					}
					//if($osasto_tiedot[$i]['h_kustannukset'] > 0 && $hoitaja_sissi_perehdytys_yhteensa > 0) , 27.2.2022 muutettu
					if ($hoitaja_sissi_perehdytys_yhteensa > 0) {
						$osasto_kustannus_rivi_yhteensa += ($osasto_hoitajat / $hoitaja_sissi_perehdytys_yhteensa) * $hoitaja_sissi_perehdytys_kustannukset_yhteensa;
					}
				}

				if ($sihteerit) {
					$osasto_sihteerit = $osasto_tiedot[$i]['sihteerit'];
					$osasto_sihteeri_prosentti = 0;
					$osasto_kustannus_rivi_yhteensa = 0;

					if ($osasto_sihteerit_yhteensa > 0) {
						$osasto_sihteeri_prosentti = round((($osasto_sihteerit / $osasto_sihteerit_yhteensa) * 100), 1);
						$osasto_sihteeri_prosentti_yhteensa += (($osasto_sihteerit / $osasto_sihteerit_yhteensa) * 100);
					}

					if (array_key_exists('s_kustannukset', $osasto_tiedot[$i])) {
						$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['s_kustannukset'];
					}
					//if($osasto_tiedot[$i]['s_kustannukset'] > 0 && $sihteeri_sissi_perehdytys_yhteensa > 0) 27.2.2022
					if ($sihteeri_sissi_perehdytys_yhteensa > 0) {
						$osasto_kustannus_rivi_yhteensa += ($osasto_sihteerit / $sihteeri_sissi_perehdytys_yhteensa) * $sihteeri_sissi_perehdytys_kustannukset_yhteensa;
					}
				}

				$osasto_kustannus_yhteensa += $osasto_kustannus_rivi_yhteensa;

				if ($_POST['tyhjat'] == 1 || ($hoitajat == true && $_POST['tyhjat'] == 0 && $osasto_hoitajat > 0) || ($sihteerit == true && $_POST['tyhjat'] == 0 && $osasto_sihteerit > 0)) {
					if (array_key_exists($osasto_toimialue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_toimialue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);

						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L', true);
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
						}
					} else {
						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L');
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
						}
					}

					if ($hoitajat) {
						$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitajat), 1, 0, 'C');
						$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_prosentti) . '%', 1, 0, 'C');
					}

					if ($sihteerit) {
						$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteerit), 1, 0, 'C');
						$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_prosentti) . '%', 1, 0, 'C');
					}

					$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_rivi_yhteensa, 2, '.', '')), 1, 1, 'C');
				}
			}

			$osasto_hoitaja_prosentti_yhteensa = round($osasto_hoitaja_prosentti_yhteensa, 0);
			$osasto_sihteeri_prosentti_yhteensa = round($osasto_sihteeri_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', '10');
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);

			if ($hoitajat) {
				$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitajat_yhteensa), 1, 0, 'C');
				$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_prosentti_yhteensa) . '%', 1, 0, 'C');
			}

			if ($sihteerit) {
				$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteerit_yhteensa), 1, 0, 'C');
				$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_prosentti_yhteensa) . '%', 1, 0, 'C');
			}

			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_yhteensa, 2, '.', '')), 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			if ($hoitajat) {
				$tiedostonimi = "Taloudellinen raportti - Sijaishoitajat.pdf";
			} else if ($sihteerit) {
				$tiedostonimi = "Taloudellinen raportti - Sijaissihteerit.pdf";
			}

			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 1) { //Sijaisyy raportti - Sijaiset
			//Sijaisuustaustan tiedot
			$sijaisuustausta_tiedot = array();
			$sql = "SELECT id, selite, numero FROM tausta ORDER BY numero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijaisuustausta_rivi['id'] = $row['id'];
				$sijaisuustausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];

				array_push($sijaisuustausta_tiedot, $sijaisuustausta_rivi);
			}

			$sijaisuustausta_rivi['id'] = "0";
			$sijaisuustausta_rivi['selite'] = "0000-0004, /, *, 5, K";
			array_unshift($sijaisuustausta_tiedot, $sijaisuustausta_rivi);

			//Sijaissyyt
			$sijaissyy_tietorivit = array();
			$alku_kuukausi = intval(substr($_POST['alkupvm'], 3, 2));
			$alku_vuosi = intval(substr($_POST['alkupvm'], 6, 4));
			$loppu_kuukausi = intval(substr($_POST['loppupvm'], 3, 2));
			$loppu_vuosi = intval(substr($_POST['loppupvm'], 6, 4));
			$kasiteltava_kuukausi = $alku_kuukausi;
			$kasiteltava_vuosi = $alku_vuosi;
			$kasiteltava_alku_pvm = "";
			$kasiteltava_loppu_pvm = "";
			$kasiteltava_kuukausi_arvo = "";
			$valmis = false;

			while (!$valmis) {
				$kasiteltava_kuukausi_arvo = $kasiteltava_kuukausi;
				if ($kasiteltava_kuukausi_arvo <= 9) {
					$kasiteltava_kuukausi_arvo = "0" . $kasiteltava_kuukausi_arvo;
				}

				$kasiteltava_alku_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-01";
				$kasiteltava_pvm = new DateTime($kasiteltava_alku_pvm);
				$kasiteltava_loppu_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-" . $kasiteltava_pvm->format("t");
				$loytyi = false;

				$sql = "SELECT tausta_id FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") 
						AND raportti_osasto_id IN (" . $osastojen_idt . ") ORDER BY (SELECT numero FROM tausta WHERE id = tausta_id) ASC, pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $kasiteltava_alku_pvm);
				$values->bindParam(':loppupvm', $kasiteltava_loppu_pvm);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$loytyi = true;
					$sijaissyy_rivi['tausta_id'] = $row['tausta_id'];
					$sijaissyy_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$sijaissyy_rivi['vuosi'] = $kasiteltava_vuosi;

					array_push($sijaissyy_tietorivit, $sijaissyy_rivi);
				}

				if (!$loytyi) {
					$sijaissyy_rivi['tausta_id'] = -1;
					$sijaissyy_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$sijaissyy_rivi['vuosi'] = $kasiteltava_vuosi;

					array_push($sijaissyy_tietorivit, $sijaissyy_rivi);
				}

				if ($kasiteltava_kuukausi == $loppu_kuukausi && $kasiteltava_vuosi == $loppu_vuosi) {
					$valmis = true;
				}

				$kasiteltava_kuukausi++;

				if ($kasiteltava_kuukausi > 12) {
					$kasiteltava_kuukausi = 1;
					$kasiteltava_vuosi++;
				}
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$osasto_tiedot = array();

			//Osastojen nimet
			$sql = "SELECT lyhenne, toimialue_id FROM osasto WHERE id IN (" . $osastojen_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];
				array_push($osasto_tiedot, $osasto_rivi);
			}

			$sql = "SELECT id, nimi FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['toimialue_id'] == $row['id']) {
						$toimialue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($toimialue_osastot) > 0) {
					$toimialue_osastot = substr($toimialue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $toimialue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//Arvot
			$sijaissyy_tiedot = array();
			for ($i = 0; $i < count($sijaissyy_tietorivit); $i++) {
				$vuosi_kuukausi = $sijaissyy_tietorivit[$i]['vuosi'] . "-" . $sijaissyy_tietorivit[$i]['kuukausi'];
				$sijaisuustausta_id = $sijaissyy_tietorivit[$i]['tausta_id'];

				if (!array_key_exists($vuosi_kuukausi, $sijaissyy_tiedot)) {
					$sijaissyy_tiedot[$vuosi_kuukausi]['maara'] = 0;
					$sijaissyy_tiedot[$vuosi_kuukausi]['maara']++;
				} else {
					$sijaissyy_tiedot[$vuosi_kuukausi]['maara']++;
				}

				if (!array_key_exists($sijaisuustausta_id, $sijaissyy_tiedot[$vuosi_kuukausi])) {
					$sijaissyy_tiedot[$vuosi_kuukausi][$sijaisuustausta_id] = 0;
					$sijaissyy_tiedot[$vuosi_kuukausi][$sijaisuustausta_id]++;
				} else {
					$sijaissyy_tiedot[$vuosi_kuukausi][$sijaisuustausta_id]++;
				}
			}

			/*************** Sijaissyyraportti **************/
			$alku = substr($alkupvm, 8, 2) . "." . substr($alkupvm, 5, 2) . "." . substr($alkupvm, 0, 4);
			$loppu = substr($loppupvm, 8, 2) . "." . substr($loppupvm, 5, 2) . "." . substr($loppupvm, 0, 4);

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sijaissyy raportti"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			if ($hoitajat) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien vuorotaustat ajalta " . $alku . " - " . $loppu), 0, 'L');
			} else if ($sihteerit) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien vuorotaustat ajalta " . $alku . " - " . $loppu), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$otsikkoX = $pdf->GetX();
			$rivimaara = count($sijaisuustausta_tiedot) + 2;
			$rivikorkeus = 8;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
				$otsikkoY = $pdf->GetY();
				$otsikkoX = $pdf->GetX();
			}

			$pdf->SetFont('Helvetica', '', '8');
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sijaisuustausta"), 1, 2, 'L');
			for ($i = 0; $i < count($sijaisuustausta_tiedot); $i++) {
				$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_tiedot[$i]['selite']), 1, 2, 'L'); //265, 95 + 17*10 = 265
			}
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
			$pdf->SetY($otsikkoY);
			$pdf->SetX($otsikkoX + 55);
			$x_rivimaara = 0;
			$edellinen_vuosi = '';
			foreach ($sijaissyy_tiedot as $vuosi_kuukausi => $tiedot) {
				if ($x_rivimaara == 7) {
					$pdf->AddPage();
					$pdf->SetY($pdf->GetY() + 10);
					$otsikkoY = $pdf->GetY();
					$otsikkoX = $pdf->GetX();
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sijaisuustausta"), 1, 2, 'L');

					for ($i = 0; $i < count($sijaisuustausta_tiedot); $i++) {
						$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_tiedot[$i]['selite']), 1, 2, 'L');
					}
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
					$pdf->SetY($otsikkoY);
					$pdf->SetX($otsikkoX + 55);
					$x_rivimaara = 0;
				}

				$otsikkoX = $pdf->GetX() + 20;
				$vuosi_kuukausi_tiedot = explode('-', $vuosi_kuukausi);
				$vuosi = $vuosi_kuukausi_tiedot[0];
				$kuukausi = $vuosi_kuukausi_tiedot[1];

				if ($edellinen_vuosi != $vuosi) {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi . " (" . $vuosi . ")"), 1, 2, 'C');
					$edellinen_vuosi = $vuosi;
				} else {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi), 1, 2, 'C');
				}
				$vuosi_kuukausi_prosentti = 0;

				for ($i = 0; $i < count($sijaisuustausta_tiedot); $i++) {
					$sijaisuustausta_id = $sijaisuustausta_tiedot[$i]['id'];
					$sijaisuustausta_yhteensa = 0;
					$vuosi_kuukausi_yhteensa = 0;

					if (array_key_exists($sijaisuustausta_id, $tiedot)) {
						$sijaisuustausta_yhteensa = $tiedot[$sijaisuustausta_id];
					}
					if (array_key_exists($vuosi_kuukausi, $sijaissyy_tiedot)) {
						$vuosi_kuukausi_yhteensa = $sijaissyy_tiedot[$vuosi_kuukausi]['maara'];
					}

					$sijaisuustausta_prosentti = 0;

					if ($vuosi_kuukausi_yhteensa > 0) {
						$sijaisuustausta_prosentti = round((($sijaisuustausta_yhteensa / $vuosi_kuukausi_yhteensa) * 100), 1);
						$vuosi_kuukausi_prosentti += $sijaisuustausta_prosentti;
					}

					if (array_key_exists($sijaisuustausta_id, $tiedot)) {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisuustausta_prosentti . "%"), 1, 2, 'C'); //lkm $tiedot[$sijaisuustausta_id]
					} else {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "0%"), 1, 2, 'C');
					}
				}

				$vuosi_kuukausi_prosentti = round($vuosi_kuukausi_prosentti, 0);
				$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $vuosi_kuukausi_prosentti . "%"), 1, 2, 'C'); //lkm $sijaissyy_tiedot[$vuosi_kuukausi]['maara']
				$pdf->SetY($otsikkoY);
				$pdf->SetX($otsikkoX);
				$x_rivimaara++;
			}

			/*************** PDF Tallenus tiedostoksi ******************/
			if ($hoitajat) {
				$tiedostonimi = "Sijaissyy raportti - Sijaishoitajat.pdf";
			} else if ($sihteerit) {
				$tiedostonimi = "Sijaissyy raportti - Sijaissihteerit.pdf";
			}
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 2) { //Kotiosastoraportti - Sijaiset
			$nakyma_tiedot = array();
			$raportti_osasto_idt = array();
			$osasto_idt = "";
			$osasto_tiedot = array();
			$kotiosasto_id = "";

			//Hae kotiosasto sijaisuustausta
			$sql = "SELECT id FROM tausta WHERE selite LIKE '%Kotiosasto%' OR selite LIKE '%kotiosasto%'";
			$values = $con->prepare($sql);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if ($row != null) {
				$kotiosasto_id = $row['id'];
			} else {
				$con = null;
				$values = null;
				echo "Virhe: Kotiosasto_id ei voitu hakea";
				return;
			}

			//Osasto id haku
			$sql = "SELECT id FROM osasto WHERE toimialue_id IN(" . $toimialue_idt . ") ORDER BY toimialue_id, raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_idt .= ",'" . $row['id'] . "'";
				array_push($raportti_osasto_idt, $row['id']);
			}

			if (strlen($osasto_idt) > 0) {
				$osasto_idt = substr($osasto_idt, 1);
			}

			$sql = "SELECT pvm, (SELECT nimi FROM sijainen WHERE id = sijainen_id) AS nimi, (SELECT lyhenne FROM osasto WHERE id = raportti_osasto_id) AS osasto FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") AND raportti_osasto_id IN (" . $osasto_idt . ") AND tausta_id = :tausta_id ORDER BY pvm ASC, nimi";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->bindParam(':tausta_id', $kotiosasto_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$henkilosto_tiedot = array();

				$henkilosto_tiedot['pvm'] = $row['pvm'];
				$henkilosto_tiedot['nimi'] = $row['nimi'];
				$henkilosto_tiedot['osasto'] = $row['osasto'];

				array_push($nakyma_tiedot, $henkilosto_tiedot);
			}

			$kotiosasto_vuorot_yhteensa = 0;
			$osasto_vuorot_yhteensa = 0;

			//Osasto tiedot
			for ($j = 0; $j < count($raportti_osasto_idt); $j++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, toimialue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $raportti_osasto_idt[$j]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];

				//Kaikki kotiosasto vuorot
				$sql = "SELECT COUNT(id) AS kotiosasto_vuoro_maara FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") AND raportti_osasto_id = :raportti_osasto_id AND tausta_id = :tausta_id";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $raportti_osasto_idt[$j]);
				$values->bindParam(':tausta_id', $kotiosasto_id);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['kotiosastovuorot'] = $row['kotiosasto_vuoro_maara'];
				$kotiosasto_vuorot_yhteensa += $osasto_rivi['kotiosastovuorot'];

				//Kaikki osasto vuorot
				$sql = "SELECT COUNT(id) AS vuoro_maara FROM vuoro WHERE pvm >= :alkupvm AND pvm <= :loppupvm AND sijainen_id IN(" . $henkilo_idt . ") AND raportti_osasto_id = :raportti_osasto_id";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':raportti_osasto_id', $raportti_osasto_idt[$j]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['vuorot'] = $row['vuoro_maara'];
				$osasto_vuorot_yhteensa += $osasto_rivi['vuorot'];

				array_push($osasto_tiedot, $osasto_rivi);
			}

			//Hae toimialueiden nimet
			$toimialue_nimet = "";
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$varitiedot[$row['id']] = $row['vari_hex'];
				$toimialue_nimet .= ", " . $row['nimi'];
			}

			if (strlen($toimialue_nimet) > 0) {
				$toimialue_nimet = substr($toimialue_nimet, 2);
			}

			$con = null;
			$values = null;

			/*************** Kotiosastoraportti **************/

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Kotiosasto raportti - Sijaiset'), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			if ($hoitajat) {
				$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien kotiosastot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 1);
			} else if ($sihteerit) {
				$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien kotiosastot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 1);
			}
			$pdf->SetFont('Helvetica', '', '14');
			$pdf->SetY($pdf->GetY() + 5);
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $toimialue_nimet), 0, 'L');
			$pdf->SetFont('Helvetica', '', '12');
			$pdf->SetY($pdf->GetY() + 5);
			$pvm = "";
			$nimi = "";
			$osasto = "";
			$vuorot_yhteensa = 0;
			$pvm_yhteensa = 0;

			for ($i = 0; $i < count($nakyma_tiedot); $i++) {
				$osasto = $nakyma_tiedot[$i]['osasto'];
				$pvm_fi = substr($nakyma_tiedot[$i]['pvm'], 8, 2) . "." . substr($nakyma_tiedot[$i]['pvm'], 5, 2) . "." . substr($nakyma_tiedot[$i]['pvm'], 0, 4);
				$vuorot_yhteensa++;

				if ($pvm != $pvm_fi) {
					if ($pvm != "") {
						$pdf->SetFont('Helvetica', 'B', '12');
						$pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 'TB', 0, 'L');
						$pdf->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $pvm_yhteensa), 'TB', 0, 'C');
						$pdf->Cell(65, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', ''), 'TB', 0, 'C');
						$pvm_yhteensa = 0;
						$pdf->SetY($pdf->GetY() + 20);
						$nimi = "";
					}

					$pvm = $pvm_fi;
					$pdf->SetFont('Helvetica', 'B', '12');
					$pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $pvm), 'TB', 0, 'L');
					$pdf->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Kotiosasto kpl'), 'TB', 0, 'C');
					$pdf->Cell(65, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Kotiosasto'), 'TB', 0, 'R');
					$pdf->SetY($pdf->GetY() + 10);
				}

				$pvm_yhteensa++;

				if ($nimi != $nakyma_tiedot[$i]['nimi']) {
					$nimi = $nakyma_tiedot[$i]['nimi'];
					$pdf->SetFont('Helvetica', '', '12');
					$pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $nimi), 0, 0, 'L');
					$pdf->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', '1'), 0, 0, 'C');
				} else {
					$pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', '- || -'), 0, 0, 'L');
					$pdf->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', '1'), 0, 0, 'C');
				}


				$pdf->SetFont('Helvetica', '', '12');
				$pdf->Cell(65, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto), 0, 1, 'R');
			}
			$pdf->SetFont('Helvetica', 'B', '12');
			$pdf->Cell(60, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 'TB', 0, 'C');
			$pdf->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $pvm_yhteensa), 'TB', 0, 'C');
			$pdf->Cell(65, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', ''), 'TB', 1, 'C');

			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->Cell(65, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kaikki päivät yhteensä:"), 0, 0);
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $vuorot_yhteensa), 0, 0, 'C');

			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(120, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kotiosasto"), 1, 0, 'C');
			$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kpl"), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 0, 'C');
			$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yht"), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');

			$kotiosasto_prosentti_yhteensa = 0;
			$osasto_prosentti_yhteensa = 0;

			for ($l = 0; $l < count($osasto_tiedot); $l++) {
				$osasto_selite = $osasto_tiedot[$l]['selite'];
				$osasto_toimialue = $osasto_tiedot[$l]['toimialue_id'];
				$kotiosasto_vuorot = $osasto_tiedot[$l]['kotiosastovuorot'];
				$osasto_vuorot = $osasto_tiedot[$l]['vuorot'];
				$kotiosasto_vuoro_prosentti = 0;
				$osasto_vuoro_prosentti = 0;

				if ($kotiosasto_vuorot > 0) {
					if ($kotiosasto_vuorot_yhteensa > 0) {
						$kotiosasto_vuoro_prosentti = round((($kotiosasto_vuorot / $kotiosasto_vuorot_yhteensa) * 100), 1);
						$kotiosasto_prosentti_yhteensa += $kotiosasto_vuoro_prosentti;
					}

					if ($osasto_vuorot_yhteensa > 0) {
						$osasto_vuoro_prosentti = round((($kotiosasto_vuorot / $osasto_vuorot) * 100), 1);
					}

					if (array_key_exists($osasto_toimialue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_toimialue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);
						$pdf->Cell(120, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
					} else {
						$pdf->Cell(120, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
					}

					$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kotiosasto_vuorot), 1, 0, 'C');
					$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kotiosasto_vuoro_prosentti) . '%', 1, 0, 'C');
					$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_vuorot), 1, 0, 'C');
					$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_vuoro_prosentti) . '%', 1, 1, 'C');
				}
			}

			$kotiosasto_prosentti_yhteensa = round($kotiosasto_prosentti_yhteensa, 0);
			if ($osasto_vuorot_yhteensa > 0) {
				$osasto_prosentti_yhteensa = round((($kotiosasto_vuorot_yhteensa / $osasto_vuorot_yhteensa) * 100), 1);
			}

			$pdf->SetFont('Helvetica', 'B', '12');
			$pdf->Cell(120, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kotiosasto_vuorot_yhteensa), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kotiosasto_prosentti_yhteensa) . '%', 1, 0, 'C');
			$pdf->Cell(15, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_vuorot_yhteensa), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_prosentti_yhteensa) . '%', 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			if ($hoitajat) {
				$tiedostonimi = "Kotiosasto raportti - Sijaishoitajat.pdf";
			} else if ($sihteerit) {
				$tiedostonimi = "Kotiosasto raportti - Sijaissihteerit.pdf";
			}
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 11) { //Matkakustannusraportti - Sijaiset
			$kmhinta_alle_5000 = 0;
			$kmhinta_yli_5000 = 0;
			$kmhinta_alle_7000 = 0;
			$kmhinta_yli_7000 = 0;

			//Hae kmhinta alle 5000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 0 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_alle_5000 = $row['hinta'];
			}

			//Hae kmhinta alle 7000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 2 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_alle_7000 = $row['hinta'];
			}

			//Hae kmhinta yli 5000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 1 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_yli_5000 = $row['hinta'];
			}

			//Hae kmhinta yli 7000
			$sql = "SELECT hinta FROM kmkustannus WHERE tyyppi = 3 AND alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm LIMIT 1";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $alkupvm);
			$values->bindParam(':loppupvm', $loppupvm);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$kmhinta_yli_7000 = $row['hinta'];
			}

			$osasto_idt = explode(',', str_replace('\'', '', $_POST['osasto_idt']));
			$osasto_tiedot = array();
			$osasto_hoitaja_matkat_yhteensa = 0;
			$osasto_sihteeri_matkat_yhteensa = 0;
			$osasto_hoitaja_km_yhteensa = 0;
			$osasto_sihteeri_km_yhteensa = 0;
			$osasto_hoitaja_matka_kustannukset_yhteensa = 0;
			$osasto_sihteeri_matka_kustannukset_yhteensa = 0;
			$henkilo_km_tiedot = array();

			for ($i = 0; $i < count($osasto_idt); $i++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, lyhenne, toimialue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $osasto_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['raporttinumero'] = $row['raporttinumero'];
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];

				if ($hoitajat) {
					//Kaikki hoitaja matkat kustannuksineen
					$h_matka_maara = 0;
					$h_km_maara = 0;
					$h_matka_kustannukset = 0;

					$sql = "SELECT matka.km, matka.sijainen_id FROM matka LEFT JOIN vuoro ON matka.vuoro_id = vuoro.id WHERE matka.pvm >= :alkupvm AND matka.pvm <= :loppupvm AND matka.sijainen_id IN(" . $henkilo_idt . ") AND vuoro.raportti_osasto_id = :raportti_osasto_id AND tila = 3";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':raportti_osasto_id', $osasto_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						$h_matka_maara++;
						$h_km_maara += $row['km'];

						if (!array_key_exists($row['sijainen_id'], $henkilo_km_tiedot)) {
							$henkilo_km_tiedot[$row['sijainen_id']] = $row['km'];
							if ($kmhinta_alle_7000 == 0) {
								$h_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
							} else {
								$h_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
							}
						} else {
							if ($kmhinta_yli_7000 == 0) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 5000) {
									if ($henkilo_km_tiedot[$row['sijainen_id']] >= 5000) {
										$h_matka_kustannukset += $row['km'] * $kmhinta_yli_5000;
									} else {
										$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
										$matka_km_yli = $row['km'] - $matka_km_alle;

										$h_matka_kustannukset += $matka_km_alle * $kmhinta_alle_5000;
										$h_matka_kustannukset += $matka_km_yli * $kmhinta_yli_5000;
									}
								} else {
									$h_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
								}
							} else {
								if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 7000) {
									if ($henkilo_km_tiedot[$row['sijainen_id']] >= 7000) {
										$h_matka_kustannukset += $row['km'] * $kmhinta_yli_7000;
									} else {
										$matka_km_alle = 7000 - $henkilo_km_tiedot[$row['sijainen_id']];
										$matka_km_yli = $row['km'] - $matka_km_alle;

										$h_matka_kustannukset += $matka_km_alle * $kmhinta_alle_7000;
										$h_matka_kustannukset += $matka_km_yli * $kmhinta_yli_7000;
									}
								} else {
									$h_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
								}
							}
						}
					}
					$osasto_rivi['hoitaja_matkat'] = $h_matka_maara;
					$osasto_hoitaja_matkat_yhteensa += $osasto_rivi['hoitaja_matkat'];

					$osasto_rivi['hoitaja_km'] = $h_km_maara;
					$osasto_hoitaja_km_yhteensa += $osasto_rivi['hoitaja_km'];

					$osasto_rivi['hoitaja_km_kustannukset'] = $h_matka_kustannukset;
					$osasto_hoitaja_matka_kustannukset_yhteensa += $osasto_rivi['hoitaja_km_kustannukset'];
				}

				if ($sihteerit) {
					//Kaikki sihteeri matkat kustannuksineen
					$s_matka_maara = 0;
					$s_km_maara = 0;
					$s_matka_kustannukset = 0;

					$sql = "SELECT matka.km, matka.sijainen_id FROM matka LEFT JOIN vuoro ON matka.vuoro_id = vuoro.id WHERE matka.pvm >= :alkupvm AND matka.pvm <= :loppupvm AND matka.sijainen_id IN(" . $henkilo_idt . ") AND vuoro.raportti_osasto_id = :raportti_osasto_id AND tila = 3";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':raportti_osasto_id', $osasto_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						$s_matka_maara++;
						$s_km_maara += $row['km'];

						if (!array_key_exists($row['sijainen_id'], $henkilo_km_tiedot)) {
							$henkilo_km_tiedot[$row['sijainen_id']] = $row['km'];
							if ($kmhinta_alle_7000 == 0) {
								$s_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
							} else {
								$s_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
							}
						} else {
							if ($kmhinta_yli_7000 == 0) {
								if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 5000) {
									if ($henkilo_km_tiedot[$row['sijainen_id']] >= 5000) {
										$s_matka_kustannukset += $row['km'] * $kmhinta_yli_5000;
									} else {
										$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
										$matka_km_yli = $row['km'] - $matka_km_alle;

										$s_matka_kustannukset += $matka_km_alle * $kmhinta_alle_5000;
										$s_matka_kustannukset += $matka_km_yli * $kmhinta_yli_5000;
									}
								} else {
									$s_matka_kustannukset += $row['km'] * $kmhinta_alle_5000;
								}
							} else {
								if ($henkilo_km_tiedot[$row['sijainen_id']] + $row['km'] >= 7000) {
									if ($henkilo_km_tiedot[$row['sijainen_id']] >= 7000) {
										$s_matka_kustannukset += $row['km'] * $kmhinta_yli_7000;
									} else {
										$matka_km_alle = 5000 - $henkilo_km_tiedot[$row['sijainen_id']];
										$matka_km_yli = $row['km'] - $matka_km_alle;

										$s_matka_kustannukset += $matka_km_alle * $kmhinta_alle_7000;
										$s_matka_kustannukset += $matka_km_yli * $kmhinta_yli_7000;
									}
								} else {
									$s_matka_kustannukset += $row['km'] * $kmhinta_alle_7000;
								}
							}
						}
					}
					$osasto_rivi['sihteeri_matkat'] = $s_matka_maara;
					$osasto_sihteeri_matkat_yhteensa += $osasto_rivi['sihteeri_matkat'];

					$osasto_rivi['sihteeri_km'] = $s_km_maara;
					$osasto_sihteeri_km_yhteensa += $osasto_rivi['sihteeri_km'];

					$osasto_rivi['sihteeri_km_kustannukset'] = $s_matka_kustannukset;
					$osasto_sihteeri_matka_kustannukset_yhteensa += $osasto_rivi['sihteeri_km_kustannukset'];
				}

				array_push($osasto_tiedot, $osasto_rivi);
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['toimialue_id'] == $row['id']) {
						$toimialue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($toimialue_osastot) > 0) {
					$toimialue_osastot = substr($toimialue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $toimialue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);

				$varitiedot[$row['id']] = $row['vari_hex'];
			}

			//Sulje yhteys
			$con = null;
			$values = null;


			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Matkakustannusraportti - Sijaiset"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			if ($hoitajat) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien matkat ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');
			} else if ($sihteerit) {
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien matkat ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');
			}

			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}

			$pdf->SetFont('Helvetica', '', '10');
			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Osastot"), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Matkat"), 1, 0, 'C');
			$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Km"), 1, 0, 'C');
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kustannus ") . chr(128), 1, 1, 'C'); //char 128 = €

			$osasto_kustannus_yhteensa = 0;

			for ($i = 0; $i < count($osasto_tiedot); $i++) {
				$osasto_selite = $osasto_tiedot[$i]['selite'];
				$osasto_toimialue = $osasto_tiedot[$i]['toimialue_id'];

				if ($hoitajat) {
					$osasto_hoitaja_matka_maara = $osasto_tiedot[$i]['hoitaja_matkat'];
					$osasto_hoitaja_matka_km_maara = $osasto_tiedot[$i]['hoitaja_km'];
					$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['hoitaja_km_kustannukset'];
				}

				if ($sihteerit) {
					$osasto_sihteeri_matka_maara = $osasto_tiedot[$i]['sihteeri_matkat'];
					$osasto_sihteeri_matka_km_maara = $osasto_tiedot[$i]['sihteeri_km'];
					$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['sihteeri_km_kustannukset'];
				}

				$osasto_kustannus_yhteensa += $osasto_kustannus_rivi_yhteensa;

				if (($hoitajat == true && $osasto_hoitaja_matka_maara > 0) || ($sihteerit == true && $osasto_sihteeri_matka_maara > 0)) {
					if (array_key_exists($osasto_toimialue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_toimialue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);

						if (strlen($osasto_selite) > '50') {
							$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 50) . "."), 1, 0, 'L', true);
						} else {
							$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
						}
					} else {
						if (strlen($osasto_selite) > '50') {
							$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 50) . "."), 1, 0, 'L');
						} else {
							$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
						}
					}

					if ($hoitajat) {
						$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_matka_maara), 1, 0, 'C');
						$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_matka_km_maara) . ' km', 1, 0, 'C');
					}

					if ($sihteerit) {
						$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_matka_maara), 1, 0, 'C');
						$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_matka_km_maara) . ' km', 1, 0, 'C');
					}

					$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_rivi_yhteensa, 2, '.', '')), 1, 1, 'C');
				}
			}

			$pdf->SetFont('Helvetica', 'B', '10');
			$pdf->Cell(80, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);

			if ($hoitajat) {
				$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_matkat_yhteensa), 1, 0, 'C');
				$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_km_yhteensa) . ' km', 1, 0, 'C');
			}

			if ($sihteerit) {
				$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_matkat_yhteensa), 1, 0, 'C');
				$pdf->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_km_yhteensa) . ' km', 1, 0, 'C');
			}

			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_yhteensa, 2, '.', '')), 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			if ($hoitajat) {
				$tiedostonimi = "Matkakustannusraportti - Sijaishoitajat.pdf";
			} else if ($sihteerit) {
				$tiedostonimi = "Matkakustannusraportti - Sijaissihteerit.pdf";
			}

			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 3) { //Taloudellinen raportti - Reserviläiset
			//Hae kaikki osasto id:t
			$osasto_raportti_idt = "";
			$osastovalintaWhere = "";

			$sql = "SELECT id FROM osasto WHERE id IN(" . $osastojen_idt . ") ORDER BY toimialue_id, raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_raportti_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($osasto_raportti_idt) > 0) {
				$osasto_raportti_idt = substr($osasto_raportti_idt, 1);
			}

			$osastovalintaWhere = " AND osasto_id IN(" . $osasto_raportti_idt . ")";

			/***************** Reservitaustojen mukaan ***************************/
			$reservitausta_idt = explode(',', str_replace('\'', '', $_POST['tausta_idt']));
			$reservitausta_tiedot = array();
			$reservitausta_hoitaja_paivat_yhteensa = 0;

			for ($i = 0; $i < count($reservitausta_idt); $i++) {
				$reservitausta_rivi = array();
				$h_p_maara = 0;

				//Reservitaustan tiedot
				$sql = "SELECT selite, numero FROM reservitausta WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $reservitausta_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$reservitausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];

				//Kaikki hoitajien päivät
				$sql = "SELECT DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS h_p_maara, tyomaara FROM tyojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id IN(" . $henkilo_idt . ")" . $osastovalintaWhere . " AND reservitausta_id = :reservitausta_id";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':reservitausta_id', $reservitausta_idt[$i]);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$h_p_maara += ($row['h_p_maara'] + 1) * ($row['tyomaara'] / 100);
				}
				$reservitausta_rivi['hoitajat'] = $h_p_maara;
				$reservitausta_hoitaja_paivat_yhteensa += $reservitausta_rivi['hoitajat'];

				array_push($reservitausta_tiedot, $reservitausta_rivi);
			}

			/***************** Osastojen mukaan ***************/
			$osasto_idt = explode(',', str_replace('\'', '', $_POST['osasto_idt']));
			$osasto_tiedot = array();
			$osasto_hoitaja_paivat_yhteensa = 0;
			$osasto_hoitaja_paiva_kustannukset_yhteensa = 0;

			for ($i = 0; $i < count($osasto_idt); $i++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, lyhenne, toimialue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $osasto_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];

				//Kaikki hoitajat kustannuksineen
				$hp_maara = 0;
				$hp_kustannukset = 0;
				$h_tyojaksot = array();

				$sql = "SELECT CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS aloitus, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS lopetus, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS h_p_maara, tyomaara, reservilainen_id FROM tyojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id IN(" . $henkilo_idt . ") AND osasto_id = :osasto_id AND reservitausta_id IN(" . $tausta_idt . ")";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $osasto_idt[$i]);
				$values->execute();
				$h_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);

				for ($j = 0; $j < count($h_tyojaksot); $j++) {
					$reservihenkilohinta = "";
					$reservilainen_id = $h_tyojaksot[$j]['reservilainen_id'];
					$hp_maara += ($h_tyojaksot[$j]['h_p_maara'] + 1) * ($h_tyojaksot[$j]['tyomaara'] / 100);

					$sql = "SELECT hinta FROM reservihenkilokustannus WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id = :reservilainen_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $h_tyojaksot[$j]['aloitus']);
					$values->bindParam(':loppupvm', $h_tyojaksot[$j]['lopetus']);
					$values->bindParam(':reservilainen_id', $reservilainen_id);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					if ($row != null) {
						$reservihenkilohinta = $row['hinta'];
					}

					$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_h_p_maara FROM reservikustannus WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND osasto_id = :osasto_id";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $h_tyojaksot[$j]['aloitus']);
					$values->bindParam(':loppupvm', $h_tyojaksot[$j]['lopetus']);
					$values->bindParam(':osasto_id', $osasto_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($reservihenkilohinta != null || $reservihenkilohinta != "") {
							$hp_kustannukset += ($h_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_h_p_maara'] + 1) * $reservihenkilohinta);
						} else if ($row['hinta'] != null || $row['hinta'] != "") {
							$hp_kustannukset += ($h_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_h_p_maara'] + 1) * $row['hinta']);
						}
					}
				}
				$osasto_rivi['hoitajat'] = $hp_maara;
				$osasto_hoitaja_paivat_yhteensa += $osasto_rivi['hoitajat'];
				$osasto_rivi['h_kustannukset'] = $hp_kustannukset;
				$osasto_hoitaja_paiva_kustannukset_yhteensa += $osasto_rivi['h_kustannukset'];

				array_push($osasto_tiedot, $osasto_rivi);
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['toimialue_id'] == $row['id']) {
						$toimialue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($toimialue_osastot) > 0) {
					$toimialue_osastot = substr($toimialue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $toimialue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);

				$varitiedot[$row['id']] = $row['vari_hex'];
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Taloudellinen raportti - Reserviläiset"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien työvuorot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');

			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$rivimaara = count($reservitausta_tiedot) + 2;
			$rivikorkeus = 10;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
			}

			/**************** Reservitaustoittain ******************/
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Reservitausta"), 1, 0, 'C');
			$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajat"), 1, 0, 'C');
			$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');

			$reservitausta_hoitaja_paiva_prosentti_yhteensa = 0;

			for ($i = 0; $i < count($reservitausta_tiedot); $i++) {
				$reservitausta_selite = $reservitausta_tiedot[$i]['selite'];
				$reservitausta_hoitaja_paivat = $reservitausta_tiedot[$i]['hoitajat'];
				$reservitausta_hoitaja_paiva_prosentti = 0;

				if ($reservitausta_hoitaja_paivat_yhteensa > 0) {
					$reservitausta_hoitaja_paiva_prosentti = round((($reservitausta_hoitaja_paivat / $reservitausta_hoitaja_paivat_yhteensa) * 100), 1);
					$reservitausta_hoitaja_paiva_prosentti_yhteensa += (($reservitausta_hoitaja_paivat / $reservitausta_hoitaja_paivat_yhteensa) * 100);
				}

				if ($_POST['tyhjat'] == 1 || ($_POST['tyhjat'] == 0 && $reservitausta_hoitaja_paivat > 0)) {
					if (strlen($reservitausta_selite) > '40') {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($reservitausta_selite, 0, 40) . "."), 1, 0);
					} else {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_selite), 1, 0);
					}

					$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_hoitaja_paivat), 1, 0, 'C');
					$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_hoitaja_paiva_prosentti) . '%', 1, 1, 'C');
				}
			}

			$reservitausta_hoitaja_paiva_prosentti_yhteensa = round($reservitausta_hoitaja_paiva_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', $kirjainkoko);
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_hoitaja_paivat_yhteensa), 1, 0, 'C');
			$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_hoitaja_paiva_prosentti_yhteensa) . '%', 1, 1, 'C');
			$pdf->SetFont('Helvetica', '', '10');
			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Osastot"), 1, 0, 'C');
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajat"), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 0, 'C');
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kustannus ") . chr(128), 1, 1, 'C'); //€

			$osasto_hoitaja_paiva_prosentti_yhteensa = 0;
			$osasto_paiva_kustannus_yhteensa = 0;

			for ($i = 0; $i < count($osasto_tiedot); $i++) {
				$osasto_selite = $osasto_tiedot[$i]['selite'];
				$osasto_toimialue = $osasto_tiedot[$i]['toimialue_id'];
				$osasto_hoitaja_paivat = $osasto_tiedot[$i]['hoitajat'];
				$osasto_hoitaja_paiva_prosentti = 0;

				if ($osasto_hoitaja_paivat_yhteensa > 0) {
					$osasto_hoitaja_paiva_prosentti = round((($osasto_hoitaja_paivat / $osasto_hoitaja_paivat_yhteensa) * 100), 1);
					$osasto_hoitaja_paiva_prosentti_yhteensa += (($osasto_hoitaja_paivat / $osasto_hoitaja_paivat_yhteensa) * 100);
				}

				if (array_key_exists('h_kustannukset', $osasto_tiedot[$i])) {
					$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['h_kustannukset'];
				} else {
					$osasto_kustannus_rivi_yhteensa = 0;
				}

				$osasto_paiva_kustannus_yhteensa += $osasto_kustannus_rivi_yhteensa;

				if ($_POST['tyhjat'] == 1 || ($_POST['tyhjat'] == 0 && $osasto_hoitaja_paivat > 0)) {
					if (array_key_exists($osasto_toimialue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_toimialue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);

						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L', true);
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
						}
					} else {
						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L');
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
						}
					}

					$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_paivat), 1, 0, 'C');
					$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_paiva_prosentti) . '%', 1, 0, 'C');
					$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_rivi_yhteensa, 2, '.', '')), 1, 1, 'C');
				}
			}

			$osasto_hoitaja_paiva_prosentti_yhteensa = round($osasto_hoitaja_paiva_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', '10');
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_paivat_yhteensa), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_hoitaja_paiva_prosentti_yhteensa) . '%', 1, 0, 'C');
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_paiva_kustannus_yhteensa, 2, '.', '')), 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			$tiedostonimi = utf8_decode("Taloudellinen raportti - Reserviläiset.pdf");
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 4) { //Reservisyy raportti - Reserviläiset
			//Reservitaustan tiedot
			$reservitausta_tiedot = array();
			$sql = "SELECT id, selite, numero FROM reservitausta ORDER BY numero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$reservitausta_rivi['id'] = $row['id'];
				$reservitausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];

				array_push($reservitausta_tiedot, $reservitausta_rivi);
			}

			//Reservisyyt
			$reservisyy_tietorivit = array();
			$alku_kuukausi = intval(substr($_POST['alkupvm'], 3, 2));
			$alku_vuosi = intval(substr($_POST['alkupvm'], 6, 4));
			$loppu_kuukausi = intval(substr($_POST['loppupvm'], 3, 2));
			$loppu_vuosi = intval(substr($_POST['loppupvm'], 6, 4));
			$kasiteltava_kuukausi = $alku_kuukausi;
			$kasiteltava_vuosi = $alku_vuosi;
			$kasiteltava_alku_pvm = "";
			$kasiteltava_loppu_pvm = "";
			$kasiteltava_kuukausi_arvo = "";
			$valmis = false;

			while (!$valmis) {
				$kasiteltava_kuukausi_arvo = $kasiteltava_kuukausi;
				if ($kasiteltava_kuukausi_arvo <= 9) {
					$kasiteltava_kuukausi_arvo = "0" . $kasiteltava_kuukausi_arvo;
				}

				$kasiteltava_alku_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-01";
				$kasiteltava_pvm = new DateTime($kasiteltava_alku_pvm);
				$kasiteltava_loppu_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-" . $kasiteltava_pvm->format("t");
				$loytyi = false;

				$sql = "SELECT reservitausta_id, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS p_maara, tyomaara FROM tyojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND reservilainen_id IN(" . $henkilo_idt . ") 
				AND osasto_id IN (" . $osastojen_idt . ") AND reservitausta_id IN(SELECT id FROM reservitausta) ORDER BY (SELECT numero FROM reservitausta WHERE id = reservitausta_id) ASC, alku_pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $kasiteltava_alku_pvm);
				$values->bindParam(':loppupvm', $kasiteltava_loppu_pvm);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$loytyi = true;
					$reservisyy_rivi['reservitausta_id'] = $row['reservitausta_id'];
					$reservisyy_rivi['p_maara'] = ($row['p_maara'] + 1) * ($row['tyomaara'] / 100);
					$reservisyy_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$reservisyy_rivi['vuosi'] = $kasiteltava_vuosi;

					array_push($reservisyy_tietorivit, $reservisyy_rivi);
				}

				if (!$loytyi) {
					$reservisyy_rivi['reservitausta_id'] = -1;
					$reservisyy_rivi['p_maara'] = 0;
					$reservisyy_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$reservisyy_rivi['vuosi'] = $kasiteltava_vuosi;
					array_push($reservisyy_tietorivit, $reservisyy_rivi);
				}

				if ($kasiteltava_kuukausi == $loppu_kuukausi && $kasiteltava_vuosi == $loppu_vuosi) {
					$valmis = true;
				}

				$kasiteltava_kuukausi++;

				if ($kasiteltava_kuukausi > 12) {
					$kasiteltava_kuukausi = 1;
					$kasiteltava_vuosi++;
				}
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$osasto_tiedot = array();

			//Osastojen nimet
			$sql = "SELECT lyhenne, toimialue_id FROM osasto WHERE id IN (" . $osastojen_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_rivi['toimialue_id'] = $row['toimialue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];
				array_push($osasto_tiedot, $osasto_rivi);
			}

			$sql = "SELECT id, nimi FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['toimialue_id'] == $row['id']) {
						$toimialue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($toimialue_osastot) > 0) {
					$toimialue_osastot = substr($toimialue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $toimialue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//Arvot
			$reservisyy_tiedot = array();
			for ($i = 0; $i < count($reservisyy_tietorivit); $i++) {
				$vuosi_kuukausi = $reservisyy_tietorivit[$i]['vuosi'] . "-" . $reservisyy_tietorivit[$i]['kuukausi'];
				$reservitausta_id = $reservisyy_tietorivit[$i]['reservitausta_id'];

				if (!array_key_exists($vuosi_kuukausi, $reservisyy_tiedot)) {
					$reservisyy_tiedot[$vuosi_kuukausi]['maara'] = 0;
					$reservisyy_tiedot[$vuosi_kuukausi]['maara'] += $reservisyy_tietorivit[$i]['p_maara'];
				} else {
					$reservisyy_tiedot[$vuosi_kuukausi]['maara'] += $reservisyy_tietorivit[$i]['p_maara'];
				}

				if (!array_key_exists($reservitausta_id, $reservisyy_tiedot[$vuosi_kuukausi])) {
					$reservisyy_tiedot[$vuosi_kuukausi][$reservitausta_id] = 0;
					$reservisyy_tiedot[$vuosi_kuukausi][$reservitausta_id] += $reservisyy_tietorivit[$i]['p_maara'];
				} else {
					$reservisyy_tiedot[$vuosi_kuukausi][$reservitausta_id] += $reservisyy_tietorivit[$i]['p_maara'];
				}
			}

			/*************** Reservisyyraportti **************/
			$alku = substr($alkupvm, 8, 2) . "." . substr($alkupvm, 5, 2) . "." . substr($alkupvm, 0, 4);
			$loppu = substr($loppupvm, 8, 2) . "." . substr($loppupvm, 5, 2) . "." . substr($loppupvm, 0, 4);

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Reservisyy raportti"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien vuorotaustat ajalta " . $alku . " - " . $loppu), 0, 'L');
			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$otsikkoX = $pdf->GetX();
			$rivimaara = count($reservitausta_tiedot) + 2;
			$rivikorkeus = 8;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
				$otsikkoY = $pdf->GetY();
				$otsikkoX = $pdf->GetX();
			}
			$pdf->SetFont('Helvetica', '', '8');
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Reservitausta"), 1, 2, 'L');
			for ($i = 0; $i < count($reservitausta_tiedot); $i++) {
				$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_tiedot[$i]['selite']), 1, 2, 'L'); //265, 95 + 17*10 = 265
			}
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
			$pdf->SetY($otsikkoY);
			$pdf->SetX($otsikkoX + 55);
			$x_rivimaara = 0;
			$edellinen_vuosi = '';
			foreach ($reservisyy_tiedot as $vuosi_kuukausi => $tiedot) {
				if ($x_rivimaara == 7) {
					$pdf->AddPage();
					$pdf->SetY($pdf->GetY() + 10);
					$otsikkoY = $pdf->GetY();
					$otsikkoX = $pdf->GetX();
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Reservitausta"), 1, 2, 'L');

					for ($i = 0; $i < count($reservitausta_tiedot); $i++) {
						$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_tiedot[$i]['selite']), 1, 2, 'L');
					}
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
					$pdf->SetY($otsikkoY);
					$pdf->SetX($otsikkoX + 55);
					$x_rivimaara = 0;
				}

				$otsikkoX = $pdf->GetX() + 20;
				$vuosi_kuukausi_tiedot = explode('-', $vuosi_kuukausi);
				$vuosi = $vuosi_kuukausi_tiedot[0];
				$kuukausi = $vuosi_kuukausi_tiedot[1];

				if ($edellinen_vuosi != $vuosi) {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi . " (" . $vuosi . ")"), 1, 2, 'C');
					$edellinen_vuosi = $vuosi;
				} else {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi), 1, 2, 'C');
				}
				$vuosi_kuukausi_prosentti = 0;

				for ($i = 0; $i < count($reservitausta_tiedot); $i++) {
					$reservitausta_id = $reservitausta_tiedot[$i]['id'];
					$reservitausta_yhteensa = 0;
					$vuosi_kuukausi_yhteensa = 0;

					if (array_key_exists($reservitausta_id, $tiedot)) {
						$reservitausta_yhteensa = $tiedot[$reservitausta_id];
					}
					if (array_key_exists($vuosi_kuukausi, $reservisyy_tiedot)) {
						$vuosi_kuukausi_yhteensa = $reservisyy_tiedot[$vuosi_kuukausi]['maara'];
					}

					$reservitausta_prosentti = 0;

					if ($vuosi_kuukausi_yhteensa > 0) {
						$reservitausta_prosentti = round((($reservitausta_yhteensa / $vuosi_kuukausi_yhteensa) * 100), 1);
						$vuosi_kuukausi_prosentti += $reservitausta_prosentti;
					}

					if (array_key_exists($reservitausta_id, $tiedot)) {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservitausta_prosentti . "%"), 1, 2, 'C'); //lkm $tiedot[$reservitausta_id]
					} else {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "0%"), 1, 2, 'C');
					}
				}

				$vuosi_kuukausi_prosentti = round($vuosi_kuukausi_prosentti, 0);
				$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $vuosi_kuukausi_prosentti . "%"), 1, 2, 'C'); //lkm $reservisyy_tiedot[$vuosi_kuukausi]['maara']
				$pdf->SetY($otsikkoY);
				$pdf->SetX($otsikkoX);
				$x_rivimaara++;
			}

			/*************** PDF Tallenus tiedostoksi ******************/
			$tiedostonimi = utf8_decode("Reservisyy raportti - Reserviläiset.pdf");
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 5) { //Työmääräraportti - Reserviläiset
			$tyojakso_tiedot = array();

			//Hae toimialueiden nimet
			$toimialue_nimet = "";

			$sql = "SELECT nimi FROM toimialue WHERE id IN(" . $toimialue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();

			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$toimialue_nimet .= ", " . $row['nimi'];
			}

			if (strlen($toimialue_nimet) > 0) {
				$toimialue_nimet = substr($toimialue_nimet, 2);
			}

			$reservilaistiedot = array();

			$sql = "SELECT id, nimi FROM reservilainen WHERE id IN(" . $henkilo_idt . ") ORDER BY nimi";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$reservilaistieto_rivi['id'] = $row['id'];
				$reservilaistieto_rivi['nimi'] = $row['nimi'];

				array_push($reservilaistiedot, $reservilaistieto_rivi);
			}

			for ($i = 0; $i < count($reservilaistiedot); $i++) {
				$reservilaisen_tyojaksot = array();
				$aikavalit = array();
				$sql = "SELECT (CASE WHEN (:alku_pvm > alku_pvm) THEN :alku_pvm ELSE alku_pvm END) AS pvm, 'A' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) UNION SELECT (CASE WHEN (:loppu_pvm < loppu_pvm) THEN :loppu_pvm ELSE loppu_pvm END) AS pvm, 'L' AS tyyppi FROM tyojakso WHERE reservilainen_id = :reservilainen_id AND (alku_pvm <= :loppu_pvm AND loppu_pvm >= :alku_pvm) ORDER BY pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':alku_pvm', $alkupvm);
				$values->bindParam(':loppu_pvm', $loppupvm);
				$values->bindParam(':reservilainen_id', $reservilaistiedot[$i]['id']);
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
							$values->bindParam(':reservilainen_id', $reservilaistiedot[$i]['id']);
							$values->execute();
							while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
								if ($row['tyomaara_prosentti'] != null) {
									$tyomaara_yhteensa += $row['tyomaara_prosentti'];
								}
							}

							if ($tyomaara_yhteensa > 0 && $tyomaara_yhteensa < 100) {
								$tyojakso['alku_pvm'] = $tyojakso_alku_pvm;
								$tyojakso['loppu_pvm'] = $tyojakso_loppu_pvm;
								$tyojakso['tyomaara'] = $tyomaara_yhteensa;

								array_push($reservilaisen_tyojaksot, $tyojakso);
							}
						}
					}
				}

				$tyojakso_tiedot[$reservilaistiedot[$i]['id']] = $reservilaisen_tyojaksot;
			}

			$con = null;
			$values = null;

			/*************** Työmääräraportti **************/

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Työmäärä raportti - reserviläiset'), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Hoitajien työmäärät ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 1);
			$pdf->SetFont('Helvetica', '', '14');
			$pdf->SetY($pdf->GetY() + 5);
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $toimialue_nimet), 0, 'L');
			$pdf->SetFont('Helvetica', '', '12');
			$pdf->SetY($pdf->GetY() + 5);

			$reservilaisen_nimi = "";

			for ($i = 0; $i < count($reservilaistiedot); $i++) {
				$id = $reservilaistiedot[$i]['id'];
				$jaksot_yhteensa = count($tyojakso_tiedot[$id]);
				if ($jaksot_yhteensa > 0) {
					$nimi = $reservilaistiedot[$i]['nimi'];
					if ($reservilaisen_nimi != $nimi) {
						$rivikorkeus = 10 * count($tyojakso_tiedot[$id]) + 20 + $pdf->GetY();
						if ($rivikorkeus > 275) {
							$pdf->AddPage();
							$pdf->SetY($pdf->GetY() + 5);
						}
						if ($reservilaisen_nimi != "") {
							$pdf->SetY($pdf->GetY() + 10);
						}
						$reservilaisen_nimi = $nimi;
						$pdf->SetFont('Helvetica', 'B', '12');
						$pdf->Cell(165, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $reservilaisen_nimi), 'TB', 0, 'C');
						$pdf->SetY($pdf->GetY() + 10);


						for ($j = 0; $j < count($tyojakso_tiedot[$id]); $j++) {
							$alku_pvm_fi = substr($tyojakso_tiedot[$id][$j]['alku_pvm'], 8, 2) . "." . substr($tyojakso_tiedot[$id][$j]['alku_pvm'], 5, 2) . "." . substr($tyojakso_tiedot[$id][$j]['alku_pvm'], 0, 4);
							$loppu_pvm_fi = substr($tyojakso_tiedot[$id][$j]['loppu_pvm'], 8, 2) . "." . substr($tyojakso_tiedot[$id][$j]['loppu_pvm'], 5, 2) . "." . substr($tyojakso_tiedot[$id][$j]['loppu_pvm'], 0, 4);
							$tyojakson_tyomaara = $tyojakso_tiedot[$id][$j]['tyomaara'];
							$pdf->SetFont('Helvetica', '', '12');
							if ($tyojakson_tyomaara < 100) {
								$pdf->SetFillColor(237, 162, 149);
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $alku_pvm_fi), 0, 0, 'L', true);
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', " - "), 0, 0, 'C', true);
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $loppu_pvm_fi), 0, 0, 'R', true);
								$pdf->Cell(90, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $tyojakson_tyomaara . "%"), 0, 0, 'R', true);
							} else {
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $alku_pvm_fi), 0, 0, 'L');
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', " - "), 0, 0, 'C');
								$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $loppu_pvm_fi), 0, 0, 'R');
								$pdf->Cell(90, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $tyojakson_tyomaara . "%"), 0, 0, 'R');
							}
							$pdf->SetY($pdf->GetY() + 10);
						}
					}
				}
			}
			/*************** PDF Tallenus tiedostoksi ******************/
			$tiedostonimi = utf8_decode("Työmäärä raportti - Reserviläiset.pdf");
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 6) { //Taloudellinen raportti - Sihteerit
			//Hae kaikki osasto id:t
			$osasto_raportti_idt = "";
			$osastovalintaWhere = "";

			$sql = "SELECT id FROM osasto WHERE id IN(" . $osastojen_idt . ") ORDER BY palvelualue_id, raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_raportti_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($osasto_raportti_idt) > 0) {
				$osasto_raportti_idt = substr($osasto_raportti_idt, 1);
			}

			$osastovalintaWhere = " AND osasto_id IN(" . $osasto_raportti_idt . ")";

			/***************** Taustojen mukaan ***************************/
			$sihteeritausta_idt = explode(',', str_replace('\'', '', $_POST['tausta_idt']));
			$sihteeritausta_tiedot = array();
			$sihteeritausta_sihteeri_paivat_yhteensa = 0;

			if (in_array(-1, $sihteeritausta_idt)) {
				$s_p_maara = 0;
				$sihteeritausta_rivi = array();
				$sihteeritausta_rivi['selite'] = "Vakituinen";
				//Kaikki sihteerien päivät (Vakituinen tausta)
				$sql = "SELECT sihteeri_id, CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS jakso_alku, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS jakso_loppu, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ")" . $osastovalintaWhere . " AND tausta_id = -1 AND alijakso = 0";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->execute();
				$sihteerityojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($sihteerityojaksot); $j++) {
					$s_a_p_maara = 0;

					$sql = "SELECT DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_a_p_maara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id = :sihteeri_id AND alijakso = 1";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $sihteerityojaksot[$j]['jakso_alku']);
					$values->bindParam(':loppupvm', $sihteerityojaksot[$j]['jakso_loppu']);
					$values->bindParam(':sihteeri_id', $sihteerityojaksot[$j]['sihteeri_id']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						$s_a_p_maara += $row['s_a_p_maara'] + 1;
					}

					$s_p_maara += (($sihteerityojaksot[$j]['s_p_maara'] + 1) - $s_a_p_maara) * ($sihteerityojaksot[$j]['tyomaara'] / 100);
				}

				$sihteeritausta_rivi['sihteerit'] = $s_p_maara;
				$sihteeritausta_sihteeri_paivat_yhteensa += $sihteeritausta_rivi['sihteerit'];

				array_push($sihteeritausta_tiedot, $sihteeritausta_rivi);
			}

			for ($i = 0; $i < count($sihteeritausta_idt); $i++) {
				$sihteeritausta_rivi = array();
				$s_p_maara = 0;

				if ($sihteeritausta_idt[$i] != -1) {
					//Tausta tiedot
					$sql = "SELECT selite, numero FROM tausta WHERE id = :id";
					$values = $con->prepare($sql);
					$values->bindParam(':id', $sihteeritausta_idt[$i]);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					$sihteeritausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];
					if ($row['numero'] == 10) {
						$sissi_perehdytys_tausta_id = $sihteeritausta_idt[$i];
					}

					//Kaikki sihteerien päivät (Alijakso = 1)
					$sql = "SELECT DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ")" . $osastovalintaWhere . " AND tausta_id = :tausta_id AND alijakso = 1";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':tausta_id', $sihteeritausta_idt[$i]);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						$s_p_maara += ($row['s_p_maara'] + 1) * ($row['tyomaara'] / 100);
					}

					$sihteeritausta_rivi['sihteerit'] = $s_p_maara;
					$sihteeritausta_sihteeri_paivat_yhteensa += $sihteeritausta_rivi['sihteerit'];


					array_push($sihteeritausta_tiedot, $sihteeritausta_rivi);
				}
			}

			/***************** Osastojen mukaan ***************/
			$osasto_idt = explode(',', str_replace('\'', '', $_POST['osasto_idt']));
			$osasto_tiedot = array();
			$osasto_sihteeri_paivat_yhteensa = 0;
			$osasto_sihteeri_paiva_kustannukset_yhteensa = 0;
			$sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa = 0;

			for ($i = 0; $i < count($osasto_idt); $i++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, lyhenne, palvelualue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $osasto_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['raporttinumero'] = $row['raporttinumero'];
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['palvelualue_id'] = $row['palvelualue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];

				$sp_maara = 0;
				$sp_kustannukset = 0;
				$sp_sissi_perehdytys_kustannukset = 0;
				$s_tyojaksot = array();
				$s_a_tyojaksot = array();

				if (in_array(-1, $sihteeritausta_idt)) {
					//Kaikki sihteerit kustannuksineen (vakituinen)
					$sql = "SELECT sihteeri_id, CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS jakso_alku, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS jakso_loppu, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ") AND osasto_id = :osasto_id AND tausta_id = -1 AND alijakso = 0";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $alkupvm);
					$values->bindParam(':loppupvm', $loppupvm);
					$values->bindParam(':osasto_id', $osasto_idt[$i]);
					$values->execute();
					$s_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
					for ($j = 0; $j < count($s_tyojaksot); $j++) {
						$s_a_p_maara = 0;

						$sql = "SELECT DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_a_p_maara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id = :sihteeri_id AND alijakso = 1";
						$values = $con->prepare($sql);
						$values->bindParam(':alkupvm', $s_tyojaksot[$j]['jakso_alku']);
						$values->bindParam(':loppupvm', $s_tyojaksot[$j]['jakso_loppu']);
						$values->bindParam(':sihteeri_id', $s_tyojaksot[$j]['sihteeri_id']);
						$values->execute();
						while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
							$s_a_p_maara += $row['s_a_p_maara'] + 1;
						}

						$sp_maara += (($s_tyojaksot[$j]['s_p_maara'] + 1) - $s_a_p_maara) * ($s_tyojaksot[$j]['tyomaara'] / 100);

						$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_s_p_maara FROM sihteerikustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
						$values = $con->prepare($sql);
						$values->bindParam(':alkupvm', $s_tyojaksot[$j]['jakso_alku']);
						$values->bindParam(':loppupvm', $s_tyojaksot[$j]['jakso_loppu']);
						$values->execute();
						while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
							if ($row['hinta'] != null || $row['hinta'] != "") {
								$sp_kustannukset += ($s_tyojaksot[$j]['tyomaara'] / 100) * ((($row['tj_s_p_maara'] + 1) - $s_a_p_maara) * $row['hinta']);
							}
						}
					}
				}

				//Kaikki sihteerit kustannuksineen (alijakso)
				$sql = "SELECT tausta_id, CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS jakso_alku, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS jakso_loppu, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ") AND osasto_id = :osasto_id AND tausta_id IN(" . $tausta_idt . ") AND tausta_id != -1 AND alijakso = 1";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $osasto_idt[$i]);
				$values->execute();
				$s_a_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($s_a_tyojaksot); $j++) {
					$sp_maara += ($s_a_tyojaksot[$j]['s_p_maara'] + 1) * ($s_a_tyojaksot[$j]['tyomaara'] / 100);

					$sql = "SELECT hinta, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS tj_s_p_maara FROM sihteerikustannus WHERE alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm";
					$values = $con->prepare($sql);
					$values->bindParam(':alkupvm', $s_a_tyojaksot[$j]['jakso_alku']);
					$values->bindParam(':loppupvm', $s_a_tyojaksot[$j]['jakso_loppu']);
					$values->execute();
					while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
						if ($row['hinta'] != null || $row['hinta'] != "") {
							if ($s_a_tyojaksot[$j]['tausta_id'] != $sissi_perehdytys_tausta_id) {
								$sp_kustannukset += ($s_a_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_s_p_maara'] + 1) * $row['hinta']);
							} else {
								$sp_sissi_perehdytys_kustannukset += ($s_a_tyojaksot[$j]['tyomaara'] / 100) * (($row['tj_s_p_maara'] + 1) * $row['hinta']);
							}
						}
					}
				}

				$osasto_rivi['sihteerit'] = $sp_maara;
				$osasto_sihteeri_paivat_yhteensa += $osasto_rivi['sihteerit'];
				$osasto_rivi['s_kustannukset'] = $sp_kustannukset;
				$osasto_sihteeri_paiva_kustannukset_yhteensa += $osasto_rivi['s_kustannukset'];
				$sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa += $sp_sissi_perehdytys_kustannukset;

				array_push($osasto_tiedot, $osasto_rivi);
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM palvelualue WHERE id IN(" . $palvelualue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$palvelualue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['palvelualue_id'] == $row['id']) {
						$palvelualue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($palvelualue_osastot) > 0) {
					$palvelualue_osastot = substr($palvelualue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $palvelualue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);

				$varitiedot[$row['id']] = $row['vari_hex'];
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Taloudellinen raportti - Sihteerit"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien työvuorot ajalta " . $_POST['alkupvm'] . " - " . $_POST['loppupvm']), 0, 'L');
			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$rivimaara = count($sihteeritausta_tiedot) + 2;
			$rivikorkeus = 10;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
			}

			/**************** Taustoittain ******************/
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Tausta"), 1, 0, 'C');
			$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerit"), 1, 0, 'C');
			$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');

			$sihteeritausta_sihteeri_paiva_prosentti_yhteensa = 0;

			for ($i = 0; $i < count($sihteeritausta_tiedot); $i++) {
				$sihteeritausta_selite = $sihteeritausta_tiedot[$i]['selite'];
				$sihteeritausta_sihteeri_paivat = $sihteeritausta_tiedot[$i]['sihteerit'];
				$sihteeritausta_sihteeri_paiva_prosentti = 0;

				if ($sihteeritausta_sihteeri_paivat_yhteensa > 0) {
					$sihteeritausta_sihteeri_paiva_prosentti = round((($sihteeritausta_sihteeri_paivat / $sihteeritausta_sihteeri_paivat_yhteensa) * 100), 1);
					$sihteeritausta_sihteeri_paiva_prosentti_yhteensa += (($sihteeritausta_sihteeri_paivat / $sihteeritausta_sihteeri_paivat_yhteensa) * 100);
				}

				if ($_POST['tyhjat'] == 1 || ($_POST['tyhjat'] == 0 && $sihteeritausta_sihteeri_paivat > 0)) {
					if (strlen($sihteeritausta_selite) > '40') {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($sihteeritausta_selite, 0, 40) . "."), 1, 0);
					} else {
						$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_selite), 1, 0);
					}

					$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_sihteeri_paivat), 1, 0, 'C');
					$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_sihteeri_paiva_prosentti) . '%', 1, 1, 'C');
				}
			}

			$sihteeritausta_sihteeri_paiva_prosentti_yhteensa = round($sihteeritausta_sihteeri_paiva_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', $kirjainkoko);
			$pdf->Cell(80, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(17, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_sihteeri_paivat_yhteensa), 1, 0, 'C');
			$pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_sihteeri_paiva_prosentti_yhteensa) . '%', 1, 1, 'C');

			$pdf->SetFont('Helvetica', '', '10');
			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Osastot"), 1, 0, 'C');
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerit"), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 0, 'C');
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kustannus ") . chr(128), 1, 1, 'C'); //€

			$osasto_sihteeri_paiva_prosentti_yhteensa = 0;
			$osasto_paiva_kustannus_yhteensa = 0;

			for ($i = 0; $i < count($osasto_tiedot); $i++) {
				$osasto_selite = $osasto_tiedot[$i]['selite'];
				$osasto_palvelualue = $osasto_tiedot[$i]['palvelualue_id'];
				$osasto_sihteeri_paivat = $osasto_tiedot[$i]['sihteerit'];
				$osasto_sihteeri_paiva_prosentti = 0;
				$sp_sissi_perehdytys_osasto_kustannus = 0;
				$osasto_kustannus_rivi_yhteensa = 0;

				if ($osasto_sihteeri_paivat_yhteensa > 0) {
					$osasto_sihteeri_paiva_prosentti = round((($osasto_sihteeri_paivat / $osasto_sihteeri_paivat_yhteensa) * 100), 1);
					$osasto_sihteeri_paiva_prosentti_yhteensa += (($osasto_sihteeri_paivat / $osasto_sihteeri_paivat_yhteensa) * 100);
					$sp_sissi_perehdytys_osasto_kustannus = ($osasto_sihteeri_paivat / $osasto_sihteeri_paivat_yhteensa) * $sihteeri_paiva_sissi_perehdytys_kustannukset_yhteensa;
				}

				if (array_key_exists('s_kustannukset', $osasto_tiedot[$i])) {
					$osasto_kustannus_rivi_yhteensa = $osasto_tiedot[$i]['s_kustannukset'] + $sp_sissi_perehdytys_osasto_kustannus;
				}

				$osasto_paiva_kustannus_yhteensa += $osasto_kustannus_rivi_yhteensa;

				if ($_POST['tyhjat'] == 1 || ($_POST['tyhjat'] == 0 && $osasto_sihteeri_paivat > 0)) {
					if (array_key_exists($osasto_palvelualue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_palvelualue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);

						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L', true);
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
						}
					} else {
						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L');
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
						}
					}

					$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paivat), 1, 0, 'C');
					$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paiva_prosentti) . '%', 1, 0, 'C');
					$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_kustannus_rivi_yhteensa, 2, '.', '')), 1, 1, 'C');
				}
			}

			$osasto_sihteeri_paiva_prosentti_yhteensa = round($osasto_sihteeri_paiva_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', '10');
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paivat_yhteensa), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paiva_prosentti_yhteensa) . '%', 1, 0, 'C');
			$pdf->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', number_format($osasto_paiva_kustannus_yhteensa, 2, '.', '')), 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			$tiedostonimi = "Taloudellinen raportti - Sihteerit.pdf";
			$pdf->Output($tiedostonimi, 'D');
		} else if ($_POST['raporttityyppi'] == 7) { //Alijaksoraportti - Sihteerit
			//Sihteeritaustan tiedot
			$sihteeritausta_tiedot = array();
			$sihteeritaustaWhere = "";
			$sihteeritausta_idt = "";
			$sql = "SELECT id, selite, numero FROM tausta ORDER BY numero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sihteeritausta_rivi['id'] = $row['id'];
				$sihteeritausta_rivi['selite'] = $row['numero'] . " = " . $row['selite'];
				$sihteeritausta_idt .= ",'" . $row['id'] . "'";

				array_push($sihteeritausta_tiedot, $sihteeritausta_rivi);
			}

			if (strlen($sihteeritausta_idt) > 0) {
				$sihteeritausta_idt = substr($sihteeritausta_idt, 1);
			}

			$sihteeritaustaWhere = " AND tausta_id IN(" . $sihteeritausta_idt . ")";

			//Alijaksotausta
			$alijaksotausta_tietorivit = array();
			$alku_kuukausi = intval(substr($_POST['alkupvm'], 3, 2));
			$alku_vuosi = intval(substr($_POST['alkupvm'], 6, 4));
			$loppu_kuukausi = intval(substr($_POST['loppupvm'], 3, 2));
			$loppu_vuosi = intval(substr($_POST['loppupvm'], 6, 4));
			$kasiteltava_kuukausi = $alku_kuukausi;
			$kasiteltava_vuosi = $alku_vuosi;
			$kasiteltava_alku_pvm = "";
			$kasiteltava_loppu_pvm = "";
			$kasiteltava_kuukausi_arvo = "";
			$valmis = false;

			while (!$valmis) {
				$kasiteltava_kuukausi_arvo = $kasiteltava_kuukausi;
				if ($kasiteltava_kuukausi_arvo <= 9) {
					$kasiteltava_kuukausi_arvo = "0" . $kasiteltava_kuukausi_arvo;
				}

				$kasiteltava_alku_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-01";
				$kasiteltava_pvm = new DateTime($kasiteltava_alku_pvm);
				$kasiteltava_loppu_pvm = $kasiteltava_vuosi . "-" . $kasiteltava_kuukausi_arvo . "-" . $kasiteltava_pvm->format("t");
				$loytyi = false;

				$sql = "SELECT tausta_id, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ") 
				AND osasto_id IN (" . $osastojen_idt . ")" . $sihteeritaustaWhere . " AND alijakso = 1 ORDER BY (SELECT numero FROM tausta WHERE id = tausta_id) ASC, alku_pvm ASC";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $kasiteltava_alku_pvm);
				$values->bindParam(':loppupvm', $kasiteltava_loppu_pvm);
				$values->execute();
				while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
					$loytyi = true;
					$alijaksotausta_rivi['sihteeritausta_id'] = $row['tausta_id'];
					$alijaksotausta_rivi['p_maara'] = ($row['p_maara'] + 1) * ($row['tyomaara'] / 100);
					$alijaksotausta_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$alijaksotausta_rivi['vuosi'] = $kasiteltava_vuosi;

					array_push($alijaksotausta_tietorivit, $alijaksotausta_rivi);
				}

				if (!$loytyi) {
					$alijaksotausta_rivi['sihteeritausta_id'] = -1;
					$alijaksotausta_rivi['p_maara'] = 0;
					$alijaksotausta_rivi['kuukausi'] = $kasiteltava_kuukausi;
					$alijaksotausta_rivi['vuosi'] = $kasiteltava_vuosi;
					array_push($alijaksotausta_tietorivit, $alijaksotausta_rivi);
				}

				if ($kasiteltava_kuukausi == $loppu_kuukausi && $kasiteltava_vuosi == $loppu_vuosi) {
					$valmis = true;
				}

				$kasiteltava_kuukausi++;

				if ($kasiteltava_kuukausi > 12) {
					$kasiteltava_kuukausi = 1;
					$kasiteltava_vuosi++;
				}
			}

			//Hae kaikki osasto id:t
			$osasto_raportti_idt = "";
			$osastovalintaWhere = "";

			$sql = "SELECT id FROM osasto WHERE id IN(" . $osastojen_idt . ") ORDER BY palvelualue_id, raporttinumero";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$osasto_raportti_idt .= ",'" . $row['id'] . "'";
			}

			if (strlen($osasto_raportti_idt) > 0) {
				$osasto_raportti_idt = substr($osasto_raportti_idt, 1);
			}

			$osastovalintaWhere = " AND osasto_id IN(" . $osasto_raportti_idt . ")";

			/***************** Osastojen mukaan ***************/
			$osasto_idt = explode(',', str_replace('\'', '', $_POST['osasto_idt']));
			$osasto_tiedot = array();
			$osasto_sihteeri_paivat_yhteensa = 0;

			for ($i = 0; $i < count($osasto_idt); $i++) {
				$osasto_rivi = array();

				//Osasto selite
				$sql = "SELECT raporttinumero, nimi, lyhenne, palvelualue_id FROM osasto WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':id', $osasto_idt[$i]);
				$values->execute();
				$row = $values->fetch(PDO::FETCH_ASSOC);
				$osasto_rivi['selite'] = $row['raporttinumero'] . " " . $row['nimi'];
				$osasto_rivi['palvelualue_id'] = $row['palvelualue_id'];
				$osasto_rivi['lyhenne'] = $row['lyhenne'];

				$sp_maara = 0;
				$sp_kustannukset = 0;
				$s_tyojaksot = array();
				$s_a_tyojaksot = array();

				//Kaikki sihteerit (alijakso)
				$sql = "SELECT CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END AS aloitus, CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END AS lopetus, DATEDIFF(CASE WHEN (loppu_pvm < :loppupvm) THEN loppu_pvm ELSE :loppupvm END,CASE WHEN (alku_pvm > :alkupvm) THEN alku_pvm ELSE :alkupvm END) AS s_p_maara, (SELECT prosentti FROM tyomaara WHERE id = tyomaara_id) AS tyomaara FROM sihteerityojakso WHERE (alku_pvm <= :loppupvm AND loppu_pvm >= :alkupvm) AND sihteeri_id IN(" . $henkilo_idt . ") AND osasto_id = :osasto_id" . $sihteeritaustaWhere . " AND tausta_id != -1 AND alijakso = 1";
				$values = $con->prepare($sql);
				$values->bindParam(':alkupvm', $alkupvm);
				$values->bindParam(':loppupvm', $loppupvm);
				$values->bindParam(':osasto_id', $osasto_idt[$i]);
				$values->execute();
				$s_a_tyojaksot = $values->fetchAll(PDO::FETCH_ASSOC);
				for ($j = 0; $j < count($s_a_tyojaksot); $j++) {
					$sp_maara += ($s_a_tyojaksot[$j]['s_p_maara'] + 1) * ($s_a_tyojaksot[$j]['tyomaara'] / 100);
				}

				$osasto_rivi['sihteerit'] = $sp_maara;
				$osasto_sihteeri_paivat_yhteensa += $osasto_rivi['sihteerit'];

				array_push($osasto_tiedot, $osasto_rivi);
			}

			/************** Raportin otsikko teksti *********************/
			$otsikko_tiedot = array();
			$varitiedot = array();

			$sql = "SELECT id, nimi, vari_hex FROM palvelualue WHERE id IN(" . $palvelualue_idt . ")";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$palvelualue_osastot = "";
				for ($i = 0; $i < count($osasto_tiedot); $i++) {
					if ($osasto_tiedot[$i]['palvelualue_id'] == $row['id']) {
						$palvelualue_osastot .= ", " . $osasto_tiedot[$i]['lyhenne'];
					}
				}
				if (strlen($palvelualue_osastot) > 0) {
					$palvelualue_osastot = substr($palvelualue_osastot, 2);
				}
				$otsikko_rivi['nimi'] = $row['nimi'];
				$otsikko_rivi['osastot'] = $palvelualue_osastot;
				array_push($otsikko_tiedot, $otsikko_rivi);

				$varitiedot[$row['id']] = $row['vari_hex'];
			}

			//Sulje yhteys
			$con = null;
			$values = null;

			//Arvot
			$alijaksotausta_tiedot = array();
			for ($i = 0; $i < count($alijaksotausta_tietorivit); $i++) {
				$vuosi_kuukausi = $alijaksotausta_tietorivit[$i]['vuosi'] . "-" . $alijaksotausta_tietorivit[$i]['kuukausi'];
				$sihteeritausta_id = $alijaksotausta_tietorivit[$i]['sihteeritausta_id'];

				if (!array_key_exists($vuosi_kuukausi, $alijaksotausta_tiedot)) {
					$alijaksotausta_tiedot[$vuosi_kuukausi]['maara'] = 0;
					$alijaksotausta_tiedot[$vuosi_kuukausi]['maara'] += $alijaksotausta_tietorivit[$i]['p_maara'];
				} else {
					$alijaksotausta_tiedot[$vuosi_kuukausi]['maara'] += $alijaksotausta_tietorivit[$i]['p_maara'];
				}

				if (!array_key_exists($sihteeritausta_id, $alijaksotausta_tiedot[$vuosi_kuukausi])) {
					$alijaksotausta_tiedot[$vuosi_kuukausi][$sihteeritausta_id] = 0;
					$alijaksotausta_tiedot[$vuosi_kuukausi][$sihteeritausta_id] += $alijaksotausta_tietorivit[$i]['p_maara'];
				} else {
					$alijaksotausta_tiedot[$vuosi_kuukausi][$sihteeritausta_id] += $alijaksotausta_tietorivit[$i]['p_maara'];
				}
			}

			/*************** Alijaksotaustaraportti **************/
			$alku = substr($alkupvm, 8, 2) . "." . substr($alkupvm, 5, 2) . "." . substr($alkupvm, 0, 4);
			$loppu = substr($loppupvm, 8, 2) . "." . substr($loppupvm, 5, 2) . "." . substr($loppupvm, 0, 4);

			//PDF luonti
			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Alijaksotausta raportti"), 0, 1);
			$pdf->SetFont('Helvetica', 'B', '14');
			$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerien alijaksot ajalta " . $alku . " - " . $loppu), 0, 'L');
			$pdf->SetY($pdf->GetY() + 5);
			for ($i = 0; $i < count($otsikko_tiedot); $i++) {
				$pdf->SetFont('Helvetica', 'B', '12');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['nimi']), 0, 'L');
				$pdf->SetFont('Helvetica', '', '10');
				$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $otsikko_tiedot[$i]['osastot']), 0, 'L');
			}
			$pdf->SetY($pdf->GetY() + 5);
			$otsikkoY = $pdf->GetY();
			$otsikkoX = $pdf->GetX();
			$rivimaara = count($sihteeritausta_tiedot) + 2;
			$rivikorkeus = 10;
			$kirjainkoko = 10;
			if (($otsikkoY + $rivimaara * 10) > 275) {
				$pdf->Addpage();
				$pdf->SetY($pdf->GetY() + 5);
				$otsikkoY = $pdf->GetY();
				$otsikkoX = $pdf->GetX();
			}
			$pdf->SetFont('Helvetica', '', '8');
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Tausta"), 1, 2, 'L');
			for ($i = 0; $i < count($sihteeritausta_tiedot); $i++) {
				$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_tiedot[$i]['selite']), 1, 2, 'L'); //265, 95 + 17*10 = 265
			}
			$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
			$pdf->SetY($otsikkoY);
			$pdf->SetX($otsikkoX + 55);
			$x_rivimaara = 0;
			$edellinen_vuosi = '';
			foreach ($alijaksotausta_tiedot as $vuosi_kuukausi => $tiedot) {
				if ($x_rivimaara == 7) {
					$pdf->AddPage();
					$pdf->SetY($pdf->GetY() + 10);
					$otsikkoY = $pdf->GetY();
					$otsikkoX = $pdf->GetX();
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Tausta"), 1, 2, 'L');

					for ($i = 0; $i < count($sihteeritausta_tiedot); $i++) {
						$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_tiedot[$i]['selite']), 1, 2, 'L');
					}
					$pdf->Cell(55, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 2, 'L');
					$pdf->SetY($otsikkoY);
					$pdf->SetX($otsikkoX + 55);
					$x_rivimaara = 0;
				}

				$otsikkoX = $pdf->GetX() + 20;
				$vuosi_kuukausi_tiedot = explode('-', $vuosi_kuukausi);
				$vuosi = $vuosi_kuukausi_tiedot[0];
				$kuukausi = $vuosi_kuukausi_tiedot[1];

				if ($edellinen_vuosi != $vuosi) {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi . " (" . $vuosi . ")"), 1, 2, 'C');
					$edellinen_vuosi = $vuosi;
				} else {
					$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $kuukausi), 1, 2, 'C');
				}
				$vuosi_kuukausi_prosentti = 0;

				for ($i = 0; $i < count($sihteeritausta_tiedot); $i++) {
					$sihteeritausta_id = $sihteeritausta_tiedot[$i]['id'];
					$sihteeritausta_yhteensa = 0;
					$vuosi_kuukausi_yhteensa = 0;

					if (array_key_exists($sihteeritausta_id, $tiedot)) {
						$sihteeritausta_yhteensa = $tiedot[$sihteeritausta_id];
					}
					if (array_key_exists($vuosi_kuukausi, $alijaksotausta_tiedot)) {
						$vuosi_kuukausi_yhteensa = $alijaksotausta_tiedot[$vuosi_kuukausi]['maara'];
					}

					$sihteeritausta_prosentti = 0;

					if ($vuosi_kuukausi_yhteensa > 0) {
						$sihteeritausta_prosentti = round((($sihteeritausta_yhteensa / $vuosi_kuukausi_yhteensa) * 100), 1);
						$vuosi_kuukausi_prosentti += $sihteeritausta_prosentti;
					}

					if (array_key_exists($sihteeritausta_id, $tiedot)) {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sihteeritausta_prosentti . "%"), 1, 2, 'C'); //lkm $tiedot[$sihteeritausta_id]
					} else {
						$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "0%"), 1, 2, 'C');
					}
				}

				$vuosi_kuukausi_prosentti = round($vuosi_kuukausi_prosentti, 0);
				$pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $vuosi_kuukausi_prosentti . "%"), 1, 2, 'C'); //lkm $alijaksotausta_tiedot[$vuosi_kuukausi]['maara']
				$pdf->SetY($otsikkoY);
				$pdf->SetX($otsikkoX);
				$x_rivimaara++;
			}

			$pdf->SetFont('Helvetica', '', '10');
			$pdf->Addpage();
			$pdf->SetY($pdf->GetY() + 5);

			/**************** Osastoittain ******************/
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Osastot"), 1, 0, 'C');
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Sihteerit"), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "%"), 1, 1, 'C');

			$osasto_sihteeri_paiva_prosentti_yhteensa = 0;

			for ($i = 0; $i < count($osasto_tiedot); $i++) {
				$osasto_selite = $osasto_tiedot[$i]['selite'];
				$osasto_palvelualue = $osasto_tiedot[$i]['palvelualue_id'];
				$osasto_sihteeri_paivat = $osasto_tiedot[$i]['sihteerit'];
				$osasto_sihteeri_paiva_prosentti = 0;

				if ($osasto_sihteeri_paivat_yhteensa > 0) {
					$osasto_sihteeri_paiva_prosentti = round((($osasto_sihteeri_paivat / $osasto_sihteeri_paivat_yhteensa) * 100), 1);
					$osasto_sihteeri_paiva_prosentti_yhteensa += (($osasto_sihteeri_paivat / $osasto_sihteeri_paivat_yhteensa) * 100);
				}

				if ($osasto_sihteeri_paivat > 0) {
					if (array_key_exists($osasto_palvelualue, $varitiedot)) {
						$varihex = substr($varitiedot[$osasto_palvelualue], 1);
						$r = hexdec(substr($varihex, 0, 2));
						$g = hexdec(substr($varihex, 2, 2));
						$b = hexdec(substr($varihex, 4, 2));
						$pdf->SetFillColor($r, $g, $b);

						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L', true);
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L', true);
						}
					} else {
						if (strlen($osasto_selite) > '40') {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', substr($osasto_selite, 0, 40) . "."), 1, 0, 'L');
						} else {
							$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_selite), 1, 0, 'L');
						}
					}

					$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paivat), 1, 0, 'C');
					$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paiva_prosentti) . '%', 1, 1, 'C');
				}
			}

			$osasto_sihteeri_paiva_prosentti_yhteensa = round($osasto_sihteeri_paiva_prosentti_yhteensa, 0);

			$pdf->SetFont('Helvetica', 'B', '10');
			$pdf->Cell(70, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä:"), 1, 0);
			$pdf->Cell(17, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paivat_yhteensa), 1, 0, 'C');
			$pdf->Cell(12, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $osasto_sihteeri_paiva_prosentti_yhteensa) . '%', 1, 1, 'C');

			/*************** PDF Tallenus tiedostoksi ******************/
			$tiedostonimi = "Alijaksoraportti - Sihteerit.pdf";
			$pdf->Output($tiedostonimi, 'D');
		}
	} catch (PDOException $e) {
		$con = null;
		$values = null;
		echo "Virhe: Tietokantavirhe" . $e->getMessage();
	}
} else {
	echo "Virhe: parametri";
}
