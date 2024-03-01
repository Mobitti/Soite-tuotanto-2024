<?php

include_once '../config/config.php';
include_once 'laheta_viesti.php';

if (
    isset($_POST['kiinnitykset'])
    && isset($_POST['kayttajatunnus'])
) {
    try {
        $con = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuname, $dbpass);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $con->query('SET NAMES utf8');

        $return_arr = array();
        $nakyma = "Vuorosuunnittelu";

        for ($i = 0; $i < count($_POST['kiinnitykset']); $i++) {
            $paivitetyt_tiedot[$_POST['kiinnitykset'][$i]['id']] = array();
            $vuoro_id = $_POST['kiinnitykset'][$i]['id'];
            $vuorotyyppi = $_POST['kiinnitykset'][$i]['vuorotyyppi'];
            $raportti_osasto_muokattu = $_POST['kiinnitykset'][$i]['raportti_osasto_muokattu'];
            $osasto_muokattu = $_POST['kiinnitykset'][$i]['osasto_muokattu'];
            $tausta_muokattu = $_POST['kiinnitykset'][$i]['tausta_muokattu'];
            $tausta_kommentti_muokattu = $_POST['kiinnitykset'][$i]['tausta_kommentti_muokattu'];
            $luku_muokattu = $_POST['kiinnitykset'][$i]['luku_muokattu'];

            if ($raportti_osasto_muokattu) {
                $edellinen_osasto = "Ei osastoa";
                $nykyinen_osasto = "Ei osastoa";
                $tunniste = "";

                $sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT raportti_osasto_id FROM vuoro WHERE id = :id)";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->execute();
                $row = $values->fetch(PDO::FETCH_ASSOC);
                if ($row != null) {
                    $edellinen_osasto = $row['lyhenne'];
                }

                $sql = "UPDATE vuoro SET raportti_osasto_id = :raportti_osasto_id WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->bindParam(':raportti_osasto_id', $_POST['kiinnitykset'][$i]['raportti_osasto_id']);
                $values->bindParam(':vuorotyyppi', $vuorotyyppi);
                $values->execute();

                if ($values->rowCount() > 0) {
                    $paivitetyt_tiedot[$vuoro_id]["raportti_osasto_id"] = $_POST['kiinnitykset'][$i]['raportti_osasto_id'];

                    $sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT raportti_osasto_id FROM vuoro WHERE id = :id)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $nykyinen_osasto = $row['lyhenne'];
                    }

                    $sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $tunniste = $row['tunniste'];
                    }

                    $tapahtuma = "Raporttiosasto muutos";

                    $sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste,:edellinen_tieto, :tieto)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':kayttaja', $_POST['kayttajatunnus']);
                    $values->bindParam(':nakyma', $nakyma);
                    $values->bindParam(':tapahtuma', $tapahtuma);
                    $values->bindParam(':tunniste', $tunniste);
                    $values->bindParam(':edellinen_tieto', $edellinen_osasto);
                    $values->bindParam(':tieto', $nykyinen_osasto);
                    $values->execute();
                }
            }

            if ($osasto_muokattu) {
                $puhelin = "";
                $osasto = "";
                $pvm = "";
                $vuorokuvaus = "";
                $viesti = "";
                $edellinen_osasto = "Ei osastoa";
                $nykyinen_osasto = "Ei osastoa";
                $tunniste = "";
                $tausta_kommentti = "";

                $sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT osasto_id FROM vuoro WHERE id = :id)";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->execute();
                $row = $values->fetch(PDO::FETCH_ASSOC);
                if ($row != null) {
                    $edellinen_osasto = $row['lyhenne'];
                }

                $sql = "UPDATE vuoro SET osasto_id = :osasto_id WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->bindParam(':osasto_id', $_POST['kiinnitykset'][$i]['osasto_id']);
                $values->bindParam(':vuorotyyppi', $vuorotyyppi);
                $values->execute();

                if ($values->rowCount() > 0) {
                    $paivitetyt_tiedot[$vuoro_id]["osasto_id"] = $_POST['kiinnitykset'][$i]['osasto_id'];

                    $sql = "SELECT lyhenne FROM osasto WHERE id = (SELECT osasto_id FROM vuoro WHERE id = :id)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $nykyinen_osasto = $row['lyhenne'];
                    }

                    $sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $tunniste = $row['tunniste'];
                    }

                    $tapahtuma = "Osasto muutos";

                    $sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':kayttaja', $_POST['kayttajatunnus']);
                    $values->bindParam(':nakyma', $nakyma);
                    $values->bindParam(':tapahtuma', $tapahtuma);
                    $values->bindParam(':tunniste', $tunniste);
                    $values->bindParam(':edellinen_tieto', $edellinen_osasto);
                    $values->bindParam(':tieto', $nykyinen_osasto);
                    $values->execute();

                    if ($_POST['kiinnitykset'][$i]['osasto_id'] != 0) {
                        $sql = "SELECT puhelin, kiinnitys_sms FROM sijainen WHERE id = (SELECT sijainen_id FROM vuoro WHERE id = :id)";
                        $values = $con->prepare($sql);
                        $values->bindParam(':id', $vuoro_id);
                        $values->execute();
                        $row = $values->fetch(PDO::FETCH_ASSOC);
                        if ($row['kiinnitys_sms'] == 1) {
                            $puhelin = $row['puhelin'];
                            $sql = "SELECT nimi FROM osasto WHERE id = :id";
                            $values = $con->prepare($sql);
                            $values->bindParam(':id', $_POST['kiinnitykset'][$i]['osasto_id']);
                            $values->execute();
                            $row = $values->fetch(PDO::FETCH_ASSOC);
                            if ($row != null) {
                                $osasto = $row['nimi'];
                            }

                            $sql = "SELECT pvm, vuorotyyppi, (SELECT kuvaus FROM vuorotyyppi WHERE tyyppi = vuorotyyppi) AS vuorokuvaus, tausta_kommentti FROM vuoro WHERE id = :id";
                            $values = $con->prepare($sql);
                            $values->bindParam(':id', $vuoro_id);
                            $values->execute();
                            $row = $values->fetch(PDO::FETCH_ASSOC);
                            if ($row != null) {
                                $pvm = substr($row['pvm'], 8, 2) . "." . substr($row['pvm'], 5, 2) . "." . substr($row['pvm'], 0, 4);
                                $vuorotyyppi = $row['vuorotyyppi'];
                                $vuorokuvaus = $row['vuorokuvaus'];
                                $tausta_kommentti = $row['tausta_kommentti'];
                            }

                            $viesti = "Sinulla on varaus " . $pvm . " " . $osasto . " yksikköön. Vuoro: " . $vuorotyyppi . " Lisätieto: " . $tausta_kommentti;
                            laheta_sms_curl($puhelin, $viesti, "Soite", 49);
                        }
                    }
                }
            }

            if ($tausta_muokattu) {
                $edellinen_tausta = "Ei taustaa";
                $nykyinen_tausta = "Ei taustaa";
                $tunniste = "";

                $sql = "SELECT selite FROM tausta WHERE id = (SELECT tausta_id FROM vuoro WHERE id = :id)";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->execute();
                $row = $values->fetch(PDO::FETCH_ASSOC);
                if ($row != null) {
                    $edellinen_tausta = $row['selite'];
                }

                $sql = "UPDATE vuoro SET tausta_id = :tausta_id WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->bindParam(':tausta_id', $_POST['kiinnitykset'][$i]['tausta_id']);
                $values->bindParam(':vuorotyyppi', $vuorotyyppi);
                $values->execute();

                if ($values->rowCount() > 0) {
                    $paivitetyt_tiedot[$vuoro_id]["tausta_id"] = $_POST['kiinnitykset'][$i]['tausta_id'];

                    $sql = "SELECT selite FROM tausta WHERE id = (SELECT tausta_id FROM vuoro WHERE id = :id)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $nykyinen_tausta = $row['selite'];
                    }

                    $sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $tunniste = $row['tunniste'];
                    }

                    $tapahtuma = "Sijaisuustausta muutos";

                    $sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':kayttaja', $_POST['kayttajatunnus']);
                    $values->bindParam(':nakyma', $nakyma);
                    $values->bindParam(':tapahtuma', $tapahtuma);
                    $values->bindParam(':tunniste', $tunniste);
                    $values->bindParam(':edellinen_tieto', $edellinen_tausta);
                    $values->bindParam(':tieto', $nykyinen_tausta);
                    $values->execute();
                }
            }

            if ($tausta_kommentti_muokattu) {
                $edellinen_kommentti = "";
                $nykyinen_kommentti = "";
                $tunniste = "";

                $sql = "SELECT tausta_kommentti FROM vuoro WHERE id = :id";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->execute();
                $row = $values->fetch(PDO::FETCH_ASSOC);
                if ($row != null) {
                    $edellinen_kommentti = $row['tausta_kommentti'];
                }

                $sql = "UPDATE vuoro SET tausta_kommentti = :tausta_kommentti WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->bindParam(':tausta_kommentti', $_POST['kiinnitykset'][$i]['tausta_kommentti']);
                $values->bindParam(':vuorotyyppi', $vuorotyyppi);
                $values->execute();
                $paivitys_rivimaara = $values->rowCount();
                array_push($return_arr, $paivitys_rivimaara);

                if ($paivitys_rivimaara > 0) {
                    $paivitetyt_tiedot[$vuoro_id]["tausta_kommentti"] = $_POST['kiinnitykset'][$i]['tausta_kommentti'];

                    $sql = "SELECT tausta_kommentti FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $nykyinen_kommentti = $row['tausta_kommentti'];
                    }

                    $sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $tunniste = $row['tunniste'];
                    }

                    $tapahtuma = "Vuorokommentti muutos";

                    $sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':kayttaja', $_POST['kayttajatunnus']);
                    $values->bindParam(':nakyma', $nakyma);
                    $values->bindParam(':tapahtuma', $tapahtuma);
                    $values->bindParam(':tunniste', $tunniste);
                    $values->bindParam(':edellinen_tieto', $edellinen_kommentti);
                    $values->bindParam(':tieto', $nykyinen_kommentti);
                    $values->execute();
                }
            }

            if ($luku_muokattu) {
                $luku = $_POST['kiinnitykset'][$i]['luku'];
                $nykyinen_tieto = "";
                $edellinen_tieto = "";
                $tunniste = "";

                $sql = "SELECT luku FROM vuoro WHERE id = :id";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->execute();
                $row = $values->fetch(PDO::FETCH_ASSOC);
                if ($row != null) {
                    if ($row['luku'] == 0) {
                        $edellinen_tieto = "Avattu";
                    } else {
                        $edellinen_tieto = "Lukittu";
                    }
                }

                $sql = "UPDATE vuoro SET luku = :luku WHERE id = :id AND vuorotyyppi = :vuorotyyppi";
                $values = $con->prepare($sql);
                $values->bindParam(':id', $vuoro_id);
                $values->bindParam(':luku', $luku);
                $values->bindParam(':vuorotyyppi', $vuorotyyppi);
                $values->execute();

                if ($values->rowCount() > 0) {
                    $paivitetyt_tiedot[$vuoro_id]["luku"] = $_POST['kiinnitykset'][$i]['luku'];

                    if ($luku == 0) {
                        $nykyinen_tieto = "Avattu";
                    } else {
                        $nykyinen_tieto = "Lukittu";
                    }

                    $sql = "SELECT CONCAT(date_format(pvm,'%d.%m.%Y'),' ',(SELECT nimi FROM sijainen WHERE id = sijainen_id),' ',vuorotyyppi) AS tunniste FROM vuoro WHERE id = :id";
                    $values = $con->prepare($sql);
                    $values->bindParam(':id', $vuoro_id);
                    $values->execute();
                    $row = $values->fetch(PDO::FETCH_ASSOC);
                    if ($row != null) {
                        $tunniste = $row['tunniste'];
                    }

                    $tapahtuma = "Lukitus muutos";

                    $sql = "INSERT INTO lokitapahtuma (id, aikaleima, kayttaja, nakyma, tapahtuma, tunniste, edellinen_tieto, tieto) 
					VALUES (NULL, NOW(), :kayttaja, :nakyma, :tapahtuma, :tunniste, :edellinen_tieto, :tieto)";
                    $values = $con->prepare($sql);
                    $values->bindParam(':kayttaja', $_POST['kayttajatunnus']);
                    $values->bindParam(':nakyma', $nakyma);
                    $values->bindParam(':tapahtuma', $tapahtuma);
                    $values->bindParam(':tunniste', $tunniste);
                    $values->bindParam(':edellinen_tieto', $edellinen_tieto);
                    $values->bindParam(':tieto', $nykyinen_tieto);
                    $values->execute();
                }
            }

            array_push($return_arr, $paivitetyt_tiedot);
        }

        $con = null;
        $values = null;
        echo json_encode($return_arr);
    } catch (PDOException $e) {
        echo "Tietokantavirhe: " . $e->getMessage();
    }
} else {
    echo "parametri";
}
