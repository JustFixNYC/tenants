'use strict';

//Setting up route
angular.module('actions').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		
		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');		

		// Issues state routing
		$stateProvider.	
		state('listActions', {
			url: '/home',
			templateUrl: 'modules/actions/views/list-actions.client.view.html'
		});					

	}
]);