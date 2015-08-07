'use strict';

angular.module('actions').controller('ContactSuperController', function ($scope, $modalInstance) {

  //$scope.newUpdate = newUpdate;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.done = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});