'use strict';

angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users',
  function($scope, $location, $http, Authentication, Users) {

    $scope.list = function() {
      $scope.activity = Activity.query();
    };

	}
]);