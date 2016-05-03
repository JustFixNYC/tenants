'use strict';

angular.module('actions').controller('DecreasedServicesController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.addUpdate = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
