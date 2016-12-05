'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Advocates', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Advocates, $http, $modal) {

		$scope.user = Authentication.user;

		$scope.list = function() {
			Advocates.query().then(function (tenants) {
				$scope.tenants = tenants;
				console.log(tenants);
			});
		};

		$scope.view = 'individual';
		$scope.changeView = function(newView) {
			$scope.view = newView;
		};

	}]);
