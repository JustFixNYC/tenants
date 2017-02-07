'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityPublicController', ['$scope', '$stateParams', '$state', '$http', '$filter', 'Activity', 'Lightbox',
  function($scope, $stateParams, $state, $http, $filter, Activity, Lightbox) {

    var query = $stateParams;
    if(!query.key) $state.go('/');

    $scope.photos = [];

    $scope.list = function() {
      Activity.public({ key: query.key }, function(user) {
        $scope.user = user;
        $scope.activities = $scope.user.activity;
        $scope.activities.forEach(function (act) {
          $scope.photos = $scope.photos.concat(act.photos);
        });
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
