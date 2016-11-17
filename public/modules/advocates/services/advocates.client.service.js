'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('advocates').factory('Advocates', ['$resource',
	function($resource) {
		return $resource('api/advocates', {}, {
			// update: {
			// 	method: 'PUT'
			// },
			// getTenants: {
			// 	method: 'GET',
			// 	url: '/api/advocates/tenants'
			// },
			validateNewUser: {
				method: 'GET',
				url: '/api/advocates/validate/new'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
