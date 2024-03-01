<?php

include_once '../config/config.php';

if(isset($_POST['id'])
&& isset($_POST['tunnus'])
&& isset($_POST['salasana'])
&& isset($_POST['nakymat'])
&& isset($_POST['sijaisuustaustat'])
&& isset($_POST['toimialueet']))
{	
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		$kayttaja_id = "";
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM kayttaja WHERE tunnus = :tunnus";
			$values = $con->prepare($sql);
			$values->bindParam(':tunnus', $_POST['tunnus']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;	
				return;				
			}
		
			$sql = "INSERT INTO kayttaja (id, tunnus, salasana) VALUES(NULL, :tunnus, :salasana)";
			$values = $con->prepare($sql);
			$values->bindParam(':tunnus', $_POST['tunnus']);
			$values->bindParam(':salasana', md5($_POST['salasana']));
			$values->execute();
			
			$sql = "SELECT id FROM kayttaja WHERE tunnus = :tunnus AND salasana = :salasana";
			$values = $con->prepare($sql);
			$values->bindParam(':tunnus', $_POST['tunnus']);
			$values->bindParam(':salasana', md5($_POST['salasana']));
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				$kayttaja_id = $row['id']; 
			}
			
			$sql = "DELETE FROM kayttajanakyma WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			
			if($kayttaja_id != "" || $kayttaja_id != 0) {
				$nakymat = explode(',',$_POST['nakymat']);
				for($j = 0; $j < count($nakymat); $j++)
				{
					$sql = "INSERT INTO kayttajanakyma (id, kayttaja_id, nakyma_id) VALUES (NULL, :kayttaja_id, :nakyma_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':kayttaja_id', $kayttaja_id);
					$values->bindParam(':nakyma_id', $nakymat[$j]);
					$values->execute();
				}
			}
			
			$sql = "DELETE FROM kayttajasijaisuustausta WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			
			if($kayttaja_id != "" || $kayttaja_id != 0) {
				$sijaisuustaustat = explode(',',$_POST['sijaisuustaustat']);
				for($j = 0; $j < count($sijaisuustaustat); $j++)
				{
					$sql = "INSERT INTO kayttajasijaisuustausta (id, kayttaja_id, sijaisuustausta_id) VALUES (NULL, :kayttaja_id, :sijaisuustausta_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':kayttaja_id', $kayttaja_id);
					$values->bindParam(':sijaisuustausta_id', $sijaisuustaustat[$j]);
					$values->execute();
				}
			}
			
			$sql = "DELETE FROM kayttajatoimialue WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $kayttaja_id);
			$values->execute();
			
			if($kayttaja_id != "" || $kayttaja_id != 0) {
				$toimialueet = explode(',',$_POST['toimialueet']);
				for($j = 0;  $j < count($toimialueet); $j++)
				{
					$sql = "INSERT INTO kayttajatoimialue (id, kayttaja_id, toimialue_id) VALUES (NULL, :kayttaja_id, :toimialue_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':kayttaja_id', $kayttaja_id);
					$values->bindParam(':toimialue_id', $toimialueet[$j]);
					$values->execute();
				}
			}
		}
		else {
			$sql = "SELECT id FROM kayttaja WHERE tunnus = :tunnus AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':tunnus', $_POST['tunnus']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;	
				return;				
			}
			
			$salasana = "";
			if($_POST['salasana'] != "") {
				$salasana = " salasana = md5('" . $_POST['salasana'] . "')";
				
				$sql = "UPDATE kayttaja SET tunnus = :tunnus, " . $salasana .  " WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':tunnus', $_POST['tunnus']);
				$values->bindParam(':id', $_POST['id']);
				$values->execute();
			}

			$sql = "DELETE FROM kayttajanakyma WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $_POST['id']);
			$values->execute();
			
			$nakymat = explode(',',$_POST['nakymat']);
			for($j = 0; $j < count($nakymat); $j++)
			{
				$sql = "INSERT INTO kayttajanakyma (id, kayttaja_id, nakyma_id) VALUES (NULL, :kayttaja_id, :nakyma_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':kayttaja_id', $_POST['id']);
				$values->bindParam(':nakyma_id', $nakymat[$j]);
				$values->execute();
			}
			
			$sql = "DELETE FROM kayttajasijaisuustausta WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $_POST['id']);
			$values->execute();
			
			$sijaisuustaustat = explode(',',$_POST['sijaisuustaustat']);
			for($j = 0; $j < count($sijaisuustaustat); $j++)
			{
				$sql = "INSERT INTO kayttajasijaisuustausta (id, kayttaja_id, sijaisuustausta_id) VALUES (NULL, :kayttaja_id, :sijaisuustausta_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':kayttaja_id', $_POST['id']);
				$values->bindParam(':sijaisuustausta_id', $sijaisuustaustat[$j]);
				$values->execute();
			}
			
			
			$sql = "DELETE FROM kayttajatoimialue WHERE kayttaja_id = :kayttaja_id";
			$values = $con->prepare($sql);
			$values->bindParam(':kayttaja_id', $_POST['id']);
			$values->execute();
			
			$toimialueet = explode(',',$_POST['toimialueet']);
			for($j = 0; $j < count($toimialueet); $j++)
			{
				$sql = "INSERT INTO kayttajatoimialue (id, kayttaja_id, toimialue_id) VALUES (NULL, :kayttaja_id, :toimialue_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':kayttaja_id', $_POST['id']);
				$values->bindParam(':toimialue_id', $toimialueet[$j]);
				$values->execute();
			}
		}

		$con=null; $values=null;		
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