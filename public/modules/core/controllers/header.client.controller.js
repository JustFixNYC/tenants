'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$window', 'Authentication',
  function($scope, $window, Authentication) {

      $scope.authentication = Authentication;
      $scope.window = $window;

      // Collapsing the menu after navigation
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.state = toState.name;
        $scope.left = false;
        $scope.lightBG = false;
        switch(toState.name) {
          case 'landing':
            $scope.left = true;
            break;
          case 'manifesto':
            $scope.left = true;
            $scope.lightBG = true;
            break;
          default:
            break;
        };

        $scope.showBack = true;
        if(toState.data && toState.data.disableBack) $scope.showBack = false;


      });



      // var wrapper = $document[0].getElementById('header-wrapper');
      // scope.$watch(Authentication, function () {
      //   console.log('auth');
      //   if(!Authentication.user) angular.element(wrapper).css('margin-bottom', '0');
      //   else angular.element(wrapper).css('margin-bottom', '15px');
      // });

  }
]);
