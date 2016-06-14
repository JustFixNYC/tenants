'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityPublicController', ['$scope', '$location', '$http', '$filter', 'Activity', 'Lightbox',
  function($scope, $location, $http, $filter, Activity, Lightbox) {


    var query = $location.search();
    if(!query.key) $location.go('/');

    $scope.list = function() {
      Activity.public({ key: query.key }, function(user) {
        $scope.user = user;
        $scope.activities = $scope.user.activity;
      });
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
