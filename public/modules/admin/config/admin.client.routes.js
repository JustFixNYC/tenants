'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider.
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html',
			data: { protected: true }
		});

	}
]);
