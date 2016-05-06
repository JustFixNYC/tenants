'use strict';

angular.module('onboarding').factory('Problems', ['$resource','$q', '$http', function($resource, q, $http){

	var requestLocalFile = function() {
		var deferred = q.defer();

		$http.get('data/checklist.json').then(function(response) {
			deferred.resolve(response.data);
		}, function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	return {
		getLocalFile: function() {
			return requestLocalFile();
		}
	};



}]);
