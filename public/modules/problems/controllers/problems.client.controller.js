'use strict';

angular.module('problems').controller('ProblemsController', ['$rootScope', '$scope', '$state', 'Authentication', 'Users', 'ProblemsResource', 'Problems',
	function($rootScope, $scope, $state, Authentication, Users, ProblemsResource, Problems) {

		$scope.user = Authentication.user;

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

			// make sure this only happens once (no infinite loops)
			// AND only happens if they've actually changed anything...
			if($scope.hasChangedProblems && !toState.updated) {

			  event.preventDefault();
				toState.updated = true;
			  $rootScope.loading = true;

			  var user = new ProblemsResource(Authentication.user);
				user.$updateChecklist(function(response) {

			    $rootScope.loading = false;
					$rootScope.dashboardSuccess = true;
			    $state.go(toState);

				}, function(response) {

			    $rootScope.loading = false;
					$rootScope.dashboardError = true;
					$state.go(toState);

				});

			// this gets called a second time with $state.go,
			// so we're just going to pass things along
			} else if(toState.updated) {
			  toState.updated = false;
			}

		});


	}])
