var app = angular.module('myApp', [ 'ngRoute', 'config', 'simplePagination','ngSanitize','vcRecaptcha','angular-meditor','toaster','ngActivityIndicator','ngDialog']);

/**
 * This directive refresh the social sharing widget
 */
app.directive('addthisToolbox', function() {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        link: function ($scope, element, attrs) {
            // Checks if addthis is loaded yet (initial page load)
            if (addthis.layers.refresh) {
               addthis.layers.refresh();
            }
        }
    };
});

app.factory("services", [
		'$http',
		'$location',
		'WEBSERVICEURL',
		'COMPANYID',
		function($http, $location, WEBSERVICEURL, COMPANYID) {

			var obj = {};

			// Featured Job API
			obj.getFeaturedJobList = function() {
				return $http.get(WEBSERVICEURL + 'ccubeAPI/list/' + COMPANYID)
			};

			// Search Job API

			obj.getSearchJobList = function(searchJobName, searchlocation) {

				var name = searchJobName;
				var loc = searchlocation;

				if (name == "") {
					name = "empty";
				}
				if (loc == "") {
					loc = "empty";
				}

				return $http.get(WEBSERVICEURL + 'ccubeAPI/searchJob/'
						+ COMPANYID + '/' + name + '/' + loc);

			};
			
			//Get applicant job application 
			obj.getJobApplicationByJobUrl = function(jobUrl) {

				return $http.get(WEBSERVICEURL + '/ccubeAPI/getJobApplicationByJobUrl/' + jobUrl);

			};

			// View job

			obj.getjob = function(id) {

				return $http.get(WEBSERVICEURL + '/ccubeAPI/getJob/' + id);

			};
			
			obj.getjobforurl = function(jobUrl) {

				return $http.get(WEBSERVICEURL + '/ccubeAPI/getJobForUrl/' + jobUrl);

			};
			
			obj.applyJob = function(jobApplication, jobId, file, fileName, siteUrl) {

				jobApplication.companyId = COMPANYID;
				jobApplication.jobId = jobId;
				jobApplication.fileName = fileName;
				var url = siteUrl;
				var fd = new FormData();
				fd.append('data', angular.toJson(jobApplication));

				if (file != "null") {
					var oBlob = new Blob([ 'test' ], {
						type : "text/plain"
					});
					fd.append("file", file, fileName);
				}
				
				fd.append("siteUrl", url);
				
				return $http.post(WEBSERVICEURL + '/ccubeAPI/applyJob', fd, {
					transformRequest : angular.identity,
					headers : {
						'Content-Type' : undefined
					}
				});

			}
			

			obj.saveWorkingContent = function (model) {
				model.companyId = COMPANYID;
				$http({
			        method: 'POST',
			        url: WEBSERVICEURL +'/ccubeAPI/saveWorkingFolder',
			        data: model,
			        headers: {
			            "Content-Type": "application/json",
			            "Accept": "text/plain, application/json"
			        }
			    })
			    .then(function (response) {
			    	
			    	
			        return;
			    });
				
				
			};
			
			obj.loadElementData = function(jobUrl) {
				

			var url = window.location.href;

				if (url.indexOf('/work/') > -1) {

					return $http.get(WEBSERVICEURL
							+ '/ccubeAPI/loadHTMLElements/' + COMPANYID
							+ '/preview');
				} else if (url.indexOf('/themes/') > -1) {
					return $http.get(WEBSERVICEURL
							+ '/ccubeAPI/loadHTMLElements/' + COMPANYID
							+ '/Theme3');
				} else {

					return $http.get(WEBSERVICEURL
							+ '/ccubeAPI/loadHTMLElements/' + COMPANYID
							+ '/publish');
				}
				
				
				

			};
			
			obj.saveElementData = function (textElement,$activityIndicator) {
				//alert("saveElementData"+textElement.id);
				//alert("Inside service save element data");
				
				$http({
			        method: 'POST',
			        url: WEBSERVICEURL +'/ccubeAPI/saveElementDataToWorkCopy/'+COMPANYID,
			        data: textElement,
			        headers: {
			            "Content-Type": "application/json",
			            "Accept": "text/plain, application/json"
			        }
			    })
			    .then(function (response) {
			    	//alert(response);
			    	$activityIndicator.stopAnimating();
			        return;
			    });
				
				
			};

			return obj;
		} ]);

