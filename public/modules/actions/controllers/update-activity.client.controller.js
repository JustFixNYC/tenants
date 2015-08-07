'use strict';

// Issues controller
angular.module('actions').controller('UpdateActivityController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  //$scope.newActivity.

  

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});