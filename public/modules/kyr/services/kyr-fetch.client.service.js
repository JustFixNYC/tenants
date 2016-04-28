'use strict';

angular.module('kyr').factory('kyrService', ['$resource', '$http', '$q',
	function($resource, $http, $q) {

		// Get all
		// Should be able to bring this over as a Query All from mongoDB at a later state
		this.fetch = function () {
			var deferred = $q.defer();
			$http.get('/data/kyr.json').then(function(data){
				var finalData = data.data;
				console.log('are we fetching?');
				deferred.resolve(finalData);
			}, function(err) {
				console.log(err);
				deferred.reject(err);
			});
			return deferred.promise;
		};

		// Query single kyr
		this.single = function(id) {
			var deferred = $q.defer();
			$http.get('/data/kyr.json').then(function(data){

				// Get correct Know Your Rights
				var finalKyr = data.data[id];
				
				// get our next-previous
				var length = data.data.length;

				if(id === length - 1) {
					finalKyr.next = false;
				} else {
					finalKyr.next = id + 2;
				}

				if(id <= 0) {
					finalKyr.prev = false;
				} else {
					console.log('prev?');
					finalKyr.prev = id;
				}

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
