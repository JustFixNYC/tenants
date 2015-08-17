'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, Authentication, Users, Activity, Lightbox) {

    $scope.list = function() {
      $scope.activities = Activity.query();
    };

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);