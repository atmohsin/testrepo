<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * User: Mohsin
 * Date: 24/03/15
 */

$hostName = $_SERVER['HTTP_HOST'];

$jobUrlId = $_GET['id'];


if (in_array($_SERVER['HTTP_USER_AGENT'], array(
		'googlebot'
))) {
	$SITE_ROOT = "http://zwayam.com:8080/ccubeserver/";
	$jsonData = getData($jobUrlId,$SITE_ROOT);
	makePage($jsonData);

}
else {
	$jobUrlParam = 'http://'.$GLOBALS['hostName'].'/#!/job-view/'.$GLOBALS['jobUrlId'];
    header('Location: '.$jobUrlParam);
}



function getData($jobUrlId,$siteRoot) {
	$rawData = file_get_contents($siteRoot.'ccubeAPI/getJobForUrl/'.$jobUrlId);
	return json_decode($rawData);
}


function makePage($data) {
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
	$keyWords = $data->metaTags;
	
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

}
?>

