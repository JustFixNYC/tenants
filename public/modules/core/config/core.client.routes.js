'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$provide',
	function($stateProvider, $urlRouterProvider, $provide) {

		$provide.decorator('accordionGroupDirective', function($delegate) {
	    //we now get an array of all the datepickerDirectives, 
	    //and use the first one
	    $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion-group.html';
	    return $delegate;
	  });

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);