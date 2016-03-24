'use strict';

angular.module('onboarding').factory('AccessCode', ['$resource', function($resource) {

	return 'fuck';

	$resource('access-code', {}, {
		save: {
			method: 'POST'
		}
	});

}]);
