'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$provide',
	function($stateProvider, $urlRouterProvider, $provide) {

		$provide.decorator('accordionGroupDirective', function($delegate) {
	    $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion-group.html';
	    return $delegate;
	  });
		$provide.decorator('accordionDirective', function($delegate) {
	    $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion.html';
	    return $delegate;
	  });


		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('manifesto', {
			url: '/manifesto',
			templateUrl: 'modules/core/views/manifesto.client.view.html'
		});
	}
]);