'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			},
			toggleSharing: {
				method: 'GET',
				url: '/users/public'
			},
			updateChecklist: {
				method: 'PUT',
				url: '/users/checklist'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
