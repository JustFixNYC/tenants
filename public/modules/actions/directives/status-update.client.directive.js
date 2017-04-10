'use strict';

angular.module('actions')
  .directive('statusUpdate', ['$rootScope', '$filter', '$sce', '$timeout', 'Activity', 'Actions', 'Problems', 'Upload', 'cloudinary',
    function ($rootScope, $filter, $sce, $timeout, Activity, Actions, Problems, $upload, cloudinary) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/status-update.client.view.html',
      controller: function($scope, $element, $attrs) {
        //$scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.problems = Problems.getUserProblems();

        scope.newActivity = {
          date: '',
          title: 'modules.activity.other.statusUpdate',
          key: 'statusUpdate',
          relatedProblems: [],
          photos: []
        };

        scope.status = {
          expanded: false,
          extraExpanded: false,
          tagging: false,
          closeAlert: false,
          closeErrorAlert: true,
          formSubmitted: false,
          completed: false
        };
        //if(!scope.completed) scope.completed = false;

        if($rootScope.expandStatus) {
          scope.status.expanded = true;
          scope.status.extraExpanded = true;
          $timeout(function() { element[0].querySelector('textarea').focus(); }, 0);
        }

        if(!$rootScope.takeActionAlert) {
          scope.status.expanded = true;
          $timeout(function() { element[0].querySelector('textarea').focus(); }, 0);
        }

        scope.expand = function(event) {
          event.preventDefault();
          scope.status.expanded = true;
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);
        };

        scope.closeAlert = function() {
          scope.status.closeAlert = true;
        };


        /*
         *
         *    TAGGING PROBLEM AREAS
         *
         */

        scope.toggleTagging = function() {
          scope.status.tagging = !scope.status.tagging;
        };

        scope.selectProblem = function(problem) {

          if(!this.isSelectedProblem(problem)) {
            scope.newActivity.relatedProblems.push(problem);
          } else {
            var i = scope.newActivity.relatedProblems.indexOf(problem);
            scope.newActivity.relatedProblems.splice(i, 1);
            // $scope.checklist[area].numChecked--;
          }
        };

        scope.isSelectedProblem = function(problem) {
          // if(!$scope.newIssue.issues[area]) return false;
          return scope.newActivity.relatedProblems.indexOf(problem) !== -1;
        };


        /*
         *
         *    PHOTO UPLOADING
         *
         */


        scope.addPhoto = function(file) {

          if(file) {
            scope.newActivity.photos.push(file);
            // console.log(file);
            // console.log(file.lastModifiedDate);
            if(file.lastModifiedDate) scope.newActivity.date = file.lastModifiedDate;
          }

        };

        scope.files = [];
        scope.ustatus = {};
        scope.ustatus.isUploadingFiles = false;

        scope.getTotalProgress = function() {
          var total = 0;
          angular.forEach(scope.files, function (f) {
            if(f.progress) total += f.progress;
          });
          return Math.round(total / scope.files.length);
        };

        scope.uploadFiles = function(files) {

          // assign files to scope for previews?
          if (!files) return;

          scope.files = scope.files.length ? scope.files.concat(files) : files;

          var d = new Date();
          scope.title = "img_" + d.getDate() + "_" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

          var uploadTimer;
          var uploadTimerThreshold = 1;         // in seconds

          // var handleError = function(res) {
          //   console.log('abort! abort!');
          //
          //   console.log(scope);
          //   scope.isUploadingFiles = false;
          //   scope.uploadingFilesError = res;
          //
          // };

          // for each file...
          angular.forEach(files, function(file) {
            if (file && !file.$error) {
              file.upload = $upload.upload({
                url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
                data: {
                  upload_preset: cloudinary.config().upload_preset,
                  tags: cloudinary.config().album_name,
                  context: 'photo=' + scope.title,
                  file: file
                }
              }).progress(function (e) {

                file.progress = Math.round((e.loaded * 100.0) / e.total);
                scope.isUploadingFiles = true;

                console.log('progress');

                if(!uploadTimer) {
                  uploadTimer = $timeout(function () {
                    Rollbar.warning("Request for the letter took too long to respond");
                    // handleError('Request took too long.');
                    // console.log('abort! abort!');

                    // console.log(scope);
                    // scope.isUploadingFiles = false;
                    // scope.uploadingFilesError = 'Request took too long.';
                    file.upload.abort();

                  }, uploadTimerThreshold * 1000);
                }


              }).success(function (data, status, headers, config) {

                scope.isUploadingFiles = false;
                scope.newActivity.photos.push({
                  url: data.url,
                  secure_url: data.secure_url,
                  cloudinary_public_id: data.public_id
                });
              }).error(function (data, status, headers, config) {

                console.log('data', data);
                console.log('status', status);
                // console.log('headers', headers);
                console.log('config', config);

                // file.upload.abort();
                scope.isUploadingFiles = false;
                scope.uploadingFilesError = 'hi dan';
                file.result = data;
                // handleError(data);
              });
            }
          });
        };













        scope.createActivity = function(isValid) {

          scope.status.formSubmitted = true;

          if(isValid) {
            $rootScope.loading = true;

            console.time("statusUpdate");

            console.log('create activity pre creation', scope.newActivity);

            // [TODO] have an actual section for the 'area' field in the activity log
            // if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
            // else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

            var activity = new Activity(scope.newActivity);

            console.log('create activity post creation', scope.newActivity);

            activity.$save(function(response) {

              // console.log('create activity post save', response);
              console.timeEnd("statusUpdate");

              $rootScope.loading = false;
              scope.status.completed = true;
              scope.status.formSubmitted = false;
              scope.status.expanded = false;
              scope.newActivity = {
                date: '',
                title: 'modules.activity.other.statusUpdate',
                key: 'statusUpdate',
                relatedProblems: [],
                photos: []
              };

            }, function(errorResponse) {
              $rootScope.loading = false;
              scope.error = errorResponse.data.message;
              scope.status.closeErrorAlert = false;
            });
          }

        }; // end of create activity


      }
    };
  }]);
