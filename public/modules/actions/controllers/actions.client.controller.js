'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$filter', 'Authentication', 'Actions', 'Activity',
  function($scope, $filter, Authentication, Actions, Activity) {
    //$scope.authentication = Authentication;
    $scope.user = Authentication.user;

    $scope.userCompletedDetails = function() {
      if($scope.user.actionFlags) {
        return $scope.user.actionFlags.indexOf('allInitial') !== -1;
      }
      else return false;
    };

    $scope.list = function() {
      Actions.query(function(actions) {
        $scope.onceActions = $filter('filter')(actions, { $: 'once' }, true);
        $scope.recurringActions = $filter('filter')(actions, { $: 'recurring' }, true);
        $scope.legalActions = $filter('filter')(actions, { $: 'legal' }, true);
      });

    };

  }
]);
