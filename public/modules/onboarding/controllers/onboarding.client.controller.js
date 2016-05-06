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
			if(!$scope.accessCode.valueEntered || $scope.accessCode.valueEntered !== $scope.accessCode.value) {
				var referral = new Referrals();
		    referral.$validate({ code: $scope.accessCode.value },
		      function(success) {
		        if(success.referral) {
		          $scope.accessCode.valid = true;
		          $scope.accessCode.valueEntered = $scope.accessCode.value;
		          $scope.newUser.referral = success.referral;
							$scope.newUser.referral.code = $scope.accessCode.value;
							$scope.codeError = false;
							$scope.codeWrong = false;
		        } else {
		         	$scope.codeError = false;
		         	$scope.codeWrong = true;
		        }
		      }, function(error) {
						$scope.codeErrorMessage = error.data.message;
		        $scope.codeError = true;
		        $scope.codeWrong = false;
		      });

			// account for canceled entry
			// could probably just use 'else' here but why take chances?
			} else if ($scope.accessCode.valueEntered == $scope.accessCode.value) {
				$scope.accessCode.valid = true;
				$scope.codeError = false;
				$scope.codeWrong = false;
			}
	  };

		$scope.cancelAccessCode = function() {
			// $scope.accessCode.value = '';
			$scope.accessCode.valid = false;
		};

	  // SIGNUP
		// if(user.fullName) {
		// 	$scope.newUser.firstName = user['fullName'].split(' ')[0];
		// 	$scope.newUser.lastName = user['fullName'].split(' ')[1];
		// }

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
