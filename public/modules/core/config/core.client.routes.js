'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$provide',
	function($stateProvider, $urlRouterProvider, $provide) {

		// $provide.decorator('accordionGroupDirective', function($delegate) {
	  //   $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion-group.html';
	  //   return $delegate;
	  // });
		// $provide.decorator('accordionDirective', function($delegate) {
	  //   $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion.html';
	  //   return $delegate;
	  // });


		// Redirect to home view when route not found
		// $urlRouterProvider.otherwise('/');
		$urlRouterProvider.otherwise('/not-found');


		// Redirect rules for when the user comes to the root domain for the app
		$urlRouterProvider.rule(function ($injector, $location) {

			var user = $injector.get('Authentication').user;

			if($location.path() === '/') {
				if(!user) {
					return '/signup';
				} else {
				  switch(user.roles[0]) {
	          case 'admin':
							return '/admin';
	          case 'advocate':
	            return '/advocate';
	          case 'tenant':
							return '/home';
	          default:
							return '/home';
	        }
				}
			}
		});

		// Home state routing
		$stateProvider
		.state('landing', {
			url: '/',
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
		.state('oldLanding', {
			url: '/espanol',
			templateUrl: 'modules/core/views/landing.client.view.html',
			onEnter: function(LocaleService, $state) {
				LocaleService.setLocaleByName('es_mx');
			},
			data: {
				disableBack: true
			},
			globalStyles: 'landing white-bg'
		})
		// .state('manifesto', {
		// 	url: '/manifesto',
		// 	templateUrl: 'modules/core/views/manifesto.client.view.html',
		// 	data: {
		// 		disableBack: true
		// 	}
		// })
		// .state('espanol', {
		// 	url: '/espanol',
		// 	onEnter: function(LocaleService, $state) {
		// 		LocaleService.setLocaleByName('es_mx');
		// 		$state.go('landing');
		// 	}
		// })
		.state('donate', {
			url: '/donate',
			onEnter: function($window) {
		 		$window.open('https://www.justfix.nyc/donate', '_self');
 			}
		})
		.state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html',
			data: {
				protected: true,
				disableBack: true
			},
			user: 'tenant'
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
