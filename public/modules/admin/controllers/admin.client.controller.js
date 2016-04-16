'use strict';

angular.module('admin')
  .controller('AdminController', ['$scope', '$q', '$modal', 'Referrals',
    function($scope, $q, $modal, Referrals) {

      $scope.list = function() {
        $scope.referrals = Referrals.query();
      };

      $scope.newReferral = {
        name: 'Dan Kass',
        phone: '8459781262',
        email: 'romeboards@gmail.com',
        organization: 'Community Group'
      };
      $scope.deleteReferralEmail = "romeboards@gmail.com";

      $scope.showCodes = function(codes) {

        var modalInstance = $modal.open({
          templateUrl: 'modules/admin/partials/show-codes.client.view.html',
          controller: function($scope, $modalInstance, codes) {
            $scope.codes = codes;
            $scope.close = function(result) { $modalInstance.close(); };
          },
          resolve: {
            codes: function () { return codes; } 
          }
        });
      };

      $scope.create = function() {
        var newReferral = new Referrals($scope.newReferral);
        newReferral.$save(function(referral) {
          $scope.list();
        });
      };

      $scope.delete = function() {

        var toBeDeletedPromises = [];

        var toBeDeleted = Referrals.query({ email: $scope.deleteReferralEmail }, function() {
          if(!toBeDeleted.length) console.log('No referrals found for that email.');
          for(var i = 0; i < toBeDeleted.length; i++) {
            toBeDeletedPromises.push(toBeDeleted[i].$delete({ id: toBeDeleted[i]._id }).$promise);
          }
          $q.all(toBeDeletedPromises).then(function () {
            $scope.list();
          });
        });
      };

}]);
