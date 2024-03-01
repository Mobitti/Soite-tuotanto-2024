<?php

include_once '../config/config.php';

if(isset($_POST['id']))
{	
	try
	{	
		$return_arr = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
	
		$sql = "SELECT raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku FROM vuoro WHERE id = :id";
		$values = $con->prepare($sql);
		$values->bindParam(':id', $_POST['id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			$row_array['osasto_id'] = $row['osasto_id'];
			$row_array['raportti_osasto_id'] = $row['raportti_osasto_id'];
			$row_array['tausta_id'] = $row['tausta_id'];
			$row_array['tausta_kommentti'] = $row['tausta_kommentti'];
			$row_array['luku'] = $row['luku'];
			
			array_push($return_arr,$row_array);
		}
		
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