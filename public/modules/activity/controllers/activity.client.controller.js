'use strict';

angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Activity',
  function($scope, $location, $http, Authentication, Users, Activity) {

    $scope.list = function() {
      $scope.activities = Activity.query();
    };

	}
]);