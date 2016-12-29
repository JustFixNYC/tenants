'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Authentication', '$state',
  function($scope, $rootScope, $filter, Activity, Authentication, $state) {

  	$scope.printable = false;

  	// If we need to reload view (should be fired in parent)
  	$scope.reloadView = function() {
  		$scope.printable = false; 
  		$state.reload();
  	};

    $scope.list = function() {
    	var photoOrder = 0;

      $scope.activities = Activity.query({}, function(data){
      	data.reverse();

      	for(var i = 0; i < data.length; i++) {
      		if(data[i].photos.length) {
      			data[i].photosExist = true;
      			for (var j = 0; j < data[i].photos.length; j ++) {
      				data[i].photos[j].order = photoOrder;
      				photoOrder++;
      			}
      		}
      	}

      }, function(error) {
      	console.log(error);
      });
    };

    $rootScope.headerLightBG = true;

    $scope.user = Authentication.user;

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
