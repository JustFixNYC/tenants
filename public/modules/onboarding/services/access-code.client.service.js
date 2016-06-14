'use strict';

angular.module('onboarding').factory('AccessCodeService', ['$resource', function($resource) {

	return $resource('access-code', {}, {
		save: {
			method: 'POST'
		},
		get: {
			method: 'GET'
		},
		delete: {
			method: 'DELETE'
		}
	});

}]);
