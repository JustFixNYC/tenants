'use strict';

angular.module('actions').controller('ContactSuperController', ['$scope', '$modalInstance', '$timeout', 'deviceDetector', 'Messages', 'newActivity',
  function ($scope, $modalInstance, $timeout, deviceDetector, Messages, newActivity) {

    $scope.newActivity = newActivity;


    $scope.formSubmitted = false;

    $scope.done = function (isValid, event) {

      //wait until after digest loop?
      $timeout(function () {
        $scope.formSubmitted = true;

        console.log(event);

        if(isValid && event.target.href) {
          $modalInstance.close({ newActivity: $scope.newActivity });
          window.location.href = event.target.href;
        } else {
          console.log('no href?');
        }
      }, 0);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
