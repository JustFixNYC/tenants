'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$window', 'Authentication',
  function($rootScope, $scope, $window, Authentication) {

      $scope.authentication = Authentication;
      $scope.window = $window;

      // Collapsing the menu after navigation
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        switch(toState.name) {
          case 'landing':
            $rootScope.headerLeft = true;
            $rootScope.headerLightBG = false;
            break;
          case 'manifesto':
            $rootScope.headerLeft = true;
            $rootScope.headerLightBG = true;
            break;
          default:
            $rootScope.headerLeft = false;
            $rootScope.headerLightBG = false;
            break;
        };

        $rootScope.showBack = true;
        if(toState.data && toState.data.disableBack) $rootScope.showBack = false;
      });

      // $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      //   console.log(toState.name);
      //   $scope.state = toState.name;
      //   $scope.left = false;
      //   $scope.lightBG = false;
      //   switch(toState.name) {
      //     case 'landing':
      //       $scope.left = true;
      //       break;
      //     case 'manifesto':
      //       $scope.left = true;
      //       $scope.lightBG = true;
      //       break;
      //     default:
      //       break;
      //   };

      //   $scope.showBack = true;
      //   if(toState.data && toState.data.disableBack) $scope.showBack = false;
      //
      //
      // });



      // var wrapper = $document[0].getElementById('header-wrapper');
      // scope.$watch(Authentication, function () {
      //   console.log('auth');
      //   if(!Authentication.user) angular.element(wrapper).css('margin-bottom', '0');
      //   else angular.element(wrapper).css('margin-bottom', '15px');
      // });

  }
]);
