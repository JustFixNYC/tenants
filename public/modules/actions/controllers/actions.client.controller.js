'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', '$modal', 'Authentication', 'Actions',
  function($scope, $location, $modal, Authentication, Actions) {
    $scope.authentication = Authentication;

    //$scope.actions = $scope.authentication.user.actions;
    $scope.openModal = function(title) {

      $scope.newUpdate = {};
      $scope.newUpdate.title = title;

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'modules/actions/partials/update-activity.client.view.html',
        controller: 'UpdateActivityController',
        resolve: {
          newUpdate: function () {
            return $scope.newUpdate;
          }
        }
      });

      modalInstance.result.then(function (newUpdate) {
        $scope.newUpdate = newUpdate;
        console.log('submitted:', $scope.newUpdate);
      }, function () {
      });
    };


    $scope.list = function() {
      // console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);