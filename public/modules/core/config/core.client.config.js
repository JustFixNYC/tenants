'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$location', '$window', 'Authentication',
  function($rootScope, $state, $location, $window, Authentication) {

    // preserve query string across location redirects
    $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {

      if (oldUrl.indexOf('?') >= 0) {
        var queryString =  oldUrl.split('?')[1];
        newUrl = $location.$$path + '?' + queryString;
        $location.url(newUrl);
      }

      // is this necessary?
      // event.preventDefault();
      // return;
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      // prevent different roles from going different places
      if(toState.user) {
				if(!Authentication.user) {
					// event.preventDefault();
          $location.path('/signin');
				} else if(Authentication.user.roles.indexOf(toState.user) === -1) {
					// event.preventDefault();
          $location.path('/not-found');
				}
			}

      // protected areas -- TODO: should be deprecated
      if(!Authentication.user && toState.data && toState.data.protected) {
        // event.preventDefault();
        // $state.go('signin');
        $location.path('/signin');
      }

      // expand and focus status update area
      // if($location.search().status && $location.search().status === '1') {
      if($location.search().status) {
        $rootScope.expandStatus = true;
      }

	//kiran changes
      if($location.search().q) {
        $location.path('/onboarding/referral');
      }
      //kiran changes
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
