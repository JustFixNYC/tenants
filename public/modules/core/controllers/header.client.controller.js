'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$state', '$scope', '$window', 'Authentication',
  function($rootScope, $state, $scope, $window, Authentication) {

      $scope.authentication = Authentication;
      $scope.window = $window;

      // Collapsing the menu after navigation
      $rootScope.$on('$stateChangeSucess', function(event, toState, toParams, fromState, fromParams) {

        // moved to application.js to ensure it runs on pageload...
        // setHeaderState(toState.name);

        if(Authentication.user) {
          $rootScope.showBack = true;
          if(toState.data && toState.data.disableBack) {
            $rootScope.showBack = false;
          }
        } else {
          $rootScope.showBack = false;
        }

      });

      // console.log('state current name is:', $state.current.name);
      //
      // var setHeaderState = function(name) {
      //   switch(name) {
      //     case 'landing':
      //       console.log('case landing');
      //       $rootScope.headerLeft = true;
      //       $rootScope.headerLightBG = false;
      //       break;
      //     case 'manifesto':
      //       console.log('case manifesto');
      //       $rootScope.headerLeft = true;
      //       $rootScope.headerLightBG = true;
      //       break;
      //     default:
      //       console.log('case duh');
      //       $rootScope.headerLeft = false;
      //       $rootScope.headerLightBG = false;
      //       break;
      //   };
      // };

  }
]);
