'use strict';

angular.module('advocates').directive('sethLowSurvey', ['$timeout', '$state', '$window', 'Authentication', 'Users', function scheduler($timeout, $state, $window, Authentication, Users) {
  return {
    templateUrl: 'modules/advocates/partials/seth-low-survey.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.user = Authentication.user;

      scope.hasSubmittedForm = false;

      scope.refresh = function() {
        $state.reload();
      };

      window.addEventListener("message", function(e) {
        if(e.data && typeof e.data === 'string') {
          if(e.origin === 'https://justfix.typeform.com' && e.data === 'form-submit') {
            $timeout(function () {
              scope.hasSubmittedForm = true;
            });
          }
        }
      }, false);
    }
  };
}]);
