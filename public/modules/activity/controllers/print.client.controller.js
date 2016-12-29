'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Authentication', '$state',
  function($scope, $rootScope, $filter, Activity, Authentication, $state) {

  	$scope.printable = false;
    $scope.user = Authentication.user; // TODO: use 'user' to determine user status, see if we can remove the URL query params
    console.log($scope.user);

  	// If we need to reload view (should be fired in parent)
  	$scope.reloadView = function() {
  		$scope.printable = false; 
  		$state.reload();
  	};

    $scope.list = function() {
    	var photoOrder = 0;

    	// abstract our actual data transformation into this function
    	var dataTagAndOrder = function(data) {
      	data.reverse();

      	for(var i = 0; i < data.length; i++) {
      		if(data[i].photos.length) {
      			data[i].photosExist = true;
      			for (var j = 0; j < data[i].photos.length; j++) {
      				data[i].photos[j].order = photoOrder;
      				photoOrder++;
      			}
      		}
      	}
      	return data;
    	}

    	if($scope.user){
    		// if we have a logged in user, the activity array will be updated, and we can return that saved val
				$scope.activities = $scope.user.activity;

	    } else {

		  	// handle publically accessible view w/ key (Possible to do this with access key in url query?)
		  	var url = (window.location != window.parent.location) ? document.referrer : document.location.href;

		  	if(url.indexOf('/share/') > -1) {
		  		var key = {
		  			key: url.slice(url.lastIndexOf('/') + 1, url.length)
		  		};
		  	} else {
		  		console.log('Error! No public key available. Please contact us at help@justfix.nyc');
		  	}
	    	// if we have a key, we'll need to query via the 'public' method on the Activity service (diff query params)
	    	Activity.public(key, function(data) {
	    		$scope.activities = dataTagAndOrder(data.activity);
	    	}, function(error) {
	    		console.log(error);
	    	});

	    }
    };

    $rootScope.headerLightBG = true;

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $rootScope.$on('$viewContentLoaded', function() {
    	$scope.printable = true;
    });

	}
]);
