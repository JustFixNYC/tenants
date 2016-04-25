'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', function($stateProvider){

	// Onboarding state routing
  $stateProvider
    .state('onboarding', {
      url: '/onboarding',
      templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
      controller: 'OnboardingController'
    })
    .state('onboarding-create', {
      url: '/onboarding-admin',
      templateUrl: 'modules/onboarding/views/onboarding-create.client.view.html',
      controller: 'OnboardingCreateController',
      controllerAs: 'vm',
      data: {
      	needAdmin: true
      }
    })/*
    .state('selection', {
      url: '/onboarding-selection',
      templateUrl: 'modules/onboarding/views/onboarding-selection.client.view.html',
      controller: 'OnboardingSelectionController',
      controllerAs: 'vm'
    })*/
    .state('onboarding-problems', {
      url: '/onboarding-problems',
      templateUrl: 'modules/problems/views/onboarding-problems.client.view.html',
      controller: 'OnboardingProblemsController',
      controllerAs: 'vm'
    })
    .state('onboarding-details', {
      url: '/onboarding-details',
      templateUrl: 'modules/onboarding/views/onboarding-details.client.view.html',
      controller: 'OnboardingDetailsController',
      controllerAs: 'vm'
    })
    $stateProvider
      .state('onboarding-tutorial', {
        url: '/onboarding-tutorial',
        templateUrl: 'modules/onboarding/views/onboarding-tutorial.client.view.html',
        controller: 'OnboardingTutorialController',
        controllerAs: 'vm'
      });
}]);
angular.module('onboarding').run(['$rootScope', '$state', 'Authentication', '$window', function($rootScope, $state, Authentication, $window) {

	$rootScope.$on('$stateChangeStart', function(e, destination) {
		if(destination.data && destination.data.needAdmin === true && Authentication.user.roles[0].toLowerCase() !== 'admin') {
			// e.preventDefault();
			// $window.location.href = '#!/home';
			console.log('this should not be visible');
		}
	})

}])
