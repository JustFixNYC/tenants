'use strict';

angular.module('onboarding').controller('OnboardingController', ['$scope', '$location', 'Referrals', '$http',
	function($scope, $location, Referrals, $http) {

		$scope.referralSuccess = false;
		$scope.codeError = false;
		$scope.codeWrong = false;

		$scope.newUser = {};
		// create newUser.problems only once (handles next/prev)
		$scope.newUser.problems = [];

	  $scope.accessCode = {
			value: '',
			valid: false
		};

	  $scope.validateCode = function() {
			// handles back button
			if(!$scope.newUser.referral) {
				var referral = new Referrals();
		    referral.$validate({ code: $scope.accessCode.value },
		      function(success) {
		        if(success.referral) {
		          $scope.accessCode.valid = true;
		          $scope.newUser.referral = success.referral;
							$scope.newUser.referral.code = $scope.accessCode.value;
		        } else {
		         	$scope.codeWrong = true;
		        }
		      }, function(error) {
		        $scope.codeError = true;
		      });
			} else {
				$scope.accessCode.valid = true;
			}
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
