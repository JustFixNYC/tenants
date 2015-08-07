'use strict';

angular.module('actions').controller('ComplaintLetterController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});