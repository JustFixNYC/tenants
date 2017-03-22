'use strict';

//Setting up route
angular.module('findhelp').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('findHelp', {
				url: '/find-help',
				templateUrl: 'modules/findhelp/views/find-help.client.view.html',
				data: { protected: true },
				user: 'tenant'
			});

	}
]);
