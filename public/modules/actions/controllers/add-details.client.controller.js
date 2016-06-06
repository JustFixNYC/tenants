'use strict';

// Issues controller
angular.module('actions').controller('AddDetailsController', ['$scope', '$filter', '$modalInstance', 'newActivity', 'Problems',
  function ($scope, $filter, $modalInstance, newActivity, Problems, close) {

  $scope.newActivity = newActivity;

  $scope.issues = Problems.getUserIssuesByKey($scope.newActivity.key);

  $scope.formSubmitted = false;

  // $scope.areas = Issues.getUserAreas().map(function (a) { return $filter('areaTitle')(a) });

  //console.log('update activity cntrl',$scope.newActivity);

  $scope.onFileSelect = function(files) {
    console.log(files);
  };

  $scope.done = function (isValid) {

    $scope.formSubmitted = true;

    if(isValid) {
      $modalInstance.close({ newActivity: $scope.newActivity });
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
