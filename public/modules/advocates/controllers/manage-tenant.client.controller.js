'use strict';

angular.module('advocates').controller('ManageTenantController', [
					'$scope', '$stateParams', 'Authentication', 'Advocates', 'tenant',
	function($scope, $stateParams, Authentication, Advocates, tenant) {

		$scope.user = Authentication.user;
		$scope.tenant = tenant;


		// $scope.$watch('tenant', function (tenant) {
		// 	console.log('change in root', tenant);
		// }, true);

	}])
	.controller('ManageTenantHomeController', ['$scope', '$stateParams', '$filter', 'deviceDetector', 'Advocates', 'Lightbox',
		function($scope, $stateParams, $filter, deviceDetector, Advocates, Lightbox) {



			$scope.$watch('tenant', function (tenant) {
				// console.log('change in home', tenant);
				$scope.photos = [];
				$scope.tenant.activity.forEach(function (act) {
					$scope.photos = $scope.photos.concat(act.photos);
				});
			}, true);




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
		.controller('ManageTenantProblemsController', ['$rootScope', '$scope', '$state', '$stateParams', 'Advocates', 'ProblemsResource',
			function($rootScope, $scope, $state, $stateParams, Advocates, ProblemsResource) {

				$scope.problemsAlert = false;

				$scope.saveProblems = function () {

					console.log('before', $scope.tenant);

					$rootScope.loading = true;
					$scope.problemsAlert = false;

					var tenant = new ProblemsResource($scope.tenant);
					tenant.$updateManagedChecklist({ id: $scope.tenant._id },
						function(response) {
							console.log('after', response);

							// need to use angular.extend rather than scope.tenant = response
							// this will actually update all the attributes
							// (and trigger an update in parent controllers)
							angular.extend($scope.tenant, response);

							$rootScope.loading = false;
							$state.go('manageTenant.home');
						}, function(err) {
							$rootScope.loading = false;
							$scope.problemsAlert = true;

						});

				};


			}]);
