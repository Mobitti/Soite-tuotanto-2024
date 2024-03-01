<?php
include_once '../config/config.php';
include_once 'laheta_viesti.php';

if(isset($_POST['sijais_idt'])
&& isset($_POST['viesti'])
&& isset($_POST['lahettaja']))
{
	try
	{
		$return_arr = array();
		$sijais_idt = array();
		$viesti = array (
			'mtitle' => $_POST['lahettaja'],
			'mdesc' => $_POST['viesti'],
		);		
		$viesteja_lahetty = 0;
		
		$con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->query('SET NAMES utf8');
		
		$sijais_idt = explode(',',$_POST['sijais_idt']);
	
		for($i = 0; $i < count($sijais_idt); $i++) 
		{
			$sql = "SELECT puhelin FROM sijainen WHERE id = :id";
			$values = $con->prepare($sql);
			$values->bindParam(':id', $sijais_idt[$i]);
			$values->execute();	
			$row = $values->fetch(PDO::FETCH_ASSOC);
			if($row != null) {
				if($row['puhelin'] != '' && $row['puhelin'] != null) {
					$viesteja_lahetty += laheta_sms_curl($row['puhelin'], $_POST['viesti'], $_POST['lahettaja'], 49);
				}
			}
		}
		
		$row_array['kpl'] = $viesteja_lahetty;
		array_push($return_arr,$row_array);

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