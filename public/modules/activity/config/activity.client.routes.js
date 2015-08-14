'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		
		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');		

		// Issues state routing
		$stateProvider.	
		state('listActivity', {
			url: '/timeline',
			templateUrl: 'modules/activity/views/list-activity.client.view.html'
		});					

	}
]);