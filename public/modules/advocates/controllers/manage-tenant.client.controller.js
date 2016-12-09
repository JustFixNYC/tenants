'use strict';

angular.module('advocates').controller('ManageTenantController', [
					'$scope', '$stateParams', 'Authentication', 'Advocates', 'tenant',
	function($scope, $stateParams, Authentication, Advocates, tenant) {

		$scope.user = Authentication.user;
		$scope.tenant = tenant;


		$scope.$watch('tenant', function (tenant) {
			console.log('change in root', tenant);
		}, true);

	}])
	.controller('ManageTenantHomeController', ['$scope', '$stateParams', '$filter', 'deviceDetector', 'Advocates', 'Lightbox',
		function($scope, $stateParams, $filter, deviceDetector, Advocates, Lightbox) {

			$scope.$watch('tenant', function (tenant) {
				console.log('change in home', tenant);
			}, true);

			$scope.photos = [];
			$scope.tenant.activity.forEach(function (act) {
				$scope.photos = $scope.photos.concat(act.photos);
			});

			$scope.isDesktop = deviceDetector.isDesktop();

			$scope.activityTemplate = function(key) {
				return $filter('activityTemplate')(key);
			};

			$scope.compareDates = function(start, created) {
				var startDate = new Date(start).setHours(0,0,0,0);
				var createdDate = new Date(created).setHours(0,0,0,0);
				return startDate !== createdDate;
			};

			$scope.openLightboxModal = function (photos, index) {
				Lightbox.openModal(photos, index);
			};


		}])
		.controller('ManageTenantProblemsController', ['$scope', '$stateParams', 'Advocates', 'ProblemsResource',
			function($scope, $stateParams, Advocates, ProblemsResource) {

				$scope.saveProblems = function () {

					console.log('before', $scope.tenant);
					var tenant = new ProblemsResource($scope.tenant);
					tenant.$updateManagedChecklist({ id: $scope.tenant._id }, function(response) {
						console.log('after', response);

						// need to use angular.extend rather than scope.tenant = response
						// this will actually update all the attributes
						// (and trigger an update in parent controllers)
						angular.extend($scope.tenant, response);
					});

				};


			}]);
