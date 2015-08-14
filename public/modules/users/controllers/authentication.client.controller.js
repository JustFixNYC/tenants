'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$location', 'Authentication',
  function($rootScope, $scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/ssues');

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
      $http.post('/auth/signin', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the issues page

        console.log($scope.authentication.user);
        $location.path('/home');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);