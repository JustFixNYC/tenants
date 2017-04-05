'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$timeout', '$filter', 'Authentication', 'Advocates', '$http', '$modal', 'tenants',
	function($rootScope, $scope, $state, $location, $timeout, $filter, Authentication, Advocates, $http, $modal, tenants) {

		$scope.user = Authentication.user;
		$scope.tenants = tenants;
		$scope.bbls = {};

		$scope.currentLocation = $location.protocol() + '://' + $location.host() + (($location.port() !== 80 && $location.port() !== 443) ? ':' + $location.port() : '');

		// used for the bblsToAddress filter
		angular.forEach(tenants, function(tenant) {
			// get a title case version of the streetname from geoclient
			var streetName = tenant.geo.streetName
				.split(' ')
				.map(function(i) {
					return i.length ? i[0].toUpperCase() + i.substr(1).toLowerCase() : i;
				})
				.join(' ');
			$scope.bbls[tenant.geo.bbl] = tenant.geo.streetNum + ' ' + streetName;
		});

		$scope.view = 'individual';
		$scope.changeView = function(newView) {
			$scope.view = newView;
		};

		$scope.copyTooltipText = "Click to copy";

		$scope.copied = function() {
			$scope.copyTooltipText = "Link copied!";
		};

		$scope.mouseleave = function() {
			$timeout(function () {
				$scope.copyTooltipText = "Click to copy";
			}, 300);
		};

		$scope.viewTenant = function(tenant) {
			// Advocates.setCurrent(tenant);
			Advocates.setCurrentTenant(tenant);
			$state.go('manageTenant.home', { id: tenant._id});
		};

	}]);
