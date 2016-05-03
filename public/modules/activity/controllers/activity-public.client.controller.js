'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityPublicController', ['$scope', '$location', '$http', 'Activity', 'Lightbox',
  function($scope, $location, $http, Activity, Lightbox) {


    var query = $location.search();
    if(!query.key) $location.go('/');

    $scope.list = function() {
      Activity.public({ key: query.key }, function(user) {
        $scope.user = user;
        $scope.activities = $scope.user.activity;
      });
    };

    $scope.activityTemplate = function(key) {
      var template = '/modules/activity/partials/';
      switch(key) {
        case 'sendLetter':
          template += 'complaint-letter.client.view.html';
          break;
        default:
          template += 'default-activity.client.view.html';
          break;
      };
      return template;
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
