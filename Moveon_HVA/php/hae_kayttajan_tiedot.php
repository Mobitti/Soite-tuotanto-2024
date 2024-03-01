<?php

include_once '../config/config.php';

if(isset($_POST['kayttaja_id']))
{
	try
	{
		$data_array = array();
		$tiedot = array();
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');

		$sql = "SELECT tunnus, 
		(SELECT GROUP_CONCAT((SELECT id FROM nakyma WHERE id = nakyma_id) ORDER BY (SELECT nimi FROM nakyma WHERE id = nakyma_id) SEPARATOR ',') FROM kayttajanakyma WHERE kayttaja_id = kayttaja.id) AS nakyma_idt,
		(SELECT GROUP_CONCAT((SELECT id FROM tausta WHERE id = sijaisuustausta_id) ORDER BY (SELECT numero FROM tausta WHERE id = sijaisuustausta_id) SEPARATOR ',') FROM kayttajasijaisuustausta WHERE kayttaja_id = kayttaja.id) AS sijaisuustausta_idt,
		(SELECT GROUP_CONCAT((SELECT id FROM toimialue WHERE id = toimialue_id) ORDER BY (SELECT id FROM toimialue WHERE id = toimialue_id) SEPARATOR ',') FROM kayttajatoimialue WHERE kayttaja_id = kayttaja.id) AS toimialue_idt FROM kayttaja WHERE id = :id";
		$values = $con->prepare($sql);		
		$values->bindParam(':id', $_POST['kayttaja_id']);
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$row_array['tunnus']	= $row['tunnus'];
			$row_array['nakyma_idt']	= $row['nakyma_idt'];
			if($row['sijaisuustausta_idt'] == null) {
				$row_array['sijaisuustausta_idt'] = "";
			}
			else {
				$row_array['sijaisuustausta_idt'] = $row['sijaisuustausta_idt'];
			}
			$row_array['toimialue_idt'] = $row['toimialue_idt'];
		
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