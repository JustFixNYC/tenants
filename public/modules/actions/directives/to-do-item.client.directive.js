'use strict';

angular.module('actions')
  .directive('toDoItem', ['$modal', '$sce', 'Actions', function ($modal, $sce, Actions) {
    return {
      restrict: 'E',
      scope: {
        action: '=',
      },
      //template: '<div class="map"></div>',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {
        $scope.action.contentHTML = $sce.trustAsHtml($scope.action.content);
      },
      link: function (scope, element, attrs) {

        //scope.action is a $resource!
        scope.completed = false;
        scope.newActivity = {
          title: scope.action.title,
          key: scope.action.key
        };

        scope.isModal = function() {
          switch(scope.action.cta.type) {
            case 'initialContent': return true;
            case 'modal': return true;
            default: return false;
          }
        };

        scope.openModal = function() {

          var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
            controller: scope.action.cta.controller
          });

          modalInstance.result.then(function () {
            //$scope.newUpdate = newUpdate;
            if(scope.action.cta.type !== 'initialContent') scope.triggerFollowUp();
            else {
              scope.completed = true;
              scope.closeAlert = false;
            }
          }, function () {
            console.log('modal cancelled');
            // modal cancelled
          });
        };

        scope.openDefaultModal = function() {
          scope.openModal('', 'update-activity.client.view.html', 'UpdateActivityController');
        };
        
        scope.triggerFollowUp = function() {
          scope.action.$followUp({ type: 'add' });
        };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });         
        };

        scope.createActivity = function() {
          console.log(scope.newActivity);
          scope.completed = true;
          scope.closeAlert = false;
        };

        // scope.closeAlert = function() {
        //   console.log('close');
        //   scope.close = true;
        // }
      }
    };
  }]);