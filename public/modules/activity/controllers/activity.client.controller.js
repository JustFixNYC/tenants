'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', '$filter', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, $filter, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;
    $scope.location = $location.host();

    $scope.shareCollapsed = false;

    $scope.list = function() {

      $scope.activities = Activity.query();
      // console.log($scope.activities);
    };

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);
