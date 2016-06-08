'use strict';

//Setting up route
angular.module('tutorial').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Tutorial state routing

		$urlRouterProvider.when('/tutorial', '/tutorial/intro');



		$stateProvider
		.state('tutorial', {
      url: '/tutorial',
			templateUrl: 'modules/tutorial/views/intro.client.view.html',
      abstract: true,
      data: {
        disableBack: true
      }
    })
		.state('tutorial.intro', {
			url: '/intro',
			templateUrl: 'modules/tutorial/views/intro.client.view.html'
		});
	}
]);