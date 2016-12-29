'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Authentication', '$state',
  function($scope, $rootScope, $filter, Activity, Authentication, $state) {

  	$scope.printable = false;
    $scope.user = Authentication.user;

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
				$scope.activities = dataTagAndOrder($scope.user.activity);
	    } else {

		  	// handle publically accessible view w/ URL
		  	// TODO: figure out how to pass key from parent pg controller, to directive, into the iframe? ($state.params returns print, not parent params)
		  	var url = (window.location != window.parent.location) ? document.referrer : document.location.href;

		  	// Safety check, if we aren't logged in and are querying for the key then something's gone horribly wrong
		  	if(url.indexOf('/share/') > -1) {
		  		var key = {
		  			key: url.slice(url.lastIndexOf('/') + 1, url.length)
		  		};
		  	} else {
		  		console.log('Error! No public key available. Please contact us at help@justfix.nyc');
		  	}

	    	// if we have a key, we'll need to query via the 'public' method on the Activity service (diff query params)
	    	Activity.public(key, function(data) {
	    		$scope.user = data;
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
