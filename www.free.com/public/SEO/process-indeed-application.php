<?php

$config = file_get_contents ( "../js/app/config.js" ); // For SEO folder
// $config = file_get_contents("js/app/config.js");
$pos = strpos ( $config, "WEBSERVICEURL" );
$tempp = substr ( $config, $pos + 14 );
$webserviceurlTemp = substr ( $tempp, strpos ( $tempp, '"' ) + 1 );
$webserviceurl = substr ( $webserviceurlTemp, 0, strpos ( $webserviceurlTemp, '"' ) );

echo $webserviceurl;

$tempfolder = '/var/www/zwayam/temp/';

$externalSource = $_GET ["source"];
$referrerEmailId = $_GET ["referrer"];

if ($externalSource == '') {
	
	$externalSource = "Others";
}

$jobId = "";
$jobTitle = "";
$jobCompany = "";
$jobLocation = "";
$applicantName = "";
$email = "";
$phoneNum = "";
$fileName = "";
$file = "";
$encodedData="";
$decodedData="";
$filepath="";
$applicantLoc="";
$applicantMessage = "";

$data = "";
$jsondata = json_decode ( file_get_contents ( 'php://input' ), true );
$data = $data . $jsondata;

/*
 * foreach ( $jsondata as $key => $value ) {
 * $data = $data . $key . "-" . $value;
 *
 * $appData = $data;
 *
 * foreach ( $value as $key => $value ) {
 *
 * $data = $data . $key . "-" . $value;
 *
 * $appData = $appData . $data;
 *
 * if ($key == 'jobId') {
 *
 * $jobId = trim ( $value );
 * } else if ($key == 'jobTitle') {
 *
 * $jobTitle = trim ( $value );
 * } else if ($key == 'jobCompany') {
 *
 * $jobCompany = trim ( $value );
 * } else if ($key == 'jobLocation') {
 *
 * $jobLocation = trim ( $value );
 * } else if ($key == 'fullName') {
 *
 * $applicantName = trim ( $value );
 * } else if ($key == 'email') {
 *
 * $email = trim ( $value );
 * } else if ($key == 'phoneNumber') {
 *
 * $phoneNum = trim ( $value );
 * } else if ($key == 'coverletter') {
 *
 * $applicantMessage = $value;
 * } else if ($key == 'resume') {
 *
 * foreach ( $value as $key => $value ) {
 *
 * if ($key == 'file') {
 *
 * $file = $value;
 *
 * foreach ( $value as $key => $value ) {
 *
 * if ($key == 'fileName') {
 *
 * $fileName = trim ( $value );
 * } else if ($key == 'data') {
 * $encodedData = str_replace ( ' ', '+', $value );
 * $decodedData = base64_decode ( $encodedData );
 * } else {
 *
 * // do nothing
 * }
 * }
 * } else if ($key == 'json') {
 *
 * foreach ( $value as $key => $value ) {
 *
 * if ($key == 'location') {
 *
 * foreach ( $value as $key => $value ) {
 *
 * if ($key == 'city') {
 *
 * $applicantLoc = trim ( $value );
 * } else {
 *
 * // do nothing
 * }
 * }
 * } else {
 *
 * // do nothing
 * }
 * }
 * }
 * }
 * } else {
 *
 * // do nothing
 * }
 * }
 * }
 */

$jobId = trim ( $jsondata ['job'] ['jobId'] );
$applicantName = trim ( $jsondata ['applicant'] ['fullName'] );
$email = trim ( $jsondata ['applicant'] ['email'] );
$phoneNum = trim ( $jsondata ['applicant'] ['phoneNumber'] );
$applicantMessage = trim ( $jsondata ['applicant'] ['coverletter'] );
$applicantLoc = trim ( $jsondata ['applicant'] ['resume'] ['json'] ['location'] ['city'] );
$fileName = trim ( $jsondata ['applicant'] ['resume'] ['file'] ['fileName'] );
$fileData = $jsondata ['applicant'] ['resume'] ['file'] ['data'];

if ($fileData != null || $fileData != "") {
	$encodedData = str_replace ( ' ', '+', $fileData );
	$decodedData = base64_decode ( $encodedData );
}

// This is the data to POST to the form. The KEY of the array is the name of the field. The value is the value posted.

$data_to_post = array ();
$data_to_post ['name'] = $applicantName;
$data_to_post ['email'] = $email;
$data_to_post ['phone'] = $phoneNum;
$data_to_post ['location'] = $applicantLoc;
$data_to_post ['message'] = $applicantMessage;
/*
 * $data_to_post['experience'] = null;
 * $data_to_post['companyid'] =1;
 */
$data_to_post ['jobid'] = $jobId;

if ($decodedData != null || $decodedData != "") {
	$randomId = uniqid ();
	file_put_contents ( $tempfolder . $randomId . $fileName, $decodedData );
	$filepath = $tempfolder . $randomId . $fileName;
	$data_to_post ['file'] = "@$filepath";
	$data_to_post ['filename'] = $fileName;
}
$data_to_post ['externalSource'] = $externalSource;
$data_to_post ['referrerEmailId'] = $referrerEmailId;

// Define URL where the form resides
$form_url = $webserviceurl . "ccubeAPI/applyJobFromIndeed";

$ch = curl_init ( $form_url );
curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
curl_setopt ( $ch, CURLOPT_CUSTOMREQUEST, 'POST' );
curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 120 );
curl_setopt ( $ch, CURLOPT_TIMEOUT, 120 );
curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data_to_post );

// use this while uploading file
$headers = array (
		"Content-Type:multipart/form-data" 
);
curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );

$result = curl_exec ( $ch );
curl_close ( $ch );

$data = json_decode ( $result, true );

?> 