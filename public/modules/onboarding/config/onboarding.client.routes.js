'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    // Jump to first child state
    $urlRouterProvider.when('/onboarding', '/onboarding/referral');

  	// Onboarding state routing
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
        controller: 'OnboardingController',
        abstract: true,
        data: {
          disableBack: true
        }
      })
      .state('onboarding.accessCode', {
        url: '/referral',
        templateUrl: 'modules/onboarding/partials/onboarding-code.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg'
      })
      .state('onboarding.problems', {
        url: '/checklist',
        templateUrl: 'modules/onboarding/partials/onboarding-problems.client.view.html',
        onboarding: true
      })
      .state('onboarding.details', {
        url: '/personal',
        templateUrl: 'modules/onboarding/partials/onboarding-details.client.view.html',
        onboarding: true
      })
      .state('onboarding.tutorial', {
        url: '/tutorial',
        templateUrl: 'modules/onboarding/partials/onboarding-tutorial.client.view.html',
        onboarding: true
      });

}]);
