'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		
		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');		

		// Issues state routing
		$stateProvider.	
		state('listActivity', {
			url: '/activity',
			templateUrl: 'modules/actions/views/list-activity.client.view.html'
		});					

	}
]);