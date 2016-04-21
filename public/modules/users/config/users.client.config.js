'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$rootScope', '$q', '$location', 'Authentication',
			function($rootScope, $q, $location, Authentication) {
				return {
					responseError: function(rejection) {

						switch (rejection.status) {
							case 401:

								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								$location.path('home');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
