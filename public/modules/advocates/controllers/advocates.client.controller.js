'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Referrals', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Referrals, $http, $modal) {

		$scope.user = Authentication.user;


	}]);
