'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', 'Authentication', 'Actions', 'Activity',
  function($scope, $location, Authentication, Actions, Activity) {
    $scope.authentication = Authentication;

    $scope.list = function() {
      //console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);