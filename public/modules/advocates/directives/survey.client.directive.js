'use strict';

angular.module('advocates').directive('sethLowSurvey', ['$rootScope', '$stateParams', '$httpParamSerializer', '$timeout', '$state', '$window', 'Authentication', 'Users', 'Activity',
  function scheduler($rootScope, $stateParams, $httpParamSerializer, $timeout, $state, $window, Authentication, Users, Activity) {
    return {
      templateUrl: 'modules/advocates/partials/seth-low-survey.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.tfHiddenFields = $httpParamSerializer($stateParams);

        scope.user = Authentication.user;

        scope.hasSubmittedForm = false;

        scope.refresh = function() {
          $state.reload();
        };

        window.addEventListener("message", function(e) {
          if(e.data && typeof e.data === 'string') {
            if(e.origin === 'https://justfix.typeform.com' && e.data === 'form-submit') {

              var newActivity = {
                date: '',
                title: 'Completed Survey',
                key: 'surveyCompleted',
                relatedProblems: [],
                photos: []
              };

              $rootScope.loading = true;

              var activity = new Activity(newActivity);

              activity.$saveManagedByID({ id: $stateParams.id }, function(response) {
                $rootScope.loading = false;
                $rootScope.newSurvey = true;
                $state.go('advocateHome');
                // $state.go('manageTenant.home', { id: $stateParams.id });
              });
            }
          }
        }, false);
      }
    };
}]);
