'use strict';

angular.module('core').directive('fullBg', function($window) {
    return function (scope, element, attrs) {

      function getWidth() {
        if (self.innerHeight) {
          return self.innerWidth;
        }

        if (document.documentElement && document.documentElement.clientHeight) {
          return document.documentElement.clientWidth;
        }

        if (document.body) {
          return document.body.clientWidth;
        }
      }

      $window.addEventListener('resize', function () {
        element.css('width', getWidth() + 'px');
      });
    };
});