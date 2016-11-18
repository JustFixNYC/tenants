'use strict';

angular.module('advocates').controller('NewTenantSignupController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newTenantUser = {};
		// create newTenantUser.problems only once (handles next/prev)
		$scope.newTenantUser.problems = [];
		$scope.newTenantUser.sharing = {
			enabled: true
		};

		/**
			*
			*   DEBUG STUFF
			*
			*/

		if(typeof DEBUG !== 'undefined' && DEBUG == true) {

			$scope.newTenantUser = {
				firstName: 'Dan',
				lastName: "Stevenson",
				borough: 'Brooklyn',
				address: '654 Park Place',
				unit: '1RF',
				phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
				problems: [],
				sharing: {
					enabled: true
				}
			};
		}


		$scope.userError = false;

		$scope.createNewTenant = function (isValid) {

			if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account pre save', $scope.newTenantUser);

			if(isValid) {

				$scope.newTenantUser.firstName = $filter('titlecase')($scope.newTenantUser.firstName);
				$scope.newTenantUser.lastName = $filter('titlecase')($scope.newTenantUser.lastName);

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/api/advocates/tenants/create', $scope.newTenantUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					// $scope.authentication.user = response;
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
