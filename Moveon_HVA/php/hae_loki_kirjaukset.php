<?php

include_once '../config/config.php';

if(isset($_POST['nakyma'])
&& isset($_POST['tapahtumat'])
&& isset($_POST['kayttajat'])
&& isset($_POST['alkupvm'])
&& isset($_POST['loppupvm']))
{
	try
	{
		$return_arr = array();
		$tapahtumaWhere = "";
		$pvmWhere = "";
		$kayttajaWhere = "";
		$tunnistehakuWhere = "";
		$tietohakuWhere = "";
		$rivimaara = 0;
		
		if($_POST['tapahtumat'] != "") {
			$tapahtumaWhere = " AND tapahtuma IN(" . $_POST['tapahtumat'] . ")";
		}
		
		if($_POST['kayttajat'] != "") {
			$kayttajaWhere = " AND kayttaja = '" . $_POST['kayttajat'] . "'";
		}

		$alku_pvm = substr($_POST['alkupvm'], 6, 4) . "-" . substr($_POST['alkupvm'], 3, 2) . "-" . substr($_POST['alkupvm'], 0, 2);
		$loppu_pvm = substr($_POST['loppupvm'], 6, 4) . "-" . substr($_POST['loppupvm'], 3, 2) . "-" . substr($_POST['loppupvm'], 0, 2);
		
		if($_POST['alkupvm'] != '' && $_POST['loppupvm'] != '') {
			$pvmWhere = " AND (DATE(aikaleima) <= '" . $loppu_pvm . "' AND DATE(aikaleima) >= '" . $alku_pvm . "')";
		}
		else if($_POST['alkupvm'] != '') {
			$pvmWhere = " AND ((DATE(aikaleima) <= '" . $alku_pvm . "' AND DATE(aikaleima) >= '" . $alku_pvm . "') OR DATE(aikaleima) >= '" . $alku_pvm . "')";
		}
		else if($_POST['loppupvm'] != '') {
			$pvmWhere = " AND ((DATE(aikaleima) <= '" . $loppu_pvm . "' AND DATE(aikaleima) >= '" . $loppu_pvm . "') OR DATE(aikaleima) <= '" . $loppu_pvm . "')";
		}
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT id, date_format(aikaleima,'%d.%m.%Y %H:%i:%s') AS aika, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto FROM lokitapahtuma WHERE nakyma = :nakyma" . $tapahtumaWhere . $kayttajaWhere . $pvmWhere . " ORDER BY aikaleima DESC";
		$values = $con->prepare($sql);
		$values->bindParam(':nakyma', $_POST['nakyma']);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id'];
			$row_array['aika'] = $row['aika'];
			$row_array['nakyma'] = $row['nakyma'];
			$row_array['kayttaja'] = $row['kayttaja'];
			$row_array['tapahtuma'] = $row['tapahtuma'];
			$row_array['tunniste'] = $row['tunniste'];
			$row_array['edellinen_tieto'] = $row['edellinen_tieto'];
			$row_array['tieto'] = $row['tieto'];
			array_push($return_arr,$row_array);
			
			$rivimaara++;
		}
		
		array_unshift($return_arr,$rivimaara);
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>