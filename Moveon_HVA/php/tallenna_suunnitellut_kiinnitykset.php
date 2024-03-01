<?php

include_once '../config/config.php';

if(isset($_POST['suunniteltuvuoro_id'])
&& isset($_POST['kiinnitykset']))
{	
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		for($i = 0; $i < count($_POST['kiinnitykset']); $i++)
		{
			$suunniteltukiinnitys_id = $_POST['kiinnitykset'][$i]['id'];
			$vuorotyyppi = $_POST['kiinnitykset'][$i]['vuorotyyppi'];
			$raportti_osasto_id = $_POST['kiinnitykset'][$i]['raportti_osasto_id'];
			$osasto_id = $_POST['kiinnitykset'][$i]['osasto_id'];
			$tausta_id = $_POST['kiinnitykset'][$i]['tausta_id'];
			$tausta_kommentti = $_POST['kiinnitykset'][$i]['tausta_kommentti'];
			$luku = $_POST['kiinnitykset'][$i]['luku'];
			
			if($suunniteltukiinnitys_id == "") {
				$sql = "INSERT INTO suunniteltukiinnitys (id, suunniteltuvuoro_id, vuorotyyppi, raportti_osasto_id, osasto_id, tausta_id, tausta_kommentti, luku) VALUES(NULL, :suunniteltuvuoro_id, :vuorotyyppi, :raportti_osasto_id, :osasto_id, :tausta_id, :tausta_kommentti, :luku)";
				$values = $con->prepare($sql);
				$values->bindParam(':suunniteltuvuoro_id', $_POST['suunniteltuvuoro_id']);
				$values->bindParam(':vuorotyyppi', $vuorotyyppi);
				$values->bindParam(':raportti_osasto_id', $raportti_osasto_id);
				$values->bindParam(':osasto_id', $osasto_id);
				$values->bindParam(':tausta_id', $tausta_id);
				$values->bindParam(':tausta_kommentti', $tausta_kommentti);
				$values->bindParam(':luku', $luku);
				$values->execute();
			}
			else {
				$sql = "UPDATE suunniteltukiinnitys SET raportti_osasto_id = :raportti_osasto_id, osasto_id = :osasto_id, tausta_id = :tausta_id, tausta_kommentti = :tausta_kommentti, luku = :luku  WHERE id = :id";
				$values = $con->prepare($sql);
				$values->bindParam(':raportti_osasto_id', $raportti_osasto_id);
				$values->bindParam(':osasto_id', $osasto_id);
				$values->bindParam(':tausta_id', $tausta_id);
				$values->bindParam(':tausta_kommentti', $tausta_kommentti);
				$values->bindParam(':luku', $luku);
				$values->bindParam(':id', $suunniteltukiinnitys_id);
				$values->execute();
			}
		}
		
		if($_POST['suunniteltuvuoro_id'] != "") {
			$sql = "UPDATE suunniteltuvuoro SET muokattu = 1 WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $_POST['suunniteltuvuoro_id']);
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