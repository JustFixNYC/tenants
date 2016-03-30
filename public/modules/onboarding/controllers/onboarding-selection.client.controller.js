
'use strict';

angular.module('onboarding').controller('OnboardingSelectionController', ['$scope', 'Authentication', 'Users', '$location', function($scope, Authentication, User, $location){
	var user = Authentication.user;
	$scope.testDirective = 'this is a test to see if my scope is propogating correctly';

	$scope.process = '';
	$scope.codeError = false;

	$scope.continue = function() {
		if($scope.process === '' || $scope.process === undefined) {
			$scope.codeError = true;
		} else {
			// this will activate once we set these to vals that will affect the issues/problem areas
			// User.$save(user);
			$location.path('onboarding-problems');
		}
	};
}]);
