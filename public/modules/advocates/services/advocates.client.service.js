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
	.factory('Advocates', ['AdvocatesResource', '$q', function(AdvocatesResource, $q) {

		var _this = this;

		// _this.query = function() {
		//
		// 	var queried = $q.defer();
		//
		// 	AdvocatesResource.query(function (tenants) {
		// 		_this._tenants = tenants;
		// 		queried.resolve(tenants);
		// 	});
		//
		// 	return queried.promise;
		// };

		return {
			query: AdvocatesResource.query,
			setCurrentTenant: function(tenant) {
				_this._currentTenant = tenant;
			},
			getTenantByCurrentOrId: function(id) {

				var filtered = $q.defer();

				var filterTenant = function () {
					var tenant = _this._tenants.filter(function (t) {
						return t._id === id;
					});
					filtered.resolve(tenant[0]);
				};

				if(_this._currentTenant) {
					// console.log('current');
					filtered.resolve(_this._currentTenant);
				} else {
					// console.log('query');
					AdvocatesResource.query(function (tenants) {
						// console.log(tenants);
						filtered.resolve(tenants.filter(function (t) { return t._id === id; })[0]);
					});
				}

				// if(_this._currentTenant) {
				// 	console.log('current');
				// 	filtered.resolve(_this._currentTenant);
				// } else if(!_this._tenants) {
				// 	console.log('query');
				// 	_this.query().then(function () {
				// 		filterTenant();
				// 	});
				// } else {
				// 	console.log('filter');
				// 	filterTenant();
				// }

				return filtered.promise;
			}
		};

		//
		// this.
	}]);
