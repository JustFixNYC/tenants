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
				globalStyles: 'white-bg advocate-view'
			})
			.state('advocateSignup.details', {
				url: '/create',
				templateUrl: 'modules/advocates/partials/signup-details.client.view.html',
				globalStyles: 'advocate-view'
			})
			.state('advocateSignup.referral', {
				url: '/referral',
				templateUrl: 'modules/advocates/partials/signup-referral.client.view.html',
				globalStyles: 'advocate-view'
			})
			.state('newTenantSignup', {
				url: '/advocate/tenant/new',
				templateUrl: 'modules/advocates/views/new-tenant.client.view.html',
				controller: 'NewTenantSignupController',
				abstract: true,
				data: {
					disableBack: true
				}
			})
			.state('newTenantSignup.problems', {
				url: '/checklist',
				templateUrl: 'modules/advocates/partials/new-tenant-problems.client.view.html',
				globalStyles: 'advocate-view'
			})
			.state('newTenantSignup.details', {
				url: '/personal',
				templateUrl: 'modules/advocates/partials/new-tenant-details.client.view.html',
				globalStyles: 'advocate-view'
			})
			.state('advocateHome', {
				url: '/advocate',
				templateUrl: 'modules/advocates/views/home.client.view.html',
				controller: 'AdvocateController',
				globalStyles: 'fluid-container advocate-view',
				data: {
					disableBack: true
				},
				resolve: {
					tenants: ['Advocates', function(Advocates) {
						return Advocates.query();
					}]
				}
			})
			.state('manageTenant', {
				url: '/advocate/manage/:id',
				templateUrl: 'modules/advocates/views/manage-tenant.client.view.html',
				controller: 'ManageTenantController',
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
				controller: 'ManageTenantHomeController',
				globalStyles: 'advocate-view'
			})
			.state('manageTenant.problems', {
				url: '/problems',
				templateUrl: 'modules/advocates/partials/manage-tenant-problems.client.view.html',
				controller: 'ManageTenantProblemsController',
				globalStyles: 'advocate-view'
			});
	}
]);
