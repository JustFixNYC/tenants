'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$state', '$timeout', 'Authentication',
  function($rootScope, $scope, $http, $state, $timeout, Authentication) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $state.go('home');

    // signup moved to issues module...
    // $scope.signup = function() {
    //   $http.post('/auth/signup', $scope.credentials).success(function(response) {
    //     // If successful we assign the response to the global user model
    //     $scope.authentication.user = response;
    //     // And redirect to the index page
    //     $location.path('/');
    //   }).error(function(response) {
    //     $scope.error = response.message;
    //   });
    // };

    $scope.signin = function() {
      $scope.error = undefined;
      $rootScope.loading = true;
      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

        $rootScope.loading = false;

        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // console.log($scope.authentication.user);
        $state.go('home');
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
