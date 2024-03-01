<?php

include_once '../config/config.php';

if (isset($_POST['suunniteltuvuoro_id'])) {

    try {
        $suunnitellut_vuoro_tiedot = array();

        $con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $con->query('SET NAMES utf8');

        $sql = "SELECT id, alkupvm, loppupvm, vuorotyyppi, sijainen_id, luku, muokattu FROM suunniteltuvuoro WHERE id = :id";
        $values = $con->prepare($sql);
        $values->bindParam(':id', $_POST['suunniteltuvuoro_id']);
        $values->execute();
        $row = $values->fetch(PDO::FETCH_ASSOC);
        if ($row != null) {
            $suunnitellut_vuoro_tiedot['id'] = $row['id'];
            $suunnitellut_vuoro_tiedot['start_date'] = $row['alkupvm'];
            $suunnitellut_vuoro_tiedot['end_date'] = $row['loppupvm'];
            $suunnitellut_vuoro_tiedot['color'] = "#ffffff";
            $suunnitellut_vuoro_tiedot['vuorotyyppi'] = $row['vuorotyyppi'];
            $suunnitellut_vuoro_tiedot['sijainen_id'] = $row['sijainen_id'];
            $suunnitellut_vuoro_tiedot['luku'] = $row['luku'];
            $suunnitellut_vuoro_tiedot['muokattu'] = $row['muokattu'];
            $suunnitellut_vuoro_tiedot['nakyvyys'] = -1;
            $suunnitellut_vuoro_tiedot['vuoro_kiinnitykset'] = array();
            $suunnitellut_vuoro_tiedot['suunnitellut_kiinnitykset'] = array();
        }

        $sql = "SELECT DISTINCT(suunniteltuvuoro_id), nakyvyys FROM vuoro WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
        $values = $con->prepare($sql);
        $values->bindParam(':suunniteltuvuoro_id', $_POST['suunniteltuvuoro_id']);
        $values->execute();
        $row = $values->fetch(PDO::FETCH_ASSOC);
        if ($row != null) {
            if ($row['nakyvyys'] != null) {
                $suunnitellut_vuoro_tiedot['nakyvyys'] = $row['nakyvyys'];
            }
        }

        $sql = "SELECT vuorotyyppi, luku, osasto_id, (SELECT lyhenne FROM osasto WHERE id = osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = tausta_id) AS tausta FROM vuoro WHERE osasto_id != 0 AND suunniteltuvuoro_id = :suunniteltuvuoro_id";
        $values = $con->prepare($sql);
        $values->bindParam(':suunniteltuvuoro_id', $_POST['suunniteltuvuoro_id']);
        $values->execute();
        $vuorot = $values->fetchAll(PDO::FETCH_ASSOC);
        for ($i = 0; $i < count($vuorot); $i++) {
            $vuoro_tiedot = array();
            $vuoro_tiedot['vuorotyyppi'] = $vuorot[$i]['vuorotyyppi'];
            $vuoro_tiedot['osasto'] = $vuorot[$i]['osasto'];
            $vuoro_tiedot['osasto_id'] = $vuorot[$i]['osasto_id'];
            if ($vuorot[$i]['tausta'] == null) {
                $vuoro_tiedot['tausta'] = "";
            } else {
                $vuoro_tiedot['tausta'] = $vuorot[$i]['tausta'];
            }

            $vuoro_tiedot['luku'] = $vuorot[$i]['luku'];
            array_push($suunnitellut_vuoro_tiedot['vuoro_kiinnitykset'], $vuoro_tiedot);
        }

        $sql = "SELECT vuorotyyppi, luku, osasto_id, (SELECT lyhenne FROM osasto WHERE id = osasto_id) AS osasto, (SELECT selite FROM tausta WHERE id = tausta_id) AS tausta FROM suunniteltukiinnitys WHERE suunniteltuvuoro_id = :suunniteltuvuoro_id";
        $values = $con->prepare($sql);
        $values->bindParam(':suunniteltuvuoro_id', $_POST['suunniteltuvuoro_id']);
        $values->execute();
        $kiinnitykset = $values->fetchAll(PDO::FETCH_ASSOC);
        for ($i = 0; $i < count($kiinnitykset); $i++) {
            $suunnitellut_tiedot = array();
            $suunnitellut_tiedot['vuorotyyppi'] = $kiinnitykset[$i]['vuorotyyppi'];
            if ($kiinnitykset[$i]['osasto'] == null) {
                $suunnitellut_tiedot['osasto'] = "";
                $suunnitellut_tiedot['osasto_id'] = "";
            } else {
                $suunnitellut_tiedot['osasto'] = $kiinnitykset[$i]['osasto'];
                $suunnitellut_tiedot['osasto_id'] = $kiinnitykset[$i]['osasto_id'];
            }

            if ($kiinnitykset[$i]['tausta'] == null) {
                $suunnitellut_tiedot['tausta'] = "";
            } else {
                $suunnitellut_tiedot['tausta'] = $kiinnitykset[$i]['tausta'];
            }

            $suunnitellut_tiedot['luku'] = $kiinnitykset[$i]['luku'];

            array_push($suunnitellut_vuoro_tiedot['suunnitellut_kiinnitykset'], $suunnitellut_tiedot);
        }

        $con = null;
        $values = null;
        echo json_encode($suunnitellut_vuoro_tiedot);
    } catch (PDOException $e) {
        echo "Tietokantavirhe: " . $e->getMessage();
    }
}
