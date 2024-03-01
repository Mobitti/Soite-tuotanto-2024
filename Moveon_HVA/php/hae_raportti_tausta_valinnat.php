<?php

include_once '../config/config.php';

if(isset($_POST['raporttityyppi']))
{
	try
	{
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		if($_POST['raporttityyppi'] > 2 && $_POST['raporttityyppi'] < 6) {
			$sql = "SELECT id, selite, numero FROM reservitausta ORDER BY numero";
		}
		else {
            $sql = "SELECT id, selite, numero FROM tausta ORDER BY numero";
		}
		$values = $con->prepare($sql);
		$values->execute();
		
		while($row = $values->fetch(PDO::FETCH_ASSOC)) 
		{
			$row_array['id'] = $row['id'];
			$row_array['nimi'] = $row['numero'] . " - " . $row['selite'];
			
			array_push($return_arr,$row_array);
        }

        if($_POST['raporttityyppi'] < 3 || $_POST['raporttityyppi'] == 11) {
            $row_array['id'] = 0;
            $row_array['nimi'] = "0000-0004, /, *, 5, K";
            array_unshift($return_arr,$row_array);
        }
        else if($_POST['raporttityyppi'] > 5 && $_POST['raporttityyppi'] < 9) {
            $row_array['id'] = -1;
            $row_array['nimi'] = "Vakituinen";
            array_unshift($return_arr,$row_array);
        }
		
		$con=null; $values=null;
		echo json_encode($return_arr);
	}  
	catch(PDOException $e)
	{
		echo "Tietokantavirhe: " . $e->getMessage();
	}
}
?>