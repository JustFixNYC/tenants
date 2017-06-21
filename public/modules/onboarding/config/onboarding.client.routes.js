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
        abstract: true,
        resolve: {
          advocateData: ['$location', '$rootScope', '$q', 'Advocates', function($location, $rootScope, $q, Advocates) {

            // this is ONLY for the advocate code included in the query string
            var deferred = $q.defer();



            if(!$location.search().q) {
              // this should be typical
              deferred.resolve({});
            } else {

              Advocates.validateNewUser({ code: $location.search().q },
                function(success) {
                  // ensure that only valid adv codes are sent to the referral page
                  if(success.advocate) {
                    deferred.resolve(success);
                  } else {
                    $rootScope.clearQueryString = true;
                    $location.search('q', null);
                    deferred.reject('Not a valid advocate code.');
                  }

                },
                function(error) {
                  $rootScope.clearQueryString = true;
                  $location.search('q', null);
                  deferred.reject(error);
                });
            }

            return deferred.promise;
          }]
        }
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
        data: {
          disableBack: true
        }
      })
      .state('onboarding.scheduleNew', {
        url: '/consultation/new',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule.client.view.html'
      })
      .state('onboarding.referral', {
        url: '/referral',
        templateUrl: 'modules/onboarding/partials/onboarding-referral.client.view.html',
        onboarding: true,
        data: {
          disableBack: true
        }
      });

}]);
