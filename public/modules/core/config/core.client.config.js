'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$window', 'Authentication',
  function($rootScope, $state, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(Authentication.user && toState.name === 'landing') {
        event.preventDefault();
        $state.go('home');
      }
      if(!Authentication.user && toState.data && toState.data.protected) {
        event.preventDefault();
        $state.go('signin');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);
    });
  }
]);
