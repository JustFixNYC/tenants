'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$state', '$location', '$timeout', 'Authentication',
  function($rootScope, $scope, $http, $state, $location, $timeout, Authentication) {
    $scope.authentication = Authentication;

    $scope.signin = function() {
      $scope.error = undefined;
      $rootScope.loading = true;
      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

        $rootScope.loading = false;

        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        switch(response.roles[0]) {
          case "admin":
            $state.go('admin');
            break;
          case "advocate":
            $state.go('advocateHome');
            break;
          case "tenant":
            $state.go('home');
            break;
          default:
            $state.go('home');
            break;
        }


      }).error(function(response) {

        $timeout(function () {
          $rootScope.loading = false;
          $scope.error = response.message;
        }, 1000);
      });
    };

    $scope.forgotPassword = {};
    $scope.pwError = false;
    $scope.pwSuccess = false;
    $scope.requestPassword = function() {
      if(!$scope.forgotPassword.phone) {
        $scope.pwError = true;
        $scope.pwSuccess = false;
      } else {
        $scope.pwError = false;
        $scope.pwSuccess = true;

        Rollbar.info("Forgot Password", { phone: $scope.forgotPassword.phone });
      }

    };

  }
]);
