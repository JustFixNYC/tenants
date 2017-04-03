'use strict';

angular.module('admin')
  .controller('AdminController', ['$scope', '$q', '$modal', 'Passwords',
    function($scope, $q, $modal, Passwords) {


      $scope.newTempPassword = {};

      $scope.createTempPassword = function() {
        var newPassword = new Passwords($scope.newTempPassword);
        newPassword.$create(function(success) {
          $scope.tempPasswordError = false;
          $scope.tempPasswordMessage = "Success!";
        }, function(error) {
          $scope.tempPasswordError = true;
          $scope.tempPasswordMessage = error.data.message;
        });
      };

}]);
