'use strict';

//Setting up route
angular.module('advocates').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
    // $urlRouterProvider.when('/advocate/signup', '/advocate/signup/create');

		// Advocate state routing
		$stateProvider
			.state('advocateSignup', {
				url: '/advocate/signup',
				templateUrl: 'modules/advocates/views/signup.client.view.html',
				controller: 'AdvocateSignupController',
				abstract: true,
				data: {
					disableBack: true
				}
			})
			.state('advocateSignup.info', {
				url: '',
				templateUrl: 'modules/advocates/partials/signup-info.client.view.html',
				globalStyles: 'white-bg'
			})
			.state('advocateSignup.details', {
				url: '/create',
				templateUrl: 'modules/advocates/partials/signup-details.client.view.html'
			})
			.state('advocateSignup.referral', {
				url: '/referral',
				templateUrl: 'modules/advocates/partials/signup-referral.client.view.html'
			})
			.state('newTenantSignup', {
				url: '/advocate/tenant/new',
				templateUrl: 'modules/advocates/views/new-tenant.client.view.html',
				controller: 'NewTenantSignupController',
				abstract: true,
				user: 'advocate',
				data: {
					disableBack: true
				}
			})
			.state('newTenantSignup.problems', {
				url: '/checklist',
				templateUrl: 'modules/advocates/partials/new-tenant-problems.client.view.html'
			})
			.state('newTenantSignup.details', {
				url: '/personal',
				templateUrl: 'modules/advocates/partials/new-tenant-details.client.view.html'
			})
			.state('advocateHome', {
				url: '/advocate',
				templateUrl: 'modules/advocates/views/home.client.view.html',
				controller: 'AdvocateController',
				globalStyles: 'fluid-container',
				user: 'advocate',
				data: {
					disableBack: true
				},
				resolve: {
					tenants: ['Advocates', function(Advocates) {
						// forces resolution, see: http://www.jvandemo.com/how-to-resolve-angularjs-resources-with-ui-router/
						return Advocates.query().$promise;
					}]
				}
			})
			.state('advocateHelp', {
				url: '/advocate/information',
				templateUrl: 'modules/advocates/views/help.client.view.html',
				controller: 'AdvocateHelpController',
				user: 'advocate'
			})
			.state('manageTenant', {
				url: '/advocate/manage/:id',
				templateUrl: 'modules/advocates/views/manage-tenant.client.view.html',
				controller: 'ManageTenantController',
				user: 'advocate',
				abstract: true,
				resolve: {
					tenant: ['Advocates', '$stateParams', function(Advocates, $stateParams) {
						return Advocates.getTenantByCurrentOrId($stateParams.id);
					}]
				}
			})
			.state('manageTenant.home', {
				url: '',
				templateUrl: 'modules/advocates/partials/manage-tenant-home.client.view.html',
				controller: 'ManageTenantHomeController'
			})
			.state('manageTenant.problems', {
				url: '/problems',
				templateUrl: 'modules/advocates/partials/manage-tenant-problems.client.view.html',
				controller: 'ManageTenantProblemsController'
			});
	}
]);
