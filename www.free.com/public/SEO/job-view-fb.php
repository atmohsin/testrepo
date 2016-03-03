<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * User: Mohsin
 * Date: 24/03/15
 */



//echo "Hellow";

/* $domain_name = $_SERVER['HTTP_HOST'];
$urlParam = $_GET['_escaped_fragment_'];
$arr = explode("/", $urlParam, 3);
$jobUrl = $arr[2];
$pageId = $arr[2]; */

$pageId = $_GET['pageId'];
$appId = $_GET['appId'];
$jobUrl = $_GET['app_data'];


if (in_array($_SERVER['HTTP_USER_AGENT'], array(
  'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
))) {
  //it's probably Facebook's bot
    $SITE_ROOT = "http://zwayam.com:8080/ccubeserver/";
	$jsonData = getData($SITE_ROOT);
	makePage($jsonData, $SITE_ROOT);
}
else {
	//"https://facebook.com/pages/-/". $pageId ."?sk=app_".$appId."&app_data=".$jobviewurl;
	$jobUrlParam = 	"https://facebook.com/pages/-/". $GLOBALS['pageId'] ."?sk=app_".$GLOBALS['appId']."&app_data=".$GLOBALS['jobUrl'];
   header('Location: '.$jobUrlParam);
}



function getData($siteRoot) {
    if (strpos($GLOBALS['jobUrl'],'?') !== false) {
        $newJobUrl = strtok($GLOBALS['jobUrl'], '?');
    }
    else {
        $newJobUrl = $GLOBALS['jobUrl'];
    }
    $url = $siteRoot.'ccubeAPI/getJobForUrl/'.$newJobUrl;
    $rawData = file_get_contents($url);
    return json_decode($rawData);
}

function makePage($data, $siteRoot) {

    $imageUrl = 'http://'.$GLOBALS['domain_name'].'/images/logosocial.png';
    $smallDescription = substr($data->metaDescription, 0, 250);
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
      	<title><?php echo $data->jobTitle; ?></title>

       
        <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="og:type"  content="website" />
        <meta property="og:title" content="<?php echo $data->jobTitle; ?>"/>
        <meta property="og:description" content="<?php echo $smallDescription; ?>" />
       	<meta property="og:image" content="" />
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

    </head>
    <body>
   
    </body>
    </html>
<?php
}
 ?>