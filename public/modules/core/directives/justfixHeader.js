'use strict';

angular.module('core').directive('justfixHeader', function($document, $window, $timeout, Authentication) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      scope.authentication = Authentication;
      scope.isCollapsed = false;
      //$scope.menu = Menus.getMenu('topbar');

      scope.toggleCollapsibleMenu = function() {
        scope.isCollapsed = !scope.isCollapsed;
      };

      // Collapsing the menu after navigation
      scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        scope.left = false;
        scope.lightBG = false;
        switch(toState.name) {
          case 'landing':
            scope.left = true;
            break;
          case 'manifesto':
            scope.left = true;
            scope.lightBG = true;
            break;
          default:
            break;
        };
      });

      // var wrapper = $document[0].getElementById('header-wrapper');
      // scope.$watch(Authentication, function () {
      //   console.log('auth');
      //   if(!Authentication.user) angular.element(wrapper).css('margin-bottom', '0');
      //   else angular.element(wrapper).css('margin-bottom', '15px');
      // });

    }
  };
});
