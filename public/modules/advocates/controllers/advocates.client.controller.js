'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Advocates', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Advocates, $http, $modal) {

		$scope.user = Authentication.user;

		$scope.list = function() {
			Advocates.query(function(tenants) {
				console.log(tenants);
				$scope.tenants = tenants;
			});
		};

		$scope.view = 'building';
		$scope.changeView = function(newView) {
			$scope.view = newView;
		};

	}]);
