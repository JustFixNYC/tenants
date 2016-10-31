'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('admin').factory('Passwords', ['$resource',
	function($resource) {
		return $resource('api/auth/temp-password', {}, {
			create: {
				method: 'POST'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
