'use strict';

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems',
  function(Authentication, Problems) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {


          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;
          });


          // inherit newUser.problems or user.problems

          // modal opening/closing
          // passing scopes




      }
    };
}]);
