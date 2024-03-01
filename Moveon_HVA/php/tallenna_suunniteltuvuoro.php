<?php

include_once '../config/config.php';

if(isset($_POST['id']) 
&& isset($_POST['alkupvm']) 
&& isset($_POST['loppupvm'])
&& isset($_POST['vuorotyyppi'])
&& isset($_POST['sijainen_id'])
&& isset($_POST['kiinnitykset']))
{	
	try
	{
		$suunniteltuvuoro_id = "";
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sql = "SELECT id FROM suunniteltuvuoro WHERE alkupvm = :alkupvm AND loppupvm = :loppupvm AND sijainen_id = :sijainen_id AND poisto = 0";
		$values = $con->prepare($sql);
		$values->bindParam(':alkupvm', $_POST['alkupvm']);
		$values->bindParam(':loppupvm', $_POST['loppupvm']);
		$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
		$values->execute();
		$row = $values->fetch(PDO::FETCH_ASSOC);
		if($row != null) {
			if($_POST['id'] != "") {
				$sql = "UPDATE suunniteltuvuoro SET vuorotyyppi = :vuorotyyppi, muokattu = 1 WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
				$values->bindParam(':id', $_POST['id']);
				$values->execute();
				
				$sql = "DELETE FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
				$values = $con->prepare($sql);
				$values->bindParam(':suunniteltuvuoro_id', $_POST['id']);
				$values->execute();
				
				for($i = 0; $i < count($_POST['kiinnitykset']); $i++)
				{
					$vuorotyyppi = $_POST['kiinnitykset'][$i]['vuorotyyppi'];
					$raportti_osasto_id = $_POST['kiinnitykset'][$i]['raportti_osasto_id'];
					$osasto_id = $_POST['kiinnitykset'][$i]['osasto_id'];
					$tausta_id = $_POST['kiinnitykset'][$i]['tausta_id'];
					$tausta_kommentti = $_POST['kiinnitykset'][$i]['tausta_kommentti'];
					$luku = $_POST['kiinnitykset'][$i]['luku'];
					
					$sql = "INSERT INTO suunniteltukiinnitys (id, suunniteltuvuoro_id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku) VALUES(NULL, :suunniteltuvuoro_id, :vuorotyyppi, :raportti_osasto_id, :osasto_id, :tausta_id, :tausta_kommentti, :luku)";
					$values = $con->prepare($sql);
					$values->bindParam(':suunniteltuvuoro_id',  $_POST['id']);
					$values->bindParam(':vuorotyyppi', $vuorotyyppi);
					$values->bindParam(':raportti_osasto_id', $raportti_osasto_id);
					$values->bindParam(':osasto_id', $osasto_id);
					$values->bindParam(':tausta_id', $tausta_id);
					$values->bindParam(':tausta_kommentti', $tausta_kommentti);
					$values->bindParam(':luku', $luku);
					$values->execute();
				}
			}
		}
		else {
			$sql = "INSERT INTO suunniteltuvuoro (id, alkupvm, loppupvm, vuorotyyppi, sijainen_id, poisto, luku, muokattu) VALUES(NULL, :alkupvm, :loppupvm, :vuorotyyppi, :sijainen_id, 0, 0, 1)";
			$values = $con->prepare($sql);
			$values->bindParam(':alkupvm', $_POST['alkupvm']);
			$values->bindParam(':loppupvm', $_POST['loppupvm']);
			$values->bindParam(':vuorotyyppi', $_POST['vuorotyyppi']);
			$values->bindParam(':sijainen_id', $_POST['sijainen_id']);
			$values->execute();
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