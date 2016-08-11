'use strict';

angular.module('actions')
  .directive('toDoItem', ['$rootScope', '$modal', '$sce', '$compile', '$filter', '$timeout', 'Authentication', 'Activity', 'Actions',
    function ($rootScope, $modal, $sce, $compile, $filter, $timeout, Authentication, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {
        $scope.filterTitleHTML = function() { return $sce.trustAsHtml($scope.action.title); };
        $scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
        $scope.filterButtonTitleHTML = function() { return $sce.trustAsHtml($scope.action.cta.buttonTitle); };
        $scope.closeErrorAlert = true;
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.followUpSubmitted = false;

        //scope.completed = false;
        if(!scope.action.completed) scope.action.completed = false;

        scope.newActivity = {
          title: scope.action.activityTitle,
          key: scope.action.key
        };

        if(scope.action.isFollowUp) {
          // get potential follow up startDate
          if(scope.action.startDate) {
            scope.newActivity.startDate = new Date(scope.action.startDate);
          }
        }

        scope.newActivity.fields = [];
        // if action has custom fields, initialize those in the newActivity object
        if(scope.action.followUp && scope.action.followUp.fields) {
          angular.forEach(scope.action.followUp.fields, function(field, idx) {
            scope.newActivity.fields.push({ title: field.title });
          });
        }


        var getSection = function(type) {
          switch(type) {
            case 'once':
              return scope.onceActions;
              break;
            case 'recurring':
              return scope.recurringActions;
              break;
            case 'legal':
              return scope.legalActions;
              break;
            default:
              console.error('this shouldn\'t happen!');
              return;
              break;
          }
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
            //animation: false,
            templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
            controller: scope.action.cta.controller,
            backdrop: 'static',
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          modalInstance.result.then(function (result) {
            scope.newActivity = result.newActivity;

            // this should check for isFollowUp (or should is be hasFollowUp)
            if(scope.action.hasFollowUp) {
              scope.triggerFollowUp(true);
            }
            // if(scope.action.isFollowUp && scope.action.isFollowUp) scope.triggerFollowUp();
            else if(!result.modalError) scope.createActivity(true, false);

          }, function () {
            // modal cancelled
          });
        };

        scope.triggerFollowUp = function(hasDoneAction, url, type) {

          if(hasDoneAction) {
            scope.newActivity.startDate = scope.action.startDate = new Date();
          }

          scope.action.$followUp({ type: 'add' });

          if(url && type === 'tel') window.location.href = url;
          else if(url && type === 'link') window.open(url, '_blank');
         };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });
        };

        scope.closeAlert = function() {
          scope.action.closeAlert = true;
          var section = getSection(scope.action.type);
          section.splice(scope.$index,1);
        };

        var compareDates = function(start, created) {
          var startDate = new Date(start).setHours(0,0,0,0);
          var createdDate = new Date(created).setHours(0,0,0,0);
          return startDate !== createdDate;
        }

        scope.createActivity = function(isValid, addDOA) {

          if(scope.action.hasFollowUp) {
            scope.followUpSubmitted = true;
          }

          if(isValid) {

            // if(addDOA && compareDates(scope.newActivity.startDate, new Date())) {
            if(addDOA) {
              scope.newActivity.fields.unshift({ title: 'This occurred on:', value: $filter('date')(scope.newActivity.startDate, 'longDate') });
            }

            $rootScope.loading = true;

            console.log('create activity pre creation', scope.newActivity);

            var activity = new Activity(scope.newActivity);

            console.log('create activity post creation', activity);

            activity.$save(function(response) {

              console.log('create activity post save', response);

              Authentication.user = response;
              $rootScope.loading = false;
              scope.action.completed = true;
              scope.action.closeAlert = false;

              // load new actions
              // var idx = scope.$index;
              console.log('key', scope.newActivity.key);
              var newActions = Actions.query(
                {key: scope.newActivity.key},
                function() {
                  console.log('new actions', newActions);
                  newActions.forEach(function (action) {
                    var section = getSection(action.type);
                    section.push(action);
                    // scope.actions.splice(++idx, 0, action);
                  });
                });

            }, function(errorResponse) {
              $rootScope.loading = false;
              scope.error = errorResponse.data.message;
              scope.closeErrorAlert = false;
            });

          }

        }; // end of create activity


      }
    };
  }]);
