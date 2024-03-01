<?php

include_once '../config/config.php';

if(isset($_POST['id'])
&& isset($_POST['nimi'])
&& isset($_POST['nimike_id'])
&& isset($_POST['kotiosasto_id'])
&& isset($_POST['muut_osasto_idt'])
&& isset($_POST['mahd_osasto_idt'])
&& isset($_POST['iv'])
&& isset($_POST['laakelupa'])
&& isset($_POST['kommentti'])
&& isset($_POST['puhelin'])
&& isset($_POST['sms'])
&& isset($_POST['pin'])
&& isset($_POST['toimialueet'])
&& isset($_POST['aktiivinen']))
{	
	try
	{
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		$sijainen_id = "";
		
		if($_POST['id'] == "") {
			$sql = "SELECT id FROM sijainen WHERE nimi = :nimi OR pin = :pin";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':pin', $_POST['pin']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;	
				return;				
			}
		
			$sql = "INSERT INTO sijainen (id, nimi, nimike_id, iv, laakelupa, kommentti, puhelin, kiinnitys_sms, aktiivinen, pin) VALUES(NULL, :nimi, :nimike_id, :iv, :laakelupa, :kommentti, :puhelin, :kiinnitys_sms, 1, :pin)";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':nimike_id', $_POST['nimike_id']);
			$values->bindParam(':iv', $_POST['iv']);
			$values->bindParam(':laakelupa', $_POST['laakelupa']);
			$values->bindParam(':kommentti', $_POST['kommentti']);
			$values->bindParam(':puhelin',$_POST['puhelin']);
			$values->bindParam(':kiinnitys_sms',$_POST['sms']);
			$values->bindParam(':pin',$_POST['pin']);
			$values->execute();
			$sijainen_id = $con->lastInsertId();
			
			if($sijainen_id != "" || $sijainen_id != 0) {
				$sql = "DELETE FROM sijainenosasto WHERE sijainen_id = :sijainen_id";
				$values = $con->prepare($sql);
				$values->bindParam(':sijainen_id', $sijainen_id);
				$values->execute();
			
				$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 1)";
				$values = $con->prepare($sql);
				$values->bindParam(':sijainen_id', $sijainen_id);
				$values->bindParam(':osasto_id', $_POST['kotiosasto_id']);
				$values->execute();
				
				if($_POST['muut_osasto_idt'] != '') {
					$muut_osasto_idt = explode(',',$_POST['muut_osasto_idt']);
					for($i = 0; $i < count($muut_osasto_idt); $i++)
					{
						$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 0)";
						$values = $con->prepare($sql);
						$values->bindParam(':sijainen_id', $sijainen_id);
						$values->bindParam(':osasto_id', $muut_osasto_idt[$i]);
						$values->execute();
					}
				}
				
				if($_POST['mahd_osasto_idt'] != '') {
					$mahd_osasto_idt = explode(',',$_POST['mahd_osasto_idt']);
					for($i = 0; $i < count($mahd_osasto_idt); $i++)
					{
						$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 2)";
						$values = $con->prepare($sql);
						$values->bindParam(':sijainen_id', $sijainen_id);
						$values->bindParam(':osasto_id', $mahd_osasto_idt[$i]);
						$values->execute();
					}
				}
				
				$sql = "DELETE FROM sijainentoimialue WHERE sijainen_id = :sijainen_id";
				$values = $con->prepare($sql);
				$values->bindParam(':sijainen_id', $sijainen_id);
				$values->execute();
				
				$toimialueet = explode(',',$_POST['toimialueet']);
				for($j = 0;  $j < count($toimialueet); $j++)
				{
					$sql = "INSERT INTO sijainentoimialue (id, sijainen_id, toimialue_id) VALUES (NULL, :sijainen_id, :toimialue_id)";
					$values = $con->prepare($sql);
					$values->bindParam(':sijainen_id', $sijainen_id);
					$values->bindParam(':toimialue_id', $toimialueet[$j]);
					$values->execute();
				}
			}
		}
		else {
			$sql = "SELECT id FROM sijainen WHERE (nimi = :nimi OR pin = :pin) AND id != :id";
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':pin', $_POST['pin']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			
			if($row != null) {
				echo "olemassa";
				$con=null; $values=null;	
				return;				
			}
			$sql = "UPDATE sijainen SET nimi = :nimi, nimike_id = :nimike_id, iv = :iv, laakelupa = :laakelupa, kommentti = :kommentti, puhelin = :puhelin, kiinnitys_sms = :kiinnitys_sms, aktiivinen = :aktiivinen, pin = :pin WHERE id = :id"; 
			$values = $con->prepare($sql);
			$values->bindParam(':nimi', $_POST['nimi']);
			$values->bindParam(':nimike_id', $_POST['nimike_id']);
			$values->bindParam(':iv', $_POST['iv']);
			$values->bindParam(':laakelupa', $_POST['laakelupa']);
			$values->bindParam(':kommentti', $_POST['kommentti']);
			$values->bindParam(':puhelin',$_POST['puhelin']);
			$values->bindParam(':kiinnitys_sms',$_POST['sms']);
			$values->bindParam(':aktiivinen', $_POST['aktiivinen']);
			$values->bindParam(':pin', $_POST['pin']);
			$values->bindParam(':id', $_POST['id']);
			$values->execute();
			
			$sql = "DELETE FROM sijainenosasto WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
			$values->execute();
			
			$sql = "SELECT id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osasto_id = :osasto_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $sijainen_id);
			$values->bindParam(':osasto_id', $_POST['kotiosasto_id']);
			$values->execute();
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row == null) {
				$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 1)";
				$values = $con->prepare($sql);
				$values->bindParam(':sijainen_id', $_POST['id']);
				$values->bindParam(':osasto_id', $_POST['kotiosasto_id']);
				$values->execute();
			}
				
			if($_POST['muut_osasto_idt'] != '') {
				$muut_osasto_idt = explode(',',$_POST['muut_osasto_idt']);
				for($i = 0; $i < count($muut_osasto_idt); $i++)
				{
					$sql = "SELECT id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osasto_id = :osasto_id";
					$values = $con->prepare($sql);
					$values->bindParam(':sijainen_id', $sijainen_id);
					$values->bindParam(':osasto_id', $muut_osasto_idt[$i]);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
			
					if($row == null) {
						$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 0)";
						$values = $con->prepare($sql);
						$values->bindParam(':sijainen_id', $_POST['id']);
						$values->bindParam(':osasto_id', $muut_osasto_idt[$i]);
						$values->execute();
					}
				}
			}
			
			if($_POST['mahd_osasto_idt'] != '') {	
				$mahd_osasto_idt = explode(',',$_POST['mahd_osasto_idt']);
				for($i = 0; $i < count($mahd_osasto_idt); $i++)
				{
					$sql = "SELECT id FROM sijainenosasto WHERE sijainen_id = :sijainen_id AND osasto_id = :osasto_id";
					$values = $con->prepare($sql);
					$values->bindParam(':sijainen_id', $sijainen_id);
					$values->bindParam(':osasto_id', $mahd_osasto_idt[$i]);
					$values->execute();
					$row = $values->fetch(PDO::FETCH_ASSOC);
					
					if($row == null) {	
						$sql = "INSERT INTO sijainenosasto (id, sijainen_id, osasto_id, osastotyyppi) VALUES (NULL, :sijainen_id, :osasto_id, 2)";
						$values = $con->prepare($sql);
						$values->bindParam(':sijainen_id', $_POST['id']);
						$values->bindParam(':osasto_id', $mahd_osasto_idt[$i]);
						$values->execute();
					}
				}
			}
			
			$sql = "DELETE FROM sijainentoimialue WHERE sijainen_id = :sijainen_id";
			$values = $con->prepare($sql);
			$values->bindParam(':sijainen_id', $_POST['id']);
			$values->execute();
			
			$toimialueet = explode(',',$_POST['toimialueet']);
			for($j = 0;  $j < count($toimialueet); $j++)
			{
				$sql = "INSERT INTO sijainentoimialue (id, sijainen_id, toimialue_id) VALUES (NULL, :sijainen_id, :toimialue_id)";
				$values = $con->prepare($sql);
				$values->bindParam(':sijainen_id', $_POST['id']);
				$values->bindParam(':toimialue_id', $toimialueet[$j]);
				$values->execute();
			}
		}

		$con=null; $values=null;		
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