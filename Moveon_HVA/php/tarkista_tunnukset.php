<?php

include_once '../config/config.php';

if(isset($_POST['tunnus']) && isset($_POST['salasana']))
{
	try
	{
		$return_arr = array();
		$kayttaja_id = "";
		$toimialue_idt = "";
		$nakyma_idt = "";
		$sijaisuustausta_idt = "";
			
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT id FROM kayttaja WHERE tunnus = :tunnus AND salasana = MD5(:salasana)";
		$values = $con->prepare($sql);
		$values->bindParam(':tunnus', $_POST['tunnus']);
		$values->bindParam(':salasana', $_POST['salasana']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		
		if($row != null) {
			$kayttaja_id = $row['id'];
			
			$sql = "SELECT nakyma_id FROM kayttajanakyma WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$nakyma_idt .= "," . $row['nakyma_id']; 
			}
			if(strlen($nakyma_idt) > 0) {
				$nakyma_idt = substr($nakyma_idt,1);
			}
			$row_array['nakyma_idt'] = $nakyma_idt;
			
			$sql = "SELECT sijaisuustausta_id FROM kayttajasijaisuustausta WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$sijaisuustausta_idt .= "," . $row['sijaisuustausta_id']; 
			}
			if(strlen($sijaisuustausta_idt) > 0) {
				$sijaisuustausta_idt = substr($sijaisuustausta_idt,1);
			}
			$row_array['sijaisuustausta_idt'] = $sijaisuustausta_idt;
			
			$sql = "SELECT toimialue_id FROM kayttajatoimialue WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			while ($row = $values->fetch(PDO::FETCH_ASSOC))
			{
				$toimialue_idt .= ",'" . $row['toimialue_id'] . "'"; 
			}
			if(strlen($toimialue_idt) > 0) {
				$toimialue_idt = substr($toimialue_idt,1);
			}
			$row_array['toimialue_idt'] = $toimialue_idt;
			$row_array['kayttaja_id'] = $kayttaja_id;
			
			array_push($return_arr,$row_array);
		}
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