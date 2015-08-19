'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {


		// NOTE: using justfix directive instead....

		// $scope.$watch(function(Authentication) { 
		// 	console.log('auth'); return $scope.authentication; 
		// });

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.isCollapsed = false;
			//$scope.currentStateTitle = toState.title;
			//console.log(toState.title);
		});


	}
]);