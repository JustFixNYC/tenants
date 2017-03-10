'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('UpdateUserInterceptor', ['Authentication',
	function (Authentication) {
    //Code
    return {
        response: function(res) {
					Authentication.user = res.resource;
					return res;
        }
		};
	}
]);

angular.module('users').factory('Users', ['$resource', 'UpdateUserInterceptor',
	function($resource, UpdateUserInterceptor) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT',
				interceptor: UpdateUserInterceptor
			},
			updatePhone: {
				method: 'PUT',
				url: 'api/users/phone',
				interceptor: UpdateUserInterceptor
			},
			toggleSharing: {
				method: 'GET',
				url: 'api/tenants/public'
			},
			addScheduledEventAndLinkProfile: {
				method: 'PUT',
				url: 'api/tenants/schedule',
				interceptor: UpdateUserInterceptor
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
