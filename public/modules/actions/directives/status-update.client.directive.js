'use strict';

angular.module('actions')
  .directive('statusUpdate', ['$rootScope', '$modal', '$sce', '$timeout', 'Activity', 'Actions', 'Issues',
    function ($rootScope, $modal, $sce, $timeout, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/status-update.client.view.html',
      controller: function($scope, $element, $attrs) {
        //$scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.status = {
          closeAlert: false,
          closeErrorAlert: true,
          completed: false
        };
        //if(!scope.completed) scope.completed = false;

        scope.newActivity = {
          date: '',
          title: 'Status Update',
          key: 'statusUpdate'
        };

        var openModal = function(templateUrl, controller) {

          var modalInstance = $modal.open({
            //animation: false,
            templateUrl: templateUrl,
            controller: controller,
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          modalInstance.result.then(function (newActivity) {
            scope.newActivity = newActivity;
            scope.createActivity();
          }, function () {
            // modal cancelled
          });
        };


        scope.openCheckIn = function() {
          openModal('modules/actions/partials/modals/check-in.client.view.html', 'UpdateActivityController');
        };
        scope.openPhotoPreview = function(file) {
          if(file.lastModifiedDate) scope.newActivity.date = file.lastModifiedDate;
          openModal('modules/actions/partials/modals/photo-preview.client.view.html', 'UpdateActivityController');
        };

        scope.closeAlert = function() {
          scope.status.closeAlert = true;
        };

        scope.createActivity = function() {

          $rootScope.loading = true;

          console.log('create activity pre creation', scope.newActivity);

          // [TODO] have an actual section for the 'area' field in the activity log
          if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
          else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

          var activity = new Activity(scope.newActivity);

          console.log('create activity post creation', scope.newActivity);

          activity.$save(function(response) {

            console.log('create activity post save', response);

            $rootScope.loading = false;
            scope.status.completed = true;

            // load new actions
            // var idx = scope.$index;
            // var newActions = Actions.query(
            //   {key: scope.newActivity.key},
            //   function() {
            //     newActions.forEach(function (action) {
            //       scope.actions.splice(++idx, 0, action);
            //     });
            //   });

          }, function(errorResponse) {
            $rootScope.loading = false;
            scope.error = errorResponse.data.message;
            scope.status.closeErrorAlert = false;
          });

        }; // end of create activity


      }
    };
  }]);
