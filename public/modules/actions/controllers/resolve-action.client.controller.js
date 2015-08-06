'use strict';

// Issues controller
angular.module('actions').controller('ResolveActionController', function ($scope, $modalInstance, newAction) {

  $scope.newAction = newAction;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.resolveAction = function () {
    $modalInstance.close($scope.newAction);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});