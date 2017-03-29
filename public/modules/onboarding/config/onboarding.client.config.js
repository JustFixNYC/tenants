'use strict';

// TODO: discuss putting all 'run' methods together
angular.module('onboarding').run(['$rootScope', '$location', 'Authentication', 'Users', '$window', function($rootScope, $location, Authentication, Users, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {


		if(toState.onboarding && Authentication.user) {
			$location.path('/');
		}

		// Force an update to the user object if an appt has been scheduled
		// If not, this is harmless
		if(fromState.name === 'onboarding.scheduleNew') {
			Users.me();
		}



	});

}]);
