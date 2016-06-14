'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('admin').factory('Referrals', ['$resource',
	function($resource) {
		return $resource('referrals', {}, {
			update: {
				method: 'PUT'
			},
			validate: {
				method: 'GET',
				url: '/referrals/validate'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
