<?php

include_once '../config/config.php';

if(isset($_POST['sijainen_id'])
&& isset($_POST['tilat'])
&& isset($_POST['jarjestettavaarvo'])
&& isset($_POST['jarjestys']))
{	
	try
	{
		$return_arr = array();
		$matkat = array();
		$jarjestysarvo = "";
        $pvmWhere = "";
        $tilaWhere = "";
		$matkamaara = 0;
		$km_yht = 0;
		$haettavaarvo = strtolower($_POST['haettavaarvo']);
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT SUM(km) AS km_yht FROM matka WHERE sijainen_id = :sijainen_id AND tila = 3 AND YEAR(pvm) = :vuosi";
		$values = $con->prepare($sql);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->bindParam(':vuosi', date("Y"));
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			if($row['km_yht'] != null) {
				$km_yht = $row['km_yht'];
			}
		}
		        
        $tilaWhere = "'" . implode("','",$_POST['tilat']) . "'";
		
		switch($_POST['jarjestettavaarvo'])
		{		
			case 'pvm': $jarjestysarvo = "m.pvm"; break;
			case 'vuoro': $jarjestysarvo = "v.vuorotyyppi"; break;
		    case 'matka': $jarjestysarvo = "m.matka"; break;
			case 'selite': $jarjestysarvo = "m.selite"; break;
			case 'lahtoaika': $jarjestysarvo = "m.lahtoaika"; break;
			case 'paluuaika': $jarjestysarvo = "m.paluuaika"; break;
			case 'km': $jarjestysarvo = "m.km"; break;	
		}
				
		$sql = "SELECT m.id, m.pvm, m.vuoro_id, m.matka, m.selite, m.lahtoaika, m.paluuaika, m.km, m.tila, v.vuorotyyppi, (SELECT lyhenne FROM osasto WHERE id = v.osasto_id) AS osasto FROM matka m LEFT JOIN vuoro v ON m.vuoro_id = v.id WHERE m.sijainen_id = :sijainen_id AND m.tila IN(" . $tilaWhere . ") ORDER BY " . $jarjestysarvo . " " . $_POST['jarjestys'];
		$values = $con->prepare($sql);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
            $matkamaara++;
			$row_array['id'] = $row['id'];
			$row_array['pvm'] =  substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4); 
			$row_array['vuorotyyppi'] = $row['vuorotyyppi'];
			$row_array['osasto'] = $row['osasto'];
			$row_array['matka'] = $row['matka'];
			$row_array['selite'] = $row['selite'];
			$row_array['lahtoaika'] = substr($row['lahtoaika'],0,5);
            $row_array['paluuaika'] = substr($row['paluuaika'],0,5);
            $row_array['km'] = $row['km'];
            $row_array['tila'] = $row['tila'];
			
			array_push($matkat,$row_array);
        }

		$return_arr['matkamaara'] = $matkamaara;
		$return_arr['matkat'] = $matkat;
		$return_arr['km_yht'] = $km_yht;
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		$con=null; $values=null;
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
else {
	echo "parametri";
}
?>