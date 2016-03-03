<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * User: Mohsin
 * Date: 24/03/15
 */




$domain_name = $_SERVER['HTTP_HOST'];
$urlParam = $_GET['_escaped_fragment_'];
$arr = explode("/", $urlParam, 3);
$jobUrl = $arr[2];


$SITE_ROOT = "http://zwayam.com:8080/ccubeserver/";
$jsonData = getData($SITE_ROOT);
makePage($jsonData, $SITE_ROOT);



function getData($siteRoot) {
    if (strpos($GLOBALS['jobUrl'],'?') !== false) {
        $newJobUrl = strtok($GLOBALS['jobUrl'], '?');
    }
    else {
        $newJobUrl = $GLOBALS['jobUrl'];
    }
    $rawData = file_get_contents($siteRoot.'ccubeAPI/getJobForUrl/'.$newJobUrl);
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

        <!-- Twitter summary card metadata -->
        <meta property="twitter:card" content="JobView" />
        <meta property="twitter:site" content="@zwayam" />
        <meta property="twitter:title" content="<?php echo $data->jobTitle; ?>" />
        <meta property="twitter:description" content="<?php echo $smallDescription; ?>" />
        <meta property="twitter:image" content="<?php echo $imageUrl; ?>" />
       
        <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="og:type"  content="website" />
        <meta property="og:title" content="<?php echo $data->jobTitle; ?>"/>
        <meta property="og:description" content="<?php echo $smallDescription; ?>" />
        <meta property="og:image" content="<?php echo $imageUrl; ?>" />
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

    </head>
    <body>
   
    </body>
    </html>
<?php
}
