'use strict';

angular.module('advocates').controller('ManageTenantController', [
					'$rootScope', '$scope', '$stateParams', '$filter', 'deviceDetector', 'Authentication', 'Advocates', 'Lightbox',
	function($rootScope, $scope, $stateParams, $filter, deviceDetector, Authentication, Advocates, Lightbox) {

		$scope.user = Authentication.user;

		$scope.init = function() {
			Advocates.getTenantById($stateParams.id).then(function (tenant) {
				$scope.tenant = tenant;
				console.log(tenant);
			})
		};

		$scope.isDesktop = deviceDetector.isDesktop();

		$scope.activityTemplate = function(key) {
			return $filter('activityTemplate')(key);
		};

		$scope.compareDates = function(start, created) {
			var startDate = new Date(start).setHours(0,0,0,0);
			var createdDate = new Date(created).setHours(0,0,0,0);
			return startDate !== createdDate;
		}

		$scope.openLightboxModal = function (photos, index) {
			Lightbox.openModal(photos, index);
		};


	}]);
