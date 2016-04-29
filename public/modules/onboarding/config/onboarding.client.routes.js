'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    // Jump to first child state
    $urlRouterProvider.when('/onboarding', '/onboarding/code');

  	// Onboarding state routing
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
        controller: 'OnboardingController',
        abstract: true
      })
      .state('onboarding.accessCode', {
        url: '/code',
        templateUrl: 'modules/onboarding/partials/onboarding-code.client.view.html'
      })      
      .state('onboarding.problems', {
        url: '/checklist',
        templateUrl: 'modules/onboarding/partials/onboarding-problems.client.view.html'
      })
      .state('onboarding.details', {
        url: '/personal',
        templateUrl: 'modules/onboarding/partials/onboarding-details.client.view.html'
      })
      .state('onboarding.tutorial', {
        url: '/tutorial',
        templateUrl: 'modules/onboarding/partials/onboarding-tutorial.client.view.html'
      });
    // $stateProvider
    //   .state('onboarding-tutorial', {
    //     url: '/onboarding-tutorial',
    //     templateUrl: 'modules/onboarding/views/onboarding-tutorial.client.view.html',
    //     controller: 'OnboardingTutorialController',
    //     controllerAs: 'vm'
    //   });
}]);
