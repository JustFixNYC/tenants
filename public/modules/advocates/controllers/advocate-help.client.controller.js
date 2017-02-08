'use strict';

angular.module('advocates').controller('AdvocateHelpController', ['$rootScope', '$scope', '$state', '$location', '$timeout', '$filter', 'Authentication', 'Advocates', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $timeout, $filter, Authentication, Advocates, $http, $modal) {

		$scope.user = Authentication.user;

	}]);
