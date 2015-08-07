'use strict';

angular.module('actions').controller('MessageLandlordController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});