'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('advocates').factory('Referrals', ['$resource',
	function($resource) {
		return $resource('api/referrals', {}, {
			// update: {
			// 	method: 'PUT'
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
