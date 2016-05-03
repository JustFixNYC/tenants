'use strict';

angular.module('actions').controller('HpactionController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
