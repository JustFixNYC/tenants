'use strict';

angular.module('actions')
  .directive('toDoItem', ['$modal', '$sce', '$timeout', 'Activity', 'Actions', function ($modal, $sce, $timeout, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {
        $scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      },
      link: function (scope, element, attrs) {
        
        //scope.action is a $resource!
        scope.completed = false;
        scope.newActivity = {
          date: '',
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
            console.log('newActivity', newActivity);
            scope.newActivity = newActivity;
            if(scope.action.cta.type !== 'initialContent') scope.triggerFollowUp();
            else scope.createActivity();
          }, function () {
            // modal cancelled
          });
        };

        scope.triggerFollowUp = function() {
          scope.action.$followUp({ type: 'add' });
        };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });         
        };

        scope.createActivity = function() {

          var key = scope.newActivity.key;
          // var key = scope.newActivity.key,
          //     idx = scope.actions.map(function(a) { return a.key; }).indexOf(key);

          console.log('create activity pre creation', scope.newActivity);

          var activity = new Activity(scope.newActivity);

          console.log('create activity post creation', scope.newActivity);

          activity.$save(function(response) {

            console.log('create activity post save', response);

            // var newActions = Actions.query(
            //   {key: scope.newActivity.key}, 
            //   function() {
            //     newActions.forEach(function (action) {
            //       scope.actions.splice(++idx, 0, action);
            //     }); 
            //   });


            
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