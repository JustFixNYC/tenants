'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Lightbox', 'Authentication', '$window',
  function($scope, $rootScope, $filter, Activity, Lightbox, Authentication, $window) {

    $scope.list = function() {
      $scope.activities = Activity.query();

      var fixPrint = function(){
      	console.log('huh?');
			  var printContents = document.documentElement.outerHTML;
      }


      fixPrint();
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

	}
]);
