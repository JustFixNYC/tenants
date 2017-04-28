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
        data: {
          disableBack: true
        }
      })
    //kiran changes
      .state('onboarding.referral', {
        url: '/referral',
        templateUrl: 'modules/onboarding/partials/onboarding-referral.client.view.html',
        onboarding: true,
        data: {
          disableBack: true
        },
        resolve: {
          advocate: ['$location', 'AdvocatesResource', function($location, AdvocatesResource) {

            var advocateQueryString = $location.search().q;
            //alert(advocateQueryString);
            console.log(advocateQueryString);

            var referral = new AdvocatesResource();
            referral.$validateNewUser({ code: advocateQueryString },
              function(success) {
                // return advocate data
                  if(success.advocate) {
                          $scope.accessCode.valid = $rootScope.validated = true;
                          $scope.accessCode.valueEntered = $scope.accessCode.value;
                            $scope.newUser.advocate = success.advocate;
                            $scope.newUser.advocateRole = success.advocateRole;
                          $scope.referral = success.referral;
                            $scope.newUser.sharing.enabled = true;
                            //$location.path('/onboarding/success');
                            $scope.codeError = false;
                            $scope.codeWrong = false;
                        } else {
                          $scope.codeError = false;
                          $scope.codeWrong = true;
                    }
                return success;
              },
              function(error) {
                // redirect to the main landing page
                $location.path('/signup');
            
              })


          }]
        }
      })
      //kiran changes
      .state('onboarding.scheduleNew', {
        url: '/consultation/new',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule.client.view.html'
      });

}]);
