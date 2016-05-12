'use strict';

angular.module('problems').controller('ProblemsController', ['$scope', '$state', 'Authentication', 'Users', 'Problems',
	function($scope, $state, Authentication, Users, Problems) {

		// should probably check for unsaved changes...

		$scope.updateSuccess = false;
		$scope.updateFail = false;

		$scope.updateProblems = function() {
			var user = new Users(Authentication.user);

			// Meegan -- WHAT HAVE I TOLD YOU ABOUT COPY PASTING. Repeating block, bring this into onboarding
			user.firstName = user.fullName.split(' ')[0];
			user.lastName = user.fullName.split(' ')[1];

			user.$update(function(response) {
				Authentication.user = response;
				$scope.updateSuccess = true;
				$scope.updateFail = false;
			}, function(response) {
				$scope.updateSuccess = false;
				$scope.updateFail = true;
				$scope.error = response.data.message;
			});
		};

	}])
