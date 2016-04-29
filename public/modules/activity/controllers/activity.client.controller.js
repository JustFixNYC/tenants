'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;

    $scope.list = function() {
      $scope.activities = Activity.query();
      console.log($scope.activities);
    };

    $scope.activityTemplate = function(key) {
      return '/modules/activity/partials/default-activity.client.view.html';
    };

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);
