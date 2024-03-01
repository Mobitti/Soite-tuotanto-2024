<?php
include_once '../config/config.php';
require '../fpdf/fpdf.php';

if (isset($_POST['raporttityyppi'])) {
	try {
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');


		if ($_POST['raporttityyppi'] == 12) {
			$sijaisten_tiedot = array();

			$sql = "SELECT pin, nimi, aktiivinen FROM sijainen WHERE pin IS NOT NULL ORDER BY aktiivinen DESC, nimi";
			$values = $con->prepare($sql);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC)) {
				$sijainentieto_rivi['pin'] = $row['pin'];
				$sijainentieto_rivi['nimi'] = $row['nimi'];
				$sijainentieto_rivi['aktiivinen'] = $row['aktiivinen'];

				array_push($sijaisten_tiedot, $sijainentieto_rivi);
			}
			$con = null;
			$values = null;

			$pdf = new FPDF();
			$pdf->AddPage();
			$pdf->SetFont('Helvetica', 'B', '18');
			$pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Pin-koodi raportti'), 0, 1);
			$pdf->SetY($pdf->GetY() + 5);
			$pdf->SetFont('Helvetica', 'B', '12');
			$pdf->Cell(100, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Nimi"), 1, 0, 'L');
			$pdf->Cell(50, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Pin-koodi"), 1, 0, 'L');
			$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Aktiivinen"), 1, 1, 'L');

			for ($i = 0; $i < count($sijaisten_tiedot); $i++) {
				$pdf->Cell(100, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisten_tiedot[$i]['nimi']), 1, 0, 'L');
				$pdf->Cell(50, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisten_tiedot[$i]['pin']), 1, 0, 'L');
				if ($sijaisten_tiedot[$i]['aktiivinen'] == 1) {
					$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Kyllä"), 1, 1, 'L');
				} else {
					$pdf->Cell(25, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Ei"), 1, 1, 'L');
				}
			}

			$tiedostonimi = utf8_decode("Pin-koodi raportti.pdf");
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
