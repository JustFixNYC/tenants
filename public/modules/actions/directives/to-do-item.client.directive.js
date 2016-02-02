'use strict';

angular.module('actions')
  .directive('toDoItem', ['$rootScope', '$modal', '$sce', '$timeout', 'Activity', 'Actions',
    function ($rootScope, $modal, $sce, $timeout, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {
        $scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
        $scope.filterButtonTitleHTML = function() { return $sce.trustAsHtml($scope.action.cta.buttonTitle); };
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        //console.log(scope.action);

        // used to hide the completed alert
        scope.status = {
          closeAlert: false,
          closeErrorAlert: true,
          completed: false
        };
        //if(!scope.action.completed) scope.action.completed = false;

        scope.newActivity = {
          date: '',
          title: scope.action.title,
          key: scope.action.key
        };

        // if action has custom fields, initialize those in the newActivity object
        if(scope.action.followUp && scope.action.followUp.fields) {
          scope.newActivity.fields = [];
          angular.forEach(scope.action.followUp.fields, function(field, idx) {
            scope.newActivity.fields.push({ title: field.title });
          });
        }

        scope.isModal = function() {
          switch(scope.action.cta.type) {
            case 'initialContent': return true;
            case 'modal': return true;
            default: return false;
          }
        };

        scope.openModal = function() {

          // ModalService.showModal({
          //   templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
          //   controller: scope.action.cta.controller,
          //   inputs: {
          //     newActivity: scope.newActivity
          //   }
          // }).then(function(modal) {

          //   console.log(modal);

          //   modal.element.modal();
          //   // modal.close.then(function(result) {
          //   //   $scope.yesNoResult = result ? "You said Yes" : "You said No";
          //   // });
          // });

          var modalInstance = $modal.open({
            //animation: false,
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
            // modal cancelled
          });
        };

        scope.triggerFollowUp = function(url, type) {

          scope.action.$followUp({ type: 'add' });

          if(url && type === 'tel') window.location.href = url;
          else if(url && type === 'link') window.open(url, '_blank');
         };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });
        };

        scope.closeAlert = function() {
          scope.status.closeAlert = true;
          scope.actions.splice(scope.$index,1);
        };

        scope.createActivity = function() {

          $rootScope.loading = true;

          console.log('create activity pre creation', scope.newActivity);

          var activity = new Activity(scope.newActivity);

          console.log('create activity post creation', scope.newActivity);

          activity.$save(function(response) {

            console.log('create activity post save', response);

            $rootScope.loading = false;

            // show the completed alert
            scope.status.completed = true;

            // load new actions
            var idx = scope.$index;
            var newActions = Actions.query(
              {key: scope.newActivity.key},
              function() {
                newActions.forEach(function (action) {
                  scope.actions.splice(++idx, 0, action);
                });
              });

          }, function(errorResponse) {
            $rootScope.loading = false;
            scope.error = errorResponse.data.message;
            scope.status.closeErrorAlert = false;
          });

        }; // end of create activity


      }
    };
  }]);