function JobSearchController($scope, services, $location, $rootScope,$activityIndicator) {

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.jobs = [];
	$activityIndicator.startAnimating();
	services.getSearchJobList($rootScope.jobkeyword, $rootScope.location).then(
			function(data) {
				$scope.jobs = data.data;
				$activityIndicator.stopAnimating();
			});

	$scope.pageChangeHandler = function(num) {
		console.log('meals page changed to ' + num);
	};

}

function PaginationController($scope) {
	$scope.pageChangeHandler = function(num) {
		console.log('going to page ' + num);
	};
}

app.controller('JobSearchController', JobSearchController);
app.controller('PaginationController', PaginationController);

app.run([ '$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		$rootScope.title = current.$$route.title;
	});
} ]);

app.controller('searchJobListCtrl', function($scope, services, $location,
		$rootScope, Pagination,$activityIndicator) {
	
	$scope.searchJob = function() {
		$scope.pagination = Pagination.getNew(5);
		$activityIndicator.startAnimating();
		services.getSearchJobList($scope.jobkeyword, $scope.location).then(
				function(data) {
					$activityIndicator.stopAnimating();
					$scope.job = data.data;
					$scope.pagination.numPages = Math.ceil($scope.job.length
							/ $scope.pagination.perPage);
					$scope.longDescription = "test data";
					$rootScope.jobkeyword = $scope.jobkeyword;
					$rootScope.location = $scope.location;
					$location.path('/joblist');

				});
	}

	$scope.init = function() {
		this.searchJob();
	};

	$scope.viewJobPage = function(jobUrl) {
		//$rootScope.jobId = id;
		$location.path('job-view/'+jobUrl);
	}

});

app.controller('searchJobListCtrlforJoblisting', function($scope, services,
		$location, $rootScope,$activityIndicator) {

	$activityIndicator.startAnimating();
	services.getSearchJobList($rootScope.jobkeyword, $rootScope.location).then(
			function(data) {

				$scope.job = data.data;
				$activityIndicator.stopAnimating();
			});

	$scope.searchJob = function() {

		$rootScope.jobkeyword = $scope.jobkeyword;
		$rootScope.location = $scope.location;
		$location.path('/joblist2');

	}

});

app.controller('viewJobCtrl', function($scope, services, $location, $rootScope,
		$routeParams,$activityIndicator) {

	var jobUrl = $routeParams.jobUrl;
	//var jobID = $rootScope.jobId;
	$('.dialog-loading-wrapper').css('display','block');
	$activityIndicator.startAnimating();
	services.getjobforurl(jobUrl).then(function(data) {

		var job = data.data;
		$scope.job = job;

		/*var original = job;
		original._id = jobID;
		$scope.job = angular.copy(original);
		$scope.job._id = jobID;*/
		
		var minYearsOfExperice = job.minYrsOfExperience;
		var maxYrsOfExperience = job.maxYrsOfExperience;
		
		if(maxYrsOfExperience && minYearsOfExperice){
			$scope.displayExperience = minYearsOfExperice+" to "+maxYrsOfExperience +" Years";
		}
		else if(maxYrsOfExperience && !minYearsOfExperice){
			$scope.displayExperience = "Upto "+maxYrsOfExperience+ " Years";
		}
		else if(!maxYrsOfExperience && minYearsOfExperice){
			$scope.displayExperience = "Above "+minYearsOfExperice+ " Years";
		}
		
		var jobTags = job.tags;
		
		if(jobTags){
			var jsonObj = [];
			var index;
			var tagsArray = jobTags.split(',');
		
			for	(index = 0; index < tagsArray.length; index++) {
				if ($scope.displayTags ) {
					$scope.displayTags = $scope.displayTags +"<span>&nbsp;&nbsp;"+"<a ng-style='background-color:red' class='tag'>"+tagsArray[index]+"</a>";
				}
				else {
					$scope.displayTags = "<a class='tag' href=''>"+tagsArray[index]+"</a>";
				}
			    
			}
		}
		
		$activityIndicator.stopAnimating();
		$('.dialog-loading-wrapper').css('display','none');

	});

	$scope.applyJobPage = function(id, jobUrl) {
		$rootScope.jobId = id;
		$location.path('job-apply/'+jobUrl);
	}

});

