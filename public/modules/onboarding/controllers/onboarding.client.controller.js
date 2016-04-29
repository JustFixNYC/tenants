'use strict';

angular.module('onboarding').controller('OnboardingController', ['$scope', 'Authentication', 'Users', '$location', 'Referrals',
	function($scope, Authentication, User, $location, Referrals) {

		$scope.codeError = false;
		$scope.referralSuccess = false;
		$scope.codeError = false;
		$scope.codeWrong = false;

		$scope.newUser = {};


	  $scope.newUser.accessCode = '';

	  $scope.validateCode = function() {

	    var referral = new Referrals();
	    referral.$validate({ code: $scope.newUser.accessCode },
	      function(success) {

	        if(success.referral) {
	          $scope.referralSuccess = true;
	          $scope.referral = success.referral;
	        } else {
	         	$scope.codeWrong = true;
	         	$scope.referralSuccess = true;
	        }
	      }, function(error) {
	      	console.log(error);
	        $scope.codeError = true;
	      });

	  };

	  $scope.goNext = function() {
	  	$location.path('/onboarding-problems');
	  }


	}]);
