'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$location', '$window', 'Authentication',
  function($rootScope, $state, $location, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      // prevent different roles from going different places
      if(toState.user) {
				if(!Authentication.user) {
					// event.preventDefault();
					// $state.go('signin');
          $location.path('/signin');
				} else if(Authentication.user.roles.indexOf(toState.user) === -1) {
					// event.preventDefault();
					// $state.go('not-found');
          $location.path('/not-found');
				}
			}

      // protected areas
      if(!Authentication.user && toState.data && toState.data.protected) {
        // event.preventDefault();
        // $state.go('signin');
        $location.path('/signin');
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
