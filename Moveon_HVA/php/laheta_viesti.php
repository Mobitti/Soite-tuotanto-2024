<?php

function laheta_sms_curl($pn, $v, $l, $cid)
{	
	$sms_url = "http://51.178.82.50/sms/moveon/moveon_sms_curl_apifonica.php"; // poistuu
	// vaihdetaan uuteen operaattoriin 1.1.2023!!
	
	$msg = $v;
	$fields_string = "";
	
	$fields = array(
		'msg'=>urlencode(utf8_decode($msg)),
		'puh'=>urlencode($pn),
		'lah'=>urlencode($l),
		'cli'=>urlencode($cid)
        );

	foreach($fields as $key=>$value) { 
		$fields_string .= $key. '=' . $value . '&'; 
	}
	rtrim($fields_string, '&');

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $sms_url);
	curl_setopt($ch, CURLOPT_POST, count($fields));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec($ch);
	
	return $result;
}
?>