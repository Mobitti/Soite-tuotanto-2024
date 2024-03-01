<?php

include_once '../config/config.php';

if(isset($_POST['matka_id']))
{
	try
	{
		$data_array = array();
		$tiedot = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT m.id, m.pvm, m.vuoro_id, m.matka, m.selite, m.lahtoaika, m.paluuaika, m.km, m.tila, v.vuorotyyppi, (SELECT nimi FROM osasto WHERE id = v.osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = v.tausta_id) AS tausta FROM matka m LEFT JOIN vuoro v ON m.vuoro_id = v.id WHERE m.id = :id";
		$values = $con->prepare($sql);		
		$values->bindParam(':id', $_POST['matka_id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$row_array['id']	= $row['id'];
            $row_array['pvm'] =  substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4);
            if($row['osasto'] != null) {
                $osasto = $row['osasto'];
            }
            else {
                $osasto = "Ei osastoa";
            }

            if($row['tausta'] != null) {
                $tausta = $row['tausta'];
            }
            else {
                $tausta = "Ei taustaa";
            }
			$row_array['vuoro'] = substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4) . " - " . $row['vuorotyyppi'] . ", " . $osasto . ", " . $tausta;
            $row_array['vuoro_id'] = $row['vuoro_id'];
			$row_array['matka'] = $row['matka'];
			$row_array['selite'] = $row['selite'];
            $row_array['lahtoaika'] = substr($row['lahtoaika'],0,5);
            $row_array['paluuaika'] = substr($row['paluuaika'],0,5);
            $row_array['km'] = $row['km'];
            $row_array['tila'] = $row['tila'];

			array_push($data_array,$row_array);
		}
		
		$con=null; $values=null;
		echo json_encode($data_array);
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