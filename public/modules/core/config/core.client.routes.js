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
		// $urlRouterProvider.otherwise('/');
		$urlRouterProvider.otherwise('/not-found');

		// Home state routing
		$stateProvider
		.state('landing', {
			url: '/',
			templateUrl: 'modules/core/views/landing.client.view.html',
			data: {
				disableBack: true
			},
			globalStyles: 'landing white-bg'
		})
		.state('not-found', {
			url: '/not-found',
			templateUrl: 'modules/core/views/404.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('manifesto', {
			url: '/manifesto',
			templateUrl: 'modules/core/views/manifesto.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('donate', {
			url: '/donate',
			onEnter: function($window) {
		 		$window.open('https://www.nycharities.org/give/donate.aspx?cc=4125', '_self');
 			}
		})
		.state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html',
			data: {
				protected: true,
				disableBack: true
			}
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'modules/core/views/contact.client.view.html',
			data: {
			},
			globalStyles: 'white-bg'
		})
	}
]);
