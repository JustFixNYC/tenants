
'use strict';

angular.module('admin')
  .controller('AdminController', ['$scope', 'Referrals', 'UserListingService', 'Authentication', 'Users',
    function($scope, Referrals, UserListing, Authentication, Users) {

      $scope.list = function() {
        $scope.referrals = Referrals.query();
      };

	}]);
