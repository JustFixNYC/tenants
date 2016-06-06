'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('listActivity', {
				url: '/your-case',
				templateUrl: 'modules/activity/views/list-activity.client.view.html',
				data: { protected: true }
			})
			.state('showPublic', {
				url: '/share',
				templateUrl: 'modules/activity/views/list-activity-public.client.view.html',
				data: { disableBack: true }
			});

	}
]);
