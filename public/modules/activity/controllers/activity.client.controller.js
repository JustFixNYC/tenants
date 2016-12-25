'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', '$filter', 'deviceDetector', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, $filter, deviceDetector, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;
    $scope.location = $location.host();

    $scope.shareCollapsed = false;

    $scope.isDesktop = deviceDetector.isDesktop();

    $scope.list = function() {
      // $scope.activities = Activity.query();
      $scope.activities = $scope.authentication.user.activity;
    };

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    // $scope.compareDates = function(start, created) {
    //   var startDate = new Date(start).setHours(0,0,0,0);
    //   var createdDate = new Date(created).setHours(0,0,0,0);
    //   return startDate !== createdDate;
    // }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);
