<?php

$hostName = $_SERVER['HTTP_HOST'];

$urlParam = $_GET['_escaped_fragment_'];

if(strlen($urlParam) > 1){
    $arr = explode("/", $urlParam, 3);
    $jobUrlId = $arr[2];
}


$data = file_get_contents("../js/app/config.js");
$pos = strpos($data, "COMPANYID");
$tempp = substr($data, $pos+10);
$companyIdTemp = substr($tempp, strpos($tempp, '"')+1);
$companyId = substr($companyIdTemp, 0,strpos($companyIdTemp, '"'));


$SITE_ROOT = "http://zwayam.com:8080/ccubeserver/";

if($jobUrlId){
    $jsonData = getDataJobView($jobUrlId,$SITE_ROOT);
    makePageJobView($jsonData);
}
else{
    $jsonData = getData($SITE_ROOT);
    $jsonMetaData = getMetaData($SITE_ROOT);
    makePage($jsonData,$jsonMetaData);
}



function getData($siteRoot) {
    $searchtitle = 'empty';
    $searchlocation = 'empty';
    
    $rawData = file_get_contents($siteRoot.'ccubeAPI/searchJob/'.$GLOBALS['companyId']."/".$searchtitle. "/".$searchlocation);
    
    return json_decode($rawData);
}

function getMetaData($siteRoot){

    $rawData = file_get_contents($siteRoot.'ccubeAPI/getCompanySEOTags/'.$GLOBALS['companyId']);
    
    return json_decode($rawData);
}

function makePage($jsonData,$jsonMetaData) {
    
    $result='';
    $jobTitle ='';
    $jobUrl ='';
    $role='';
    $jobLocation='';
    $shortDescription='';
    
    $joblist_html_encode = '';
     
    ?>
    <!DOCTYPE html>
    <html>
    <head>
    
        <?php 

          $metaTitle = $jsonMetaData->pageTitle;
          $metaDescription = $jsonMetaData->metDescription;
          $keyWords = $jsonMetaData->metaTags;
        ?>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="title" content="<?php echo $metaTitle ?>"/>
        <meta name="description" content="<?php echo $metaDescription ?>"/>
        <meta name="keywords" content="<?php echo $keyWords ?>"/>
        <meta name="resource-type" content="document"/>
        <meta name="distribution" content="GLOBAL"/>
        <meta name="revisit-after" content="1 day"/>
        <meta name="rating" content="general"/>
        <meta name="pragma" content="no-cache"/>
        <meta name="classification" content="Job & career: job Search, Apply Jobs, Post Jobs"/>
        
        
        
        
        <title><?php echo $metaTitle ?></title>
        </head>
	    <body>
        <?php 
            $arrlength = count($jsonData);

            for($x=0; $x<$arrlength; $x++){
                $job = $jsonData[$x];
                $jobTitle = $job->jobTitle;
                
                $jobUrl = $job->jobUrl;
                $role   =   $job->role;
                $jobLocation    = $job->location;
                $shortDescription   =   $job->shortDescription;
            
    
            $joblist_html_encode ='<li><div><ul><h3><a href="http://'.$_SERVER['SERVER_NAME'].'/#!/job-view/'.$jobUrl.'">'.$jobTitle.'</a></h3>
            </ul></div></li>';
        
            echo $joblist_html_encode; 
            }
       ?>
        
    
   
    </body>
    </html>
<?php
}

function getDataJobView($jobUrlId,$siteRoot) {
    $rawData = file_get_contents($siteRoot.'ccubeAPI/getJobForUrl/'.$jobUrlId);
    return json_decode($rawData);
}


function makePageJobView($data) {
    $result='';
    $jobTitle = $data->jobTitle;
    $jobUrl = $data->jobUrl;
    $role= $data->role;
    $jobLocation= $data->location;
    $shortDescription= $data->shortDescription;
    
    $jobview_html_encode = '';
    $yrsOfExperience = $data->yrsOfExperience;
    $skillSet = $data->skillSet;
    $desiredSkill = $data->desiredSkill;
    $tags = $data->tags;
    $designation = $data->designation;
    $positionsReq = $data->positionsReq;
    $salary = $data->salary;

    
    $metaTitle = $data->metaTitle;
    $metaDescription = $data->metaDescription;
    $keyWords = $data->metakeyWords;
    
    ?>
			<!DOCTYPE html>
		    <html>
		    <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
            <meta name="title" content="<?php echo $metaTitle ?>"/>
            <meta name="description" content="<?php echo $metaDescription ?>"/>
            <meta name="keywords" content="<?php echo $keyWords ?>"/>
            <meta name="resource-type" content="document"/>
            <meta name="distribution" content="GLOBAL"/>
            <meta name="revisit-after" content="1 day"/>
            <meta name="rating" content="general"/>
            <meta name="pragma" content="no-cache"/>
            <meta name="classification" content="Job & career: job Search, Apply Jobs, Post Jobs"/>
            </head>
		    <body>
    <?php       
    $jobview_html_encode ='<div class="jobview-content">
    <h3>'.$jobTitle.'</h3>
    </div>
    <div class="job-desc">
            
            
                    <ul class="salary-section">
                            <li>
                            <h4>Job Description</h4><span class="col">:</span>
                             <ul>'.$shortDescription.'</ul>
                             </li>
                            <li>
                            <h4>Location</h4><span class="col">:</span>
                            <p class="location-text">'.$jobLocation.'</p><img src="images/location-pointer.png" />
                            </li>
                            <li>
                            <h4 class="roles-resp">Roles and Responsibility</h4><span class="col">:</span>
                                     <p class="roles">'.$role.'</p>
                     
                            </li>
                            <li>
                                <h4>Mandatory skills</h4><span class="col">:</span>
                                     <p>'.$skillSet.'</p>
                            </li>
                            <li>
                                <h4>Desirable skills</h4><span class="col">:</span>
                                <p>'.$desiredSkill.'</p>
                            </li>
                            <li>
                                 <h4>Tags</h4><span class="col">:</span>
                                 <p>'.$tags.'</p>
                            </li>
                            <li>
                                 <h4>Designation</h4><span class="col">:</span>
                                 <p>'.$designation.'r</p>
                            </li>
                            <li>
                                 <h4>Years of experience</h4><span class="col">:</span>
                                 <p>'.$yrsOfExperience.'</p>
                            </li>
                            <li>
                                <h4>Opening Positions</h4><span class="col">:</span>
                                <p>'.$positionsReq.'</p>
                            </li>
                            <li>
                                <h4>Salary Range</h4><span class="col">:</span>
                                <p>'.$salary.'</p>
                            </li>
                        </ul>
               </div>';
     echo $jobview_html_encode;
	?>
    </body>
    </html>
<?php
}

?>
