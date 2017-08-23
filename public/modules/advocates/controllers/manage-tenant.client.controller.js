'use strict';

angular.module('advocates').controller('ManageTenantController', [
					'$scope', '$stateParams', 'deviceDetector', 'Authentication', 'Advocates', 'tenant',
	function($scope, $stateParams, deviceDetector, Authentication, Advocates, tenant) {

		$scope.user = Authentication.user;
		$scope.device = deviceDetector;
		$scope.tenant = tenant;

		//
		// $scope.$watch('tenant', function (tenant) {
		// 	console.log('change in root', tenant);
		// }, true);

	}])
	.controller('ManageTenantHomeController', ['$scope', '$stateParams', '$filter', '$modal', 'deviceDetector', 'Advocates', 'Lightbox',
		function($scope, $stateParams, $filter, $modal, deviceDetector, Advocates, Lightbox) {



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

			$scope.openSethLowReferralModal = function() {

				var modalInstance = $modal.open({
					//animation: false,
					templateUrl: 'modules/advocates/partials/seth-low-sms-referral.html',
					controller: 'SethLowSMSReferralController',
					backdrop: 'static',
					resolve: {
						tenantPhone: function () { return $scope.tenant.phone; }
					}
				});
			};


		}])
		.controller('ManageTenantProblemsController', ['$rootScope', '$scope', '$state', '$stateParams', 'Advocates', 'ProblemsResource',
			function($rootScope, $scope, $state, $stateParams, Advocates, ProblemsResource) {

				$scope.problemsAlert = false;

				$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

					// make sure this only happens once (no infinite loops)
					// AND only happens if they've actually changed anything...
					if($scope.hasChangedProblems && !toState.updated) {

					  event.preventDefault();
						toState.updated = true;
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

								$rootScope.dashboardSuccess = true;
								$rootScope.loading = false;
								$state.go(toState);
							}, function(err) {
								$rootScope.loading = false;
								$scope.problemsAlert = true;

							});

					// this gets called a second time with $state.go,
					// so we're just going to pass things along
					} else if(toState.updated) {
					  toState.updated = false;
					}

				});


				$scope.saveProblems = function () {

					// console.log('before', $scope.tenant);

					$rootScope.loading = true;
					$scope.problemsAlert = false;

					var tenant = new ProblemsResource($scope.tenant);
					tenant.$updateManagedChecklist({ id: $scope.tenant._id },
						function(response) {
							// console.log('after', response);

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
