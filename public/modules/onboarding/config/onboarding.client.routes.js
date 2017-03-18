'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    // Jump to first child state
    $urlRouterProvider.when('/signup', '/onboarding/get-started');

    // Disabling access codes
    // $urlRouterProvider.when('/onboarding', '/onboarding/checklist');

  	// Onboarding state routing
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
        controller: 'OnboardingController',
        abstract: true
      })
      .state('onboarding.orientation', {
        url: '/get-started',
        templateUrl: 'modules/onboarding/partials/onboarding-orientation.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg',
        data: {
          disableBack: true
        }
      })
      // .state('onboarding.accessCode', {
      //   url: '/referral',
      //   templateUrl: 'modules/onboarding/partials/onboarding-orientation.client.view.html',
      //   onboarding: true,
      //   globalStyles: 'white-bg'
      // })
      .state('onboarding.success', {
        url: '/success',
        templateUrl: 'modules/onboarding/partials/onboarding-success.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg',
        data: {
          disableBack: true
        }
      })
      .state('onboarding.problems', {
        url: '/checklist',
        templateUrl: 'modules/onboarding/partials/onboarding-problems.client.view.html',
        onboarding: true,
      })
      .state('onboarding.details', {
        url: '/personal',
        templateUrl: 'modules/onboarding/partials/onboarding-details.client.view.html',
        onboarding: true
      })
      .state('onboarding.schedulePrompt', {
        url: '/consultation',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule-prompt.client.view.html',
        onboarding: true,
        data: {
          disableBack: true
        }
      })
      .state('onboarding.scheduleNew', {
        url: '/consultation/new',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule.client.view.html',
        onboarding: true
      });

}]);
