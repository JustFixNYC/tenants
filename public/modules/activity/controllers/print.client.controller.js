'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$stateParams', '$state', '$filter', 'Activity', 'Lightbox', 'Authentication', '$window',
  function($scope, $stateParams, $state, $filter, Activity, Lightbox, Authentication, $window) {

    $scope.list = function() {
      $scope.activities = Activity.query();
      console.log($scope.activities);
    };

    $scope.user = Authentication.user;

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $scope.print = function() {
		  var printContents = document.getElementsByTagName('html').innerHTML;
		  console.log(printContents);
		  // var popupWin = window.open('', '_blank', 'width=300,height=300');
		  // popupWin.document.open();
		  // popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
		  // popupWin.document.close();
    }
	}
]);