app.controller('featuredJobListCtrl', function($scope, services, $location,
		$rootScope,$activityIndicator,$window) {

	$scope.jobkeyword = "";
	$scope.location = "";
	$rootScope.jobkeyword = "";
	$rootScope.location = "";
	var url = window.location.href;
	
	if (url.indexOf('/configure') === -1) {
		$activityIndicator.startAnimating();
	}

	services.getFeaturedJobList().then(function(data) {

		$scope.featuredJob = data.data;
		$activityIndicator.stopAnimating();
	});

	$scope.viewJobPage = function(jobUrl) {
		//$rootScope.jobId = id;
		$location.path('job-view/'+jobUrl);
	}
	
	$scope.manageJob = function() {
		
		window.open("./manage/#/dash?emailId="+$rootScope.emailId,'_blank');
		//$window.location.href ="./manage/#/ccube/dash?emailId="+$rootScope.emailId;
		
		}

});

app.controller('publishCtrl', function($scope, services, $location,
		$rootScope,ngDialog,$routeParams) {

	$rootScope.emailId=$routeParams.emailId;
	$rootScope.domain=$routeParams.domain;
	
	ngDialog.open({ template: 'congratulationsDailog' });
	
	$scope.jobkeyword = "";
	$scope.location = "";
	$rootScope.jobkeyword = "";
	$rootScope.location = "";
	$activityIndicator.startAnimating();
	services.getFeaturedJobList().then(function(data) {

		$scope.featuredJob = data.data;
		$activityIndicator.stopAnimating();
	});

	$scope.viewJobPage = function(jobUrl) {
		//$rootScope.jobId = id;
		$location.path('job-view/'+jobUrl);
	}
	
	$scope.manageJob = function(emailId) {
		
		$window.location.href ="./manage/#/dash?emailId="+$rootScope.emailId;
		
		}

});

//Applicant job-application view
app.controller('applicantJobViewCtrl', function($scope, services, $location,
		$rootScope, $routeParams,$activityIndicator) {
	
	var jobUrl = $routeParams.jobUrl;
	$activityIndicator.startAnimating();
	services.getJobApplicationByJobUrl(jobUrl).then(function(data) {

		var jobApplication = data.data;
		$scope.jobApplication = jobApplication;
		

		if ($scope.jobApplication.status == "P") {

			$scope.status = "Pending";
			
		} else if ($scope.jobApplication.status == "A") {
			
			$scope.status = "Approved";
			
		} else {
			
			$scope.status = "Rejected";
		}
		$activityIndicator.stopAnimating();
	
	});

});

//Thank you
app.controller('thankYouCtrl', function($scope, services, $location,
		$rootScope, $routeParams) {
	
	var url = $rootScope.url;
	
	$scope.jobApplicationUrl = url;

});

app.controller('applyJobCtrl', function($scope, services, $location,
		$rootScope, $routeParams, jobApplication,SITEKEY,$activityIndicator,vcRecaptchaService) {
	
	var siteUrl = $location.absUrl();
	$rootScope.url = "";
	
	$scope.response = "";
	$scope.recapchaerror = false;
	$scope.response = null;
    $scope.widgetId = null;
    $scope.model = {
        key: SITEKEY
    };
    $scope.setResponse = function (response) {
        console.info('Response available');
        $scope.response = response;
        $scope.recapchaerror = false;
    };
    $scope.setWidgetId = function (widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };
    
	$scope.setFileName = function(fileInput) {

		var file = fileInput.value;
		var filename = file.replace(/^.*[\\\/]/, '');
		$scope.fileName = filename;
		//$("#title").html(filename);
		$("#filename").val(filename);
	};

	// var jobID = ($routeParams.jobID) ? parseInt($routeParams.jobID) : 0;
	var jobID = $rootScope.jobId;
	
	if(jobID) {
		
	services.getjob(jobID).then(function(data) {

		var job = data.data;
		$scope.job = job;
		
	});
	
	} else {
		
		var jobUrl = $routeParams.jobUrl;
		
		services.getjobforurl(jobUrl).then(function(data) {

			var job = data.data;
			$scope.job = job;
			
		});
	}

	$scope.applyJob = function($valid) {
		$activityIndicator.startAnimating();
		$scope.JobApplication.vcRecaptchaResponse = $scope.response;
		
		$scope.submitted = true;

		if ($valid) {
		
			var file = fileUpload.files[0];

			if (typeof file == "undefined") {
				file = "null";
			}

			var fileName = $scope.fileName;
			
			services.applyJob($scope.JobApplication, jobID, file, fileName, siteUrl)
			.then(function(data) {
				
				$rootScope.url = data.data.message;
				
				if(data.data.code == 200){ 
					$activityIndicator.stopAnimating();
					$location.path('/thankyou');
					
				}
			});
			
		}
		else {
			 $scope.recapchaerror = true;
		}
	}
	
	$scope.reloadCAPTCHA = function(){
		$scope.response = null;
		vcRecaptchaService.reload($scope.widgetId);
		var recaptchaframe = $('#recaptcha iframe');
        var recaptchaSoure = recaptchaframe[0].src;
        recaptchaframe[0].src = '';
        setInterval(function () { recaptchaframe[0].src = recaptchaSoure; }, 500);
	}
	
});

