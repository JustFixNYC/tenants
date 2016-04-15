'use strict';

angular.module('actions')
  .directive('statusUpdate', ['$rootScope', '$filter', '$sce', '$timeout', 'Activity', 'Actions', 'Issues',
    function ($rootScope, $filter, $sce, $timeout, Activity, Actions, Issues) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/status-update.client.view.html',
      controller: function($scope, $element, $attrs) {
        //$scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!
        
        scope.problems = Issues.getUserAreas().map(function (a) { return $filter('areaTitle')(a) });

        scope.status = {
          expanded: false,
          tagging: false,
          closeAlert: false,
          closeErrorAlert: true,
          completed: false
        };
        //if(!scope.completed) scope.completed = false;

        scope.newActivity = {
          date: '',
          title: 'Status Update',
          key: 'statusUpdate',
          problems: [],
          photos: []
        };

        scope.expand = function(event) {
          event.preventDefault();
          scope.status.expanded = true;
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);

        }

        scope.toggleTagging = function() {
          scope.status.tagging = !scope.status.tagging;
        }

        scope.selectProblem = function(problem) {

          if(!this.isSelectedProblem(problem)) {
            scope.newActivity.problems.push(problem);
          } else {
            var i = scope.newActivity.problems.indexOf(problem);
            scope.newActivity.problems.splice(i, 1);
            // $scope.checklist[area].numChecked--;
          }
        };
        scope.isSelectedProblem = function(problem) {
          // if(!$scope.newIssue.issues[area]) return false;
          return scope.newActivity.problems.indexOf(problem) !== -1;
        };

        scope.addPhoto = function(file) {

          if(file) {
            scope.newActivity.photos.push(file);
            console.log(file);
            console.log(file.lastModifiedDate);
            if(file.lastModifiedDate) scope.newActivity.date = file.lastModifiedDate;
          }

        };

        scope.closeAlert = function() {
          scope.status.closeAlert = true;
        };

        scope.createActivity = function() {

          $rootScope.loading = true;

          console.log('create activity pre creation', scope.newActivity);

          // [TODO] have an actual section for the 'area' field in the activity log
          // if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
          // else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

          var activity = new Activity(scope.newActivity);

          console.log('create activity post creation', scope.newActivity);

          activity.$save(function(response) {

            console.log('create activity post save', response);

            $rootScope.loading = false;
            scope.status.completed = true;

          }, function(errorResponse) {
            $rootScope.loading = false;
            scope.error = errorResponse.data.message;
            scope.status.closeErrorAlert = false;
          });

        }; // end of create activity


      }
    };
  }]);
