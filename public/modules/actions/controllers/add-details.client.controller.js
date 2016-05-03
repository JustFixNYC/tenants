'use strict';

// Issues controller
angular.module('actions').controller('AddDetailsController', ['$scope', '$filter', '$modalInstance', 'newActivity', 'Issues',
  function ($scope, $filter, $modalInstance, newActivity, Issues, close) {

  $scope.newActivity = newActivity;

  //console.log($scope.newActivity);

  $scope.issues = Issues.getUserIssuesByKey($scope.newActivity.key);
  $scope.areas = Issues.getUserAreas().map(function (a) { return $filter('areaTitle')(a) });

  //console.log('update activity cntrl',$scope.newActivity);

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
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
