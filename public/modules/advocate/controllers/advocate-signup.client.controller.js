'use strict';

angular.module('advocate').controller('AdvocateSignupController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Referrals', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Referrals, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newAdvocateUser = {};

		/**
			*
			*   DEBUG STUFF
			*
			*/

		if(typeof DEBUG !== 'undefined' && DEBUG == true) {

			$scope.newAdvocateUser = {
				firstName: "Jane",
				lastName: "Doe",
				password: "password",
				phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
				code: "janedoe",
				email: "jane@westsidetenants.org",
				contactPhone: "8459781262",
				ext: "12",
				organization: "Westside Tenants"
			};

			$scope.pw2 = "password";
		}


		$scope.userError = false;

		$scope.toReferralStep = function (isValid) {
			if(isValid) {
				$state.go('advocateSignup.referral');
			} else {
				$scope.userError = true;
			}
		};

		$scope.createAdvocate = function (isValid) {

			if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account pre save', $scope.newAdvocateUser);

			if(isValid) {

				if($scope.newAdvocateUser.ext) {
					$scope.newAdvocateUser.contactPhone += ',' + $scope.newAdvocateUser.ext;
				}

				$scope.newAdvocateUser.firstName = $filter('titlecase')($scope.newAdvocateUser.firstName);
				$scope.newAdvocateUser.lastName = $filter('titlecase')($scope.newAdvocateUser.lastName);

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/api/advocates/signup', $scope.newAdvocateUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					$scope.authentication.user = response;
					if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account post save', response);

					$state.go('advocateHome');


				}).error(function(err) {
					$rootScope.loading = false;
					// console.log(err);
        	$scope.error = err;
				});

			} else {
				$scope.userError = true;
			}


		};


	}]);
