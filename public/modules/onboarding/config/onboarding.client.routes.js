'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', function(){

	// Onboarding state routing
  $stateProvider
    .state('onboarding', {
      url: '/onboarding',
      templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
      controller: 'OnboardingController',
      controllerAs: 'vm'
    })
    .state('onboarding-create', {
      url: '/onboarding-admin',
      templateUrl: 'modules/onboarding/views/onboarding-create.client.view.html',
      controller: 'OnboardingCreateController',
      controllerAs: 'vm',
      data: {
      	needAdmin: true
      }
    })
    .state('selection', {
      url: '/onboarding-selection',
      templateUrl: 'modules/onboarding/views/onboarding-selection.client.view.html',
      controller: 'OnboardingSelectionController',
      controllerAs: 'vm'
    })
    .state('onboarding-problems', {
      url: '/onboarding-problems',
      templateUrl: 'modules/onboarding/views/onboarding-problems.client.view.html',
      controller: 'OnboardingProblemsController',
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
