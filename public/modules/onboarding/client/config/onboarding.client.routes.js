(function () {
  'use strict';

  //Setting up route
  angular
    .module('onboarding')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Onboarding state routing
    $stateProvider
      .state('onboarding-problems', {
        url: '/onboarding-problems',
        templateUrl: 'modules/onboarding/client/views/onboarding-problems.client.view.html',
        controller: 'OnboardingProblemsController',
        controllerAs: 'vm'
      });
  }
})();
