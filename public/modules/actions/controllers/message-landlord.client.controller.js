'use strict';

angular.module('actions').controller('MessageLandlordController', ['$scope','$modalInstance', 'Messages', 'newActivity', 
  function ($scope, $modalInstance, Messages, newActivity) {

    $scope.newActivity = newActivity;

    $scope.email = {};
    $scope.email.content = Messages.getLandlordEmailMessage();

    $scope.done = function () {
      $scope.email.contact = $scope.email.landlord + '?subject=' + Messages.getLandlordEmailSubject();
      $scope.emailHref = 'mailto:' + encodeURI($scope.email.contact + '&body=' + $scope.email.content);
      $modalInstance.close($scope.newActivity);
      window.location.href = $scope.emailHref;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);