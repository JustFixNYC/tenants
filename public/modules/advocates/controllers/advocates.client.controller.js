'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Advocates', '$http', '$modal', 'tenants',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Advocates, $http, $modal, tenants) {

		$scope.user = Authentication.user;
		$scope.tenants = tenants;
		$scope.bbls = {};

		// used for the bblsToAddress filter
		angular.forEach(tenants, function(tenant) {
			// get a title case version of the streetname from geoclient
			var streetName = tenant.geo.streetName.split(' ').map(function(i) { return i[0].toUpperCase() + i.substr(1).toLowerCase(); }).join(' ');
			$scope.bbls[tenant.geo.bbl] = tenant.geo.streetNum + ' ' + streetName;
		});

		$scope.view = 'individual';
		$scope.changeView = function(newView) {
			$scope.view = newView;
		};

		$scope.viewTenant = function(tenant) {
			// Advocates.setCurrent(tenant);
			Advocates.setCurrentTenant(tenant);
			$state.go('manageTenant.home', { id: tenant._id});
		};

	}]);
