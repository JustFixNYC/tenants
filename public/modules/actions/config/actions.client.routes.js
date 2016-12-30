'use strict';

//Setting up route
angular.module('actions').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {


		// Actions state routing
		$stateProvider
			.state('listActions', {
				url: '/take-action',
				templateUrl: 'modules/actions/views/list-actions.client.view.html',
				data: { protected: true }
			});

	}
]);
