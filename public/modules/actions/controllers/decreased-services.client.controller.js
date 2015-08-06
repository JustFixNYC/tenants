'use strict';

angular.module('actions').controller('DecreasedServicesController', function ($scope, $modalInstance, newUpdate) {

  $scope.newUpdate = newUpdate;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.addUpdate = function () {
    $modalInstance.close($scope.newUpdate);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});