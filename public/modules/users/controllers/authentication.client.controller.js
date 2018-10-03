'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$state', '$location', '$timeout', 'Authentication',
  function($rootScope, $scope, $http, $state, $location, $timeout, Authentication) {
    $scope.authentication = Authentication;

    function onSuccessfulSignin(response) {
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
    }

    $scope.autoSignin = function() {

      // this is just to look nice beneath the loading overlay
      $scope.credentials = {
        phone: 'XXXXXXXXXX',
        password: 'fakepassword'
      };
      $scope.error = undefined;
      $rootScope.loading = true;

      // grab a copy of the key
      var key = $location.search().key;

      // then remove it from the url
      $rootScope.clearQueryString = true;
      $location.search('key', undefined);

      // if there's no key...
      if(!key) {
        $rootScope.loading = false;
        $state.go('signin');

      } else {

        $http.post('/api/auth/auto-signin', { key: key }).success(function(response) {

          onSuccessfulSignin(response);

        }).error(function(response) {

          // in case of error, just make them log in again on the old app
          // suppose we don't even care what the response message is
          $timeout(function () {
            $rootScope.loading = false;
            $state.go('signin');
            $scope.error = response.message;
          }, 1000);
        });
      }

    };


    $scope.signin = function() {
      $scope.error = undefined;
      $rootScope.loading = true;

      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

        onSuccessfulSignin(response);

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
