'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('advocates')
	.factory('AdvocatesResource', ['$resource', function($resource) {
			return $resource('api/advocates', {}, {
				// update: {
				// 	method: 'PUT'
				// },
				// getTenants: {
				// 	method: 'GET',
				// 	url: '/api/advocates/tenants'
				// },
				validateNewUser: {
					method: 'GET',
					url: '/api/advocates/validate/new'
				}
	      // ,
	      // getIssues: {
	      //   method: 'GET'
	      // }
			});
		}
	])
	.service('Advocates', ['AdvocatesResource', '$q', function(AdvocatesResource, $q) {

		var _this = this;

		this.query = function() {

			var queried = $q.defer();

			AdvocatesResource.query(function (tenants) {
				_this.tenants = tenants;
				queried.resolve(tenants);
			});

			return queried.promise;
		};

		this.getTenantById = function(id) {

			var filtered = $q.defer();

			var filterTenant = function () {
				var tenant = _this.tenants.filter(function (t) {
					return t._id === id;
				});
				filtered.resolve(tenant[0]);
			}

			if(!_this.tenants) {
				_this.query().then(function () {
					filterTenant();
				})
			} else {
				filterTenant();
			}

			return filtered.promise;
		};
	}]);
