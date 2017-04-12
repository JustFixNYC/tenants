'use strict';

// Config HTTP Error Handling
angular.module('users')
	.config(['$httpProvider', function($httpProvider) {
			// Set the httpProvider "not authorized" interceptor
			$httpProvider.interceptors.push(['$rootScope', '$q', '$location', '$injector', 'Authentication',
				function($rootScope, $q, $location, $injector, Authentication) {
					return {
						responseError: function(rejection) {

							switch (rejection.status) {
								case 401:

									// Deauthenticate the global user
									Authentication.user = null;

									console.log('not logged in');

									// Redirect to signin page
									$injector.get('$state').transitionTo('signin');
									break;
								case 403:
									console.log('unauthorized or not found');
									$injector.get('$state').transitionTo('not-found');
									break;
							}

							return $q.reject(rejection);
						}
					};
				}
			]);
		}
	])
	.run(['$rootScope', '$state', '$location', '$window', 'Authentication', function($rootScope, $state, $location, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			// If user is signed in then redirect back home
			if (toState.name === 'signin' && Authentication.user) {
				$location.path('/');
			}

		});
	}]);
