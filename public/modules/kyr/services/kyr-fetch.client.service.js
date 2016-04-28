'use strict';

angular.module('kyr').factory('kyrService', ['$resource', '$http', '$q',
	function($resource, $http, $q) {
		var deferred = $q.defer();

		// Get all
		// Should be able to bring this over as a Query All from mongoDB at a later state
		this.fetch = function () {
			$http.get('/data/kyr.json').then(function(data){
				var finalData = data.data;
				deferred.resolve(finalData);
			}, function(err) {
				console.log(err);
				deferred.reject(err);
			});
			return deferred.promise;
		};

		// Query single kyr
		this.single = function(id) {
			$http.get('/data/kyr.json').then(function(data){

				// Get correct Know Your Rights, check, then pass it thru
				var finalKyr = data.data[id];
				if(finalKyr !== undefined) {
					deferred.resolve(finalKyr);
				} else {
					deferred.reject('This KYR does not exist');
				}
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		return this;

	}]);
