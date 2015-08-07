'use strict';

angular.module('actions')
  .directive('toDoItem', ['$modal', '$sce', 'Activity', function ($modal, $sce, Activity) {
    return {
      restrict: 'E',
      scope: {
        action: '=',
      },
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {
        $scope.action.contentHTML = $sce.trustAsHtml($scope.action.content);
      },
      link: function (scope, element, attrs) {

        //scope.action is a $resource!
        scope.completed = false;
        scope.newActivity = {
          date: new Date(),
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
            controller: scope.action.cta.controller,
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          modalInstance.result.then(function (newActivity) {
            scope.newActivity = newActivity;
            if(scope.action.cta.type !== 'initialContent') scope.triggerFollowUp();
            else scope.createActivity();
          }, function () {
            console.log('modal cancelled');
            // modal cancelled
          });
        };

        // scope.openDefaultModal = function() {
        //   scope.openModal('', 'update-activity.client.view.html', 'UpdateActivityController');
        // };
        
        scope.triggerFollowUp = function() {
          scope.action.$followUp({ type: 'add' });
        };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });         
        };

        scope.createActivity = function() {
          var activity = new Activity(scope.newActivity);
          activity.$save(function(response) {
            scope.completed = true;
            scope.closeAlert = false;
          }, function(errorResponse) {
            scope.error = errorResponse.data.message;
            scope.closeErrorAlert = false;
          });
        };

      }
    };
  }]);