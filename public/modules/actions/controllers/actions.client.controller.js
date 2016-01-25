'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', 'Authentication', 'Actions', 'Activity',
  function($scope, $location, Authentication, Actions, Activity) {
    //$scope.authentication = Authentication;
    $scope.user = Authentication.user;

    $scope.showStatusUpdates = function() {
      if($scope.user.actionFlags) return $scope.user.actionFlags.indexOf('allInitial') !== -1;
      else return false;
    };

    $scope.list = function() {
      $scope.actions = Actions.query();
    };

  }
]);
