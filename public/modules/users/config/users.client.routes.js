'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Users state routing
    // Jump to first child state
    $urlRouterProvider.when('/settings', '/settings/profile');

		$stateProvider
      .state('settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'modules/users/views/settings/settings.client.view.html',
        abstract: true
      })
   		.state('settings.profile', {
   			url: '/profile',
				templateUrl: 'modules/users/views/settings/landing.client.view.html',
				settings: true
   		})
   		.state('settings.edit', {
				url: '/edit',
				templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
				settings: true
   		})
   		.state('settings.password', {
				url: '/password',
				templateUrl: 'modules/users/views/settings/change-password.client.view.html',
				settings: true
   		})
   		.state('settings.phone', {
   			url:'/phone',
				templateUrl: 'modules/users/views/settings/edit-phone.client.view.html',
				settings: true
   		});

		// This should be a separate router block -- it deals w/ abstract and nonleanear flows
		$stateProvider.
			state('signin', {
				url: '/signin',
				templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			}).
			state('auto-signin', {
				url: '/auto-signin',
				templateUrl: 'modules/users/views/authentication/auto-signin.client.view.html'
			}).
			state('forgot', {
				url: '/password/forgot',
				templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
			}).
			state('reset-invalid', {
				url: '/password/reset/invalid',
				templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
			}).
			state('reset-success', {
				url: '/password/reset/success',
				templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
			}).
			state('reset', {
				url: '/password/reset/:token',
				templateUrl: 'modules/users/views/password/reset-password.client.view.html'
			});

	}
]);
