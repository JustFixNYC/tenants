;'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider', 'LightboxProvider',
	function($stateProvider, $urlRouterProvider, LightboxProvider) {

		LightboxProvider.templateUrl = 'modules/activity/partials/lightbox-template.html';

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
				url: '/share/:key',
				templateUrl: 'modules/activity/views/list-activity-public.client.view.html',
				data: { disableBack: true }
			})
			.state('print', {
				url: '/print',
				templateUrl: 'modules/activity/views/print.client.view.html',
				data: {disableBack: true},
				globalStyles: 'clear-nav'
			});

	}
]);
