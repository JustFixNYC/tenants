'use strict';

//Setting up route
angular.module('problems').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Issues state routing
		$stateProvider.
		state('updateProblems', {
			url: '/checklist',
			templateUrl: 'modules/problems/views/update-problems.client.view.html',
			user: 'tenant'
		});

	}
]);
