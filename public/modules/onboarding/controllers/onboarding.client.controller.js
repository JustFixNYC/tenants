'use strict';

angular.module('onboarding').controller('OnboardingController', ['$scope', '$location', 'Referrals', '$http',
	function($scope, $location, Referrals, $http) {

		$scope.referralSuccess = false;
		$scope.codeError = false;
		$scope.codeWrong = false;

		$scope.newUser = {};
		// create newUser.problems only once (handles next/prev)
		$scope.newUser.problems = [];

	  $scope.newUser.accessCode = $scope.newUser.accessCode || '';

	  if($scope.newUser.accessCode !== '') {
	  	$scope.referralSuccess = true;
	  }

	  $scope.validateCode = function() {

	    var referral = new Referrals();
	    referral.$validate({ code: $scope.newUser.accessCode },
	      function(success) {

	        if(success.referral) {
	          $scope.referralSuccess = true;
	          $scope.referral = success.referral;
	          $scope.newUser.referral = success.referral;
	        } else {
	         	$scope.codeWrong = true;
						$scope.referralSuccess = true;
	        }
	      }, function(error) {
	      	console.log(error);
	        $scope.codeError = true;
	      });

	  };

	  // SIGNUP
		if(user.fullName) {
			$scope.newUser.firstName = user['fullName'].split(' ')[0];
			$scope.newUser.lastName = user['fullName'].split(' ')[1];
		}

		if(!user.borough) {
			$scope.newUser.borough = 'Bronx';
		}

		if(!user.nycha) {
			$scope.newUser.nycha = 'yes';
		}

		$scope.createAndNext = function () {

			$scope.newUser.fullName = $scope.newUser.firstName + ' ' + $scope.newUser.lastName;

			$http({
				method: 'POST',
				url: '/auth/signup',
				data: $scope.newUser
			}).then(function(success){
				console.log(success);
				$location.path('/onboarding/tutorial');

			}, function(err) {
				console.log(err);
				if(err.data.errors) {
					$scope.errorInRequest = true;
					$scope.pwError = true;
				} else {
					$scope.pwError = false;
					$scope.errorInRequest = true;
					$scope.error = err.data;
				}
			})

			/*var savingUser = new Authentication.prepUser(Authentication.user);
			savingUser.$signUp*/
		}


	}]);
