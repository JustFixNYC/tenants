'use strict';

angular.module('onboarding').run(['$rootScope', '$state', 'Authentication', '$window', function($rootScope, $state, Authentication, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if(!Authentication.user && toState.onboarding && !$rootScope.validated && toState.name !== 'onboarding.accessCode') {
			event.preventDefault();
			$state.go('onboarding.accessCode');
		}
	});

}]);
