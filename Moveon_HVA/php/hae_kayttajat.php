<?php

include_once '../config/config.php';

if(isset($_POST['hakusana'])
&& isset($_POST['jarjestys'])
&& isset($_POST['jarjestettavaarvo']))
{
	try
	{
		$return_arr = array();
		$hakuWhere = "";
		$jarjestysOrder = "";
		$rivimaara = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
				
		if($_POST['hakusana'] != "") {
			$hakuWhere = " WHERE tunnus LIKE '%" . $_POST['hakusana'] . "%'";
		}

		$jarjestysOrder = " ORDER BY " . $_POST['jarjestettavaarvo'] . " " . $_POST['jarjestys'];	
		
		$sql = "SELECT id, tunnus, 
		(SELECT GROUP_CONCAT((SELECT nimi FROM nakyma WHERE id = nakyma_id) ORDER BY (SELECT nimi FROM nakyma WHERE id = nakyma_id) SEPARATOR ', ') FROM kayttajanakyma WHERE kayttaja_id = kayttaja.id) AS nakymat,
		(SELECT GROUP_CONCAT((SELECT CONCAT(numero,' = ', selite) FROM tausta WHERE id = sijaisuustausta_id) ORDER BY (SELECT numero FROM tausta WHERE id = sijaisuustausta_id) SEPARATOR ', ') FROM kayttajasijaisuustausta WHERE kayttaja_id = kayttaja.id) AS sijaisuustaustat,
		(SELECT GROUP_CONCAT((SELECT nimi FROM toimialue WHERE id = toimialue_id) ORDER BY (SELECT nimi FROM toimialue WHERE id = toimialue_id) SEPARATOR ', ') FROM kayttajatoimialue WHERE kayttaja_id = kayttaja.id) AS toimialueet FROM kayttaja" .  $hakuWhere . $jarjestysOrder;	
		$values = $con->prepare($sql);		
		$values->execute();
		while($row = $values->fetch(PDO::FETCH_ASSOC))
		{
			$rivimaara++;
			$row_array['id']	= $row['id'];
			$row_array['tunnus']	= $row['tunnus'];
			$row_array['nakymat'] = $row['nakymat'];
			if($row['sijaisuustaustat'] == null) {
				$row_array['sijaisuustaustat'] = "";
			}
			else {
				$row_array['sijaisuustaustat'] = $row['sijaisuustaustat'];
			}
			
			$row_array['toimialueet'] = $row['toimialueet'];
			
			array_push($return_arr,$row_array);
		}
		
		array_unshift($return_arr,$rivimaara);

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