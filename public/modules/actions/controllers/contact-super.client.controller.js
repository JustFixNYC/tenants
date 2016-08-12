'use strict';

angular.module('actions').controller('ContactSuperController', ['$scope', '$modalInstance', 'deviceDetector', 'Messages', 'newActivity',
  function ($scope, $modalInstance, deviceDetector, Messages, newActivity) {

    $scope.newActivity = newActivity;


    $scope.formSubmitted = false;

    $scope.done = function (isValid, event) {

      $scope.formSubmitted = true;

      if(isValid && event.target.href) {
        $modalInstance.close({ newActivity: $scope.newActivity });
        window.location.href = event.target.href;
      } else {
        console.log('no href?');
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