app
.controller(
		'MainCtrlEditor',
		function($scope, $rootScope, services, toaster,$activityIndicator) {
			'use strict';
			

			var inputStyle ="";
			var oldStyle="";
			
			$scope.homelogotextheading = "loading";
			
			services.loadElementData().then(function(data) {
				//alert (JSON.stringify(data));
			
				
				$(jQuery.parseJSON(JSON.stringify(data.data))).each(function() {  
			         var ID = this.id;
			         
			         var html = prepareHtml(this);
			         
			         if(ID == "homelogotextheading") { 
			        	 if(html){
				        	 $scope.homelogotextheading = html;
				        	 $scope.homelogotextheadingold = html;
				        	 
				        	 $scope.$apply();
			        	 }
			        	 //$scope.homelogotextheadingstyle = {"color":this.style.color,"font-family":this.style.fontFamily,"font-size":this.style.size,"font-weight":this.style.fontWeight,"text-decoration":this.style.textDecoration,"font-style":this.style.fontStyle};
			         }
			         else if (ID == "homebannerpath"){
			        	 $rootScope.bannerImagePath = this.imagePath;
			         }
				});
			
			

		});


			//var model = $scope.model = {};

			//model.careerText = 'Career';

			$scope.saveContent = function(elementContent) {

				var textElement = null;
				
				if(elementContent.id == "homelogotextheading") {
					
					inputStyle = $scope.homelogotextheading;
					oldStyle = $scope.homelogotextheadingold;	
					textElement = prepareTextElement(inputStyle,oldStyle,elementContent.id);
				
				}
				$activityIndicator.startAnimating();
				
				services
						.saveElementData(textElement,$activityIndicator)
						.then(
								function(response) {
									$activityIndicator.stopAnimating();
									if (response.data.code === 1) {
										toaster
												.pop('success', "",
														"Content saved to current directory successfully.");

									} else {
										toaster
												.pop('error', "",
														"Error occured while saving.");
									}

								});

			}

			

			

		});


app.config([ '$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		title : 'Home',
		templateUrl : 'home.html',
		controller : 'featuredJobListCtrl'
	})

	.when('/Theme1', {
		title : 'Home',
		templateUrl : 'Ajs/home.html',
		controller : 'featuredJobListCtrl'
	}).when('/joblist', {
		title : 'Job List',
		templateUrl : 'job-listing.html',
		controller : 'searchJobListCtrl'

	})

	.when('/joblist2', {
		title : 'Job List',
		templateUrl : 'job-listing.html',
		controller : 'searchJobListCtrlforJoblisting'

	})

	.when('/job-view/:jobUrl', {
		title : 'View Job',
		templateUrl : 'job-view.html',
		controller : 'viewJobCtrl'
	})

	.when('/job-apply/:jobUrl', {
		title : 'Apply Job',
		templateUrl : 'apply.html',
		controller : 'applyJobCtrl',
		resolve : {
			jobApplication : function(services, $route) {
				var jobID = $route.current.params.jobID;

				//alert(jobID);

				// return services.getjob(jobID);
			}
		}
	})

	.when('/thankyou', {
		title : 'Thank you',
		templateUrl : 'thank-you.html',
		controller : 'thankYouCtrl'
	})
	
	.when('/application-view/:jobUrl', {
		title : 'Job Application',
		templateUrl : 'application-view.html',
		controller : 'applicantJobViewCtrl'
	})
	
	.when('/publish/:emailId/:domain', {
		title : 'Home',
		templateUrl : 'home.html',
		controller : 'publishCtrl'
		
	})

	.otherwise({
		redirectTo : '/'
	});
} ]);
app.run([
		'$route',
		'$rootScope',
		'$location',
		function($route, $rootScope, $location) {
			var original = $location.path;
			$location.path = function(path, reload) {
				if (reload === false) {
					var lastRoute = $route.current;
					var un = $rootScope.$on('$locationChangeSuccess',
							function() {
								$route.current = lastRoute;
								un();
							});
				}
				return original.apply($location, [ path ]);
			};
		} ]);
