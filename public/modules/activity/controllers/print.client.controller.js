'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Authentication', '$state', '$stateParams',
  function($scope, $rootScope, $filter, Activity, Authentication, $state, $stateParams) {

  	$scope.printable = false;
    // $scope.user = Authentication.user;

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
    	};

      // logged in user printing from their case history page
      if(Authentication.user && !$stateParams.key) {

        // console.log('user');

        $scope.user = Authentication.user;
        $scope.activities = dataTagAndOrder($scope.user.activity);

      // all other situations
      } else if($stateParams.key) {

        // console.log('key');

        // if we have a key, we'll need to query via the 'public' method on the Activity service (diff query params)
      	Activity.public({'key': $stateParams.key}, function(data) {
      		$scope.user = data;
      		$scope.activities = dataTagAndOrder(data.activity);
      	}, function(error) {
      		console.log(error);
      	});

      } else {
        // return $scope.stopPrint = true;
        $scope.stopPrint = true;
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
    };

    $rootScope.$on('$viewContentLoaded', function() {
    	if(!$scope.stopPrint) {
    		$scope.printable = true;
    	}
    });

	}
]);
