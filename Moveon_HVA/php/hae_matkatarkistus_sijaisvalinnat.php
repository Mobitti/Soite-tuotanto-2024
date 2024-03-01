<?php

include_once '../config/config.php';

if(isset($_POST['tila'])
&& isset($_POST['toimialue_idt'])
&& isset($_POST['matkatarkistustila']))
{
    try
    {
        $return_arr = array();
        $sijainenWhere = "";
        $toimialueWhere = "";
        $sijais_idt = "-1";
        $matkatilaWhere = " (tila = 1 OR tila = 3)";

        if($_POST['matkatarkistustila']) {
            $matkatilaWhere = " tila = 1";
        }

        $con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $con->query('SET NAMES utf8');

        if($_POST['tila'] == 0) {
            $sijainenWhere = " WHERE nimike_id NOT IN(SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%')";
        }
        else {
            $sijainenWhere = " WHERE nimike_id IN(SELECT id FROM nimike WHERE nimi LIKE '%sihteeri%')";
        }
        
        $sql = "SELECT id FROM sijainen" . $sijainenWhere . " AND id IN(SELECT DISTINCT sijainen_id FROM sijainentoimialue WHERE toimialue_id IN('" .  implode("','",$_POST['toimialue_idt']) . "'))";
		$values = $con->prepare($sql);		
		$values->execute();
        while($row = $values->fetch(PDO::FETCH_ASSOC))
        {
            $sijais_idt .= ",'" . $row['id'] . "'";
        }
        
        if(strlen($sijais_idt) > 0) {
            $sijais_idt = substr($sijais_idt,1);
        }
        
        $sql = "SELECT DISTINCT sijainen_id, (SELECT nimi FROM sijainen WHERE id = sijainen_id) AS nimi FROM matka WHERE sijainen_id IN(" . $sijais_idt . ") AND" . $matkatilaWhere .  " ORDER BY nimi";
        $values = $con->prepare($sql);
        $values->bindParam(':sijainen_id', $_POST['sijainen_id']);
        $values->execute();
        while($row = $values->fetch(PDO::FETCH_ASSOC)) 
        {
            $row_array['sijainen_id'] = $row['sijainen_id'];
            $row_array['nimi'] = $row['nimi'];

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
