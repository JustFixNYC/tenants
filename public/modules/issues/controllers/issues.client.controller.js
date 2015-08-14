'use strict';

// Issues controller
angular.module('issues').controller('IssuesController', ['$scope', '$location', '$http', 'Authentication', 'Users',
  function($scope, $location, $http, Authentication, Users) {
    $scope.authentication = Authentication;

    if($scope.authentication.user) {
      $scope.issues = $scope.authentication.user.issues;
    } else {
      $scope.issues = {};
    }

    $scope.newIssue = {};
    $scope.newIssue.issues = {};          

    // $scope.newIssue.name = 'Maris Hernandez';
    // $scope.newIssue.phone = (Math.floor(Math.random() * 9999999999) + 1111111111).toString();
    // $scope.newIssue.password = 'testtest';
    // $scope.newIssue.borough = 'Brooklyn';
    // $scope.newIssue.address = '846 Prospect Pl';
    // $scope.newIssue.unit = '10F';

      // $scope.currentStep = 60;
      // console.log($scope.currentStep);

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.currentStateTitle = toState.title;
      // console.log(toState.name);
      // $scope.currentStep = 50;
      // console.log($scope.currentStep);
    });

    // Create new Issue
    $scope.create = function() {

      //console.log($scope.issues);

      var newUser = {
        fullName:     $scope.newIssue.name,
        phone:        $scope.newIssue.phone,
        borough:      $scope.newIssue.borough,
        address:      $scope.newIssue.address,
        unit:         $scope.newIssue.unit,
        nycha:        $scope.newIssue.nycha, 
        issues:       $scope.newIssue.issues,
        password:     $scope.newIssue.password        
      };
      
      $http.post('/auth/signup', newUser).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $location.path('/');
      }).error(function(response) {
        $scope.error = response;
      });
    };

    $scope.update = function() {

      $scope.authentication.user.issues = $scope.newIssue.issues;
      var user = new Users($scope.authentication.user);

      user.$update(function(response) {
        Authentication.user = response;
        $scope.authentication.user = response;
        $location.path('/issues');        
      }, function(response) {
        $scope.error = response.data.message;
      });

    };

    // detirmines if the user hasn't selected any issues
    $scope.hasIssues = function() {
      for(var area in $scope.issues) {
        if($scope.issues[area].length) return true;
      }
      return false;
    };

  }
]);