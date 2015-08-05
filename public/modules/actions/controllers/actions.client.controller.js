'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', '$modal', 'Authentication', 'Actions',
  function($scope, $location, $modal, Authentication, Actions) {
    $scope.authentication = Authentication;

    //$scope.actions = $scope.authentication.user.actions;
    $scope.openModal = function (size) {

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'modules/actions/partials/update-activity.client.view.html',
        controller: 'UpdateActivityController',
        resolve: {
          // items: function () {
          //   return $scope.items;
          // }
        }
      });

      // modalInstance.result.then(function (selectedItem) {
      //   $scope.selected = selectedItem;
      // }, function () {
      // });
    };


    $scope.list = function() {
      // console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);