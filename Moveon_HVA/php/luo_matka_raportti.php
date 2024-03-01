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

        $alku_pvm = "";
        $loppu_pvm = "";
        if ($_POST['alkupvm'] != "") {
            $alku_pvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
        }
        if ($_POST['loppupvm'] != "") {
            $loppu_pvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
        }

        $pvmWhere = "";
        $pvm_otsikko = " - Kaikki matkat";
        if ($_POST['alkupvm'] != '' && $_POST['loppupvm'] != '') {
            $pvmWhere = " AND (pvm <= '" . $loppu_pvm . "' AND pvm >= '" . $alku_pvm . "')";
            $pvm_otsikko = ", " . $_POST['alkupvm'] . " - " . $_POST['loppupvm'];
        } else if ($_POST['alkupvm'] != '') {
            $pvmWhere = " AND (pvm >= '" . $alku_pvm . "')";
            $pvm_otsikko = ", matkat alkaen " . $_POST['alkupvm'];
        } else if ($_POST['loppupvm'] != '') {
            $pvmWhere = " AND (pvm <= '" . $loppu_pvm . "')";
            $pvm_otsikko = ",  matkat " . $_POST['loppupvm'] . " asti";
        }

        $con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $con->query('SET NAMES utf8');

        $sql = "SELECT nimi FROM sijainen WHERE id = :sijainen_id";
        $values = $con->prepare($sql);
        $values->bindParam(':sijainen_id', $_POST['sijainen_id']);
        $values->execute();
        $sijaisen_tiedot = $values->fetchAll(PDO::FETCH_ASSOC);

        $sql = "SELECT id, pvm, (SELECT vuorotyyppi FROM vuoro WHERE id = vuoro_id) AS vuoro, matka, selite, lahtoaika, paluuaika, km FROM matka WHERE sijainen_id = :sijainen_id AND tila = 3" . $pvmWhere . " ORDER BY pvm ASC";
        $values = $con->prepare($sql);
        $values->bindParam(':sijainen_id', $_POST['sijainen_id']);
        $values->execute();
        $matkatiedot = $values->fetchAll(PDO::FETCH_ASSOC);

        $kuukausi = "";
        switch ($_POST['kuukausi']) {
            case 1:
                $kuukausi = "Tammikuu";
                break;
            case 2:
                $kuukausi = "Helmikuu";
                break;
            case 3:
                $kuukausi = "Maaliskuu";
                break;
            case 4:
                $kuukausi = "Huhtikuu";
                break;
            case 5:
                $kuukausi = "Toukokuu";
                break;
            case 6:
                $kuukausi = "Kesäkuu";
                break;
            case 7:
                $kuukausi = "Heinäkuu";
                break;
            case 8:
                $kuukausi = "Elokuu";
                break;
            case 9:
                $kuukausi = "Syyskuu";
                break;
            case 10:
                $kuukausi = "Lokakuu";
                break;
            case 11:
                $kuukausi = "Marraskuu";
                break;
            case 12:
                $kuukausi = "Joulukuu";
                break;
        }

        $km_yhteensa = 0;
        $rivikorkeus = 10;




        //PDF luonti
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Helvetica', 'B', '18');
        $pdf->Cell(10, 10, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $sijaisen_tiedot[0]['nimi'] . $pvm_otsikko), 0, 1);
        $pdf->SetY($pdf->GetY() + 5);

        $pdf->SetFont('Helvetica', 'B', '12');
        $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Pvm"), 1, 0, 'C');
        $pdf->Cell(125, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Matka / Selite"), 1, 0, 'C');
        $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Lähtö"), 1, 0, 'C');
        $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Paluu"), 1, 0, 'C');
        $pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Km"), 1, 1, 'C');

        $pdf->SetFont('Helvetica', '', '10');
        for ($i = 0; $i < count($matkatiedot); $i++) {
            $pvm = substr($matkatiedot[$i]['pvm'], 8, 2) . "." . substr($matkatiedot[$i]['pvm'], 5, 2); // . "." . substr($matkatiedot[$i]['pvm'], 0, 4);
            $matka = $matkatiedot[$i]['matka'];
            $selite = $matkatiedot[$i]['selite'];
            $matkaselite = $matka;
            $lahtoaika = substr($matkatiedot[$i]['lahtoaika'], 0, 5);
            $paluuaika = substr($matkatiedot[$i]['paluuaika'], 0, 5);
            $km = $matkatiedot[$i]['km'];
            $km_yhteensa += $km;


            if ($selite === "") {
                $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $pvm), 1, 0, 'C');
                $pdf->SetFont('Helvetica', '', '8');
                $pdf->Cell(125, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $matkaselite), 1, 0, 'C');
                $pdf->SetFont('Helvetica', '', '10');
                $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $lahtoaika), 1, 0, 'C');
                $pdf->Cell(15, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $paluuaika), 1, 0, 'C');
                $pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $km . ' km'), 1, 1, 'C');
            } else {
                if (strlen($selite) > 90) {
                    $selite = substr($selite, 0, 90) . "...";
                }
                $matkaselite .= "\n" . $selite;
                $pdf->Cell(15, 2 * $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $pvm), 1, 0, 'C');
                $pdf->SetFont('Helvetica', '', '8');
                $y = $pdf->GetY();
                $x = $pdf->GetX();
                $pdf->MultiCell(125, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $matkaselite), 1, 'C');
                $pdf->SetFont('Helvetica', '', '10');
                $pdf->SetXY($x + 125, $y);
                $pdf->Cell(15, 2 * $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $lahtoaika), 1, 0, 'C');
                $pdf->Cell(15, 2 * $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $paluuaika), 1, 0, 'C');
                $pdf->Cell(20, 2 * $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $km . ' km'), 1, 1, 'C');
            }
        }

        $pdf->SetFont('Helvetica', 'B', '11');
        $pdf->Cell(170, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', "Yhteensä"), 1, 0, 'R');
        $pdf->Cell(20, $rivikorkeus, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $km_yhteensa) . ' km', 1, 1, 'C');

        $tiedostonimi = "Matkaraportti.pdf";
        $pdf->Output($tiedostonimi, 'D');
    } catch (PDOException $e) {
        $con = null;
        $values = null;
        echo "Virhe: Tietokantavirhe" . $e->getMessage();
    }
} else {
    echo "Virhe: parametri";
}
