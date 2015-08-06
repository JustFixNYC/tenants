'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', '$modal', 'Authentication', 'Actions',
  function($scope, $location, $modal, Authentication, Actions) {
    $scope.authentication = Authentication;

    $scope.openModal = function(title, template, controller) {

      $scope.newUpdate = {};
      $scope.newUpdate.title = title;

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'modules/actions/partials/' + template,
        controller: controller,
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

    $scope.openDefaultModal = function() {
      $scope.openModal('', 'update-activity.client.view.html', 'UpdateActivityController');
    };

    $scope.resolveAction = function(title) {

      $scope.newAction = {};
      $scope.newAction.title = title;

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'modules/actions/partials/resolve-action.client.view.html',
        controller: 'ResolveActionController',
        resolve: {
          newAction: function () {
            return $scope.newAction;
          }
        }
      });

      modalInstance.result.then(function (newAction) {
        $scope.newAction = newAction;
        console.log('submitted:', $scope.newAction);
      }, function () {
      });
    };

    $scope.list = function() {
      // console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);