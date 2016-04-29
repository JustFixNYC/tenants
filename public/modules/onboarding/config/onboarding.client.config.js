'use strict';

angular.module('onboarding').run(['$rootScope', '$state', 'Authentication', '$window', function($rootScope, $state, Authentication, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log(toState.name);
		// if(destination.data && destination.data.needAdmin === true && Authentication.user.roles[0].toLowerCase() !== 'admin') {
		//if(de) {
			// e.preventDefault();
			// $window.location.href = '#!/home';
			//console.log('this should not be visible');
		//}
	});

}]);
