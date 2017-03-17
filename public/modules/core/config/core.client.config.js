'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$window', 'Authentication',
  function($rootScope, $state, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      // prevent different roles from going different places
      if(toState.user) {
				if(!Authentication.user) {
					event.preventDefault();
					$state.go('signin');
				} else if(Authentication.user.roles.indexOf(toState.user) === -1) {
					event.preventDefault();
					$state.go('not-found');
				}
			}

      // New orientation flow
      if(!Authentication.user && toState.name === 'landing') {
        event.preventDefault();
        $state.go('onboarding.orientation');
      }

      if(Authentication.user && toState.name === 'landing') {
        switch(Authentication.user.roles[0]) {
          case 'admin':
            event.preventDefault();
            $state.go('admin');
            break;
          case 'advocate':
            event.preventDefault();
            $state.go('advocateHome');
            break;
          case 'tenant':
            event.preventDefault();
            $state.go('home');
            break;
          default:
            event.preventDefault();
            $state.go('home');
            break;
        }
      }

      if(!Authentication.user && toState.data && toState.data.protected) {
      // if(toState.data && toState.data.protected) {
        event.preventDefault();
        $state.go('signin');
      }

    });

    // set global styles
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);

      if(toState.globalStyles) {
        $rootScope.globalStyles = toState.globalStyles;
      } else {
        $rootScope.globalStyles = '';
      }

      if(Authentication.user && Authentication.user.roles.indexOf('advocate') !== -1) {
        $rootScope.globalStyles += ' advocate-view';
      }

    });
  }
]);
