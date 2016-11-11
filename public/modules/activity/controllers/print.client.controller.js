'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$stateParams', '$state', '$http', '$filter', 'Activity', 'Lightbox',
  function($scope, $stateParams, $state, $http, $filter, Activity, Lightbox) {

    $scope.list = function() {
      $scope.activities = Activity.query();
      console.log($scope.activities);
    };

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
