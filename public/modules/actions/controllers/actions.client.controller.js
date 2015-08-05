'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Actions',
  function($scope, $location, $http, Authentication, Users, Actions) {
    $scope.authentication = Authentication;

    //$scope.actions = $scope.authentication.user.actions;

    $scope.list = function() {
      // console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);