/**
 * This is utility function to prepare the html
 * @param inputValue
 * @returns {String}
 */
function prepareHtml(inputValue) {
	var html = null;
	if (inputValue.style) {

		if (inputValue.style.length) {
			if (inputValue.style.fontWeight) {
				if (html == null) {

					if (inputValue.style.fontWeight == "bold") {
						html = "<b>" + inputValue.text + "</b>";
					}
				} else {
					if (inputValue.style.fontWeight == "bold") {
						html = "<b>" + html + "</b>";
					}
				}
			}

			if (inputValue.style.textDecoration) {
				if (html == null) {
					if (inputValue.style.textDecoration == "underline") {
						html = "<u>" + inputValue.text + "</u>";
					}
				} else {
					if (inputValue.style.textDecoration == "underline") {
						html = "<u>" + html + "</u>";
					}
				}
			}

			if (inputValue.style.size) {
				if (html == null) {
					html = "<font size='" + inputValue.style.size + "'>"
							+ inputValue.text + "</font>";
				} else {
					html = "<font size='" + inputValue.style.size + "'>" + html
							+ "</font>";
				}
			}

			if (inputValue.style.fontFamily) {
				if (html == null) {
					html = "<span style='" + inputValue.style.fontFamily + "'>"
							+ this.text + "</span>";
				} else {
					html = "<span style='" + inputValue.style.fontFamily + "'>"
							+ html + "</span>";
				}
			}

			if (inputValue.style.color) {
				if (html == null) {
					html = "<font color='" + inputValue.style.color + "'>"
							+ inputValue.text + "</font>";
				} else {
					html = "<font color='" + inputValue.style.color + "'>"
							+ html + "</font>";
				}
			}
		} else {
			html = inputValue.text;
		}
	}
	//alert(html);
	return html;
}


function prepareTextElement(inputStyle,oldStyle,elementId){
	
	var textElement = null;
	var styleSizeValue = null;
	var styleColorValue = null;
	var styleFontFamilyValue = null;
	var styleFontWeightValue = null;
	var styleFontTextDecorationValue = null;
	var styleFontStyleValue = null;
	
	//checking for size
	if (inputStyle.indexOf("size") !=-1) {
		
		var styleValueTemp = inputStyle.substring(inputStyle.indexOf("size")+6)
		styleSizeValue = styleValueTemp.substring(0,styleValueTemp.indexOf('"'));
		//alert(styleSizeValue);
		
	}
	
	if (inputStyle.indexOf("color") !=-1) {
		
		var styleValueTemp = inputStyle.substring(inputStyle.indexOf("color")+7)
		styleColorValue = styleValueTemp.substring(0,styleValueTemp.indexOf('"'));
		//alert(styleColorValue);
		
	}
	
	if (inputStyle.indexOf("font-family") !=-1) {
		
		var styleValueTemp = inputStyle.substring(inputStyle.indexOf("font-family")+12)
		styleFontFamilyValue = (styleValueTemp.substring(0,styleValueTemp.indexOf('"'))).trim();
		//alert(styleColorValue);
		
	}
	
	if (inputStyle.indexOf("<b>") !=-1) {
	
		styleFontWeightValue = "bold";
		
		//alert(styleColorValue);
		
	}
	else {
		if(oldStyle.indexOf("<b>") != -1){
			styleFontWeightValue = "normal";
		}
	}
	
	if (inputStyle.indexOf("<u>") !=-1) {
		
		styleFontTextDecorationValue = "underline";
		//alert(styleColorValue);
		
	}
	else {
		if(oldStyle.indexOf("<u>") != -1){
			styleFontTextDecorationValue = "none";
		}
	}
	
	if (inputStyle.indexOf("<i>") !=-1) {
		
		styleFontStyleValue = "italic";
		//alert(styleColorValue);
		
	}
	
	textElement = {
			id : elementId,
			text : inputStyle,	
			style : {
				color : styleColorValue,
				fontFamily : styleFontFamilyValue,
				size : styleSizeValue,
				fontWeight:styleFontWeightValue,
				textDecoration:styleFontTextDecorationValue,
				fontStyle:styleFontStyleValue
			}
		}
	
	return textElement;
}
