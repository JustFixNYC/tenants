'use strict';

angular.module('onboarding').factory('onboardingService', ['$resource','$q', '$http', function($resource, q, $http){
	
	this.localFile = function() {
		var deferred = q.defer();

		$http.get('data/checklist.json').then(function(response) {
			deferred.resolve(response.data);
		}, function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

}]);
