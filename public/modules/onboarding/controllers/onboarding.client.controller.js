'use strict';

angular.module('onboarding').controller('OnboardingController', ['$rootScope', '$scope', '$location', '$filter', 'Authentication', 'Referrals', '$http', '$modal',
	function($rootScope, $scope, $location, $filter, Authentication, Referrals, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newUser = {};
		// create newUser.problems only once (handles next/prev)
		$scope.newUser.problems = [];
		$scope.newUser.sharing = {
			enabled: false
		};

		$scope.accessCode = {
			valid: false
		};


		/**
			*
			*   DEBUG STUFF
			*
			*/
		$scope.newUser = {
			firstName: 'Dan',
			lastName: "Stevenson",
			password: "password",
			borough: 'Brooklyn',
			address: '654 Park Place',
			unit: '1RF',
			phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
			problems: [],
			sharing: {
				enabled: false
			}
		};

		$scope.accessCode = {
			value: 'test5',
			valid: false
		};

	  $scope.validateCode = function() {
			// handles back button
			if(!$scope.accessCode.valueEntered || $scope.accessCode.valueEntered !== $scope.accessCode.value) {

				var referral = new Referrals();
		    referral.$validate({ code: $scope.accessCode.value },
		      function(success) {
		        if(success.referral) {
		          $scope.accessCode.valid = $rootScope.validated = true;
		          $scope.accessCode.valueEntered = $scope.accessCode.value;
		          $scope.newUser.referral = success.referral;
							$scope.newUser.referral.code = $scope.accessCode.value;
							$location.path('/onboarding/success');
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
				$location.path('/onboarding/success');
				$scope.codeError = false;
				$scope.codeWrong = false;
			}
	  };

		$scope.cancelAccessCode = function() {
			// $scope.accessCode.value = '';
			$scope.accessCode.valid = false;
			$location.path('/onboarding/referral');
		};

	  // SIGNUP
		$scope.additionalInfo = function() {
			// Open modal
			var modalInstance = $modal.open({
				animation: 'true',
				templateUrl: 'modules/onboarding/partials/additional-info.client.view.html'
			});
		};

		$scope.userError = false;

		$scope.createAndNext = function (isValid) {

			console.log('create account pre save', $scope.newUser);

			if(isValid) {

				$scope.newUser.firstName = $filter('titlecase')($scope.newUser.firstName);
				$scope.newUser.lastName = $filter('titlecase')($scope.newUser.lastName);
				$scope.newUser.address = $filter('titlecase')($scope.newUser.address);

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/api/auth/signup', $scope.newUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					$scope.authentication.user = response;
					console.log('create account post save', response);
					$location.path('/tutorial');

				}).error(function(err) {
					$rootScope.loading = false;
					console.log(err);
        	$scope.error = err;
				});

			} else {
				$scope.userError = true;
			}

		};


	}]);
