'use strict';

// TODO: discuss putting all 'run' methods together
angular.module('onboarding').run(['$rootScope', '$state', 'Authentication', 'Users', '$window', function($rootScope, $state, Authentication, Users, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {


		// Force an update to the user object if an appt has been scheduled
		// If not, this is harmless
		if(fromState.name === 'onboarding.schedule') {
			Users.me();
		}

	});

}]);
