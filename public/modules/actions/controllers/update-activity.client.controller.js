'use strict';

// Issues controller
angular.module('actions').controller('UpdateActivityController', ['$scope', '$modalInstance', 'newActivity', 'Issues',
  function ($scope, $modalInstance, newActivity, Issues, close) {

  $scope.newActivity = newActivity;
  $scope.issues = Issues.getUserIssuesByKey($scope.newActivity.key);
  
  console.log('update activity cntrl',$scope.newActivity);

  $scope.dp = {
    opened: false,
  };

  $scope.openDp = function() {

      $scope.dp.opened = !$scope.dp.opened;
      console.log('wtf');
    };


 // $scope.open

  $scope.onFileSelect = function(files) {
    console.log(files);
  };

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);