'use strict';

angular.module('problems').controller('ProblemsController', ['$scope', '$state', 'Authentication', 'Users', 'Problems',
	function($scope, $state, Authentication, Users, Problems) {

		// should probably check for unsaved changes...

		$scope.updateSuccess = false;
		$scope.updateFail = false;

		$scope.updateProblems = function() {
			var user = new Users(Authentication.user);

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
