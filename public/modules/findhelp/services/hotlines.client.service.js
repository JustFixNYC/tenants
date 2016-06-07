'use strict';

angular.module('onboarding').factory('Hotlines', ['$http', '$q',
	function($http, $q){

		var requestLocalFile = function() {
			var deferred = $q.defer();

			$http.get('data/hotlines.json').then(function(response) {
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
