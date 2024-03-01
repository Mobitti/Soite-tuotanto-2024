<?php

include_once '../config/config.php';

try
{
    $data_array = array();
    $sijaiset = array();
    $paivitys_rivimaara = 0;
    $pin_koodi_sarja = range(0,9999);
    $pin_koodit = array();
    $pin_koodi = "";

    $con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->query('SET NAMES utf8');
    
    $sql = "SELECT id, pin FROM sijainen";
    $values = $con->prepare($sql);
    $values->execute();
    while($row = $values->fetch(PDO::FETCH_ASSOC))
    {
        if(!$row['pin'] == null) {
            array_push($pin_koodit,$row['pin']);
        }
        else {
            array_push($sijaiset,$row['id']);
        }
    }

    for($i = 0; $i < count($sijaiset); $i++)
    {
        $validit_pin_koodit = array_diff($pin_koodi_sarja,$pin_koodit);
        $pin_koodi = $validit_pin_koodit[array_rand($validit_pin_koodit)];

        $sql = "UPDATE sijainen SET pin = :pin WHERE id = :id AND aktiivinen = 1"; 
        $values = $con->prepare($sql);
        $values->bindParam(':pin', sprintf("%04d",$pin_koodi));
        $values->bindParam(':id', $sijaiset[$i]);
        $values->execute();
        $paivitys_rivimaara += $values->rowCount();

        array_push($pin_koodit,$pin_koodi);
    }

    $data_array["rivimaara"] = $paivitys_rivimaara;

    $con=null; $values=null;
    echo json_encode($data_array);	
}  
catch(PDOException $e)
{
    $con=null; $values=null;
    echo "Tietokantavirhe: " . $e->getMessage();
}
?>