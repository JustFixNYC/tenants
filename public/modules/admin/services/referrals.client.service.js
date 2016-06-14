'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('admin').factory('Referrals', ['$resource',
	function($resource) {
		return $resource('api/referrals', {}, {
			update: {
				method: 'PUT'
			},
			validate: {
				method: 'GET',
				url: '/api/referrals/validate'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
