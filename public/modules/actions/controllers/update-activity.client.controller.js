'use strict';

// Issues controller
angular.module('actions').controller('UpdateActivityController', ['$scope', '$modalInstance', 'newActivity', 'Issues',
  function ($scope, $modalInstance, newActivity, Issues) {

  $scope.newActivity = newActivity;
  $scope.issues = Issues.getUserIssuesByKey($scope.newActivity.key);
  
  console.log($scope.newActivity);

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);