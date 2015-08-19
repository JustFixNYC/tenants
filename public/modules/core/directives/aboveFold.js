'use strict';

angular.module('core').directive('aboveFold', function($window) {
    return function (scope, element, attrs) {
        var w = angular.element($window);

        function getHeight() {
          if (self.innerWidth) {
            return self.innerHeight;
          }

          if (document.documentElement && document.documentElement.clientWidth) {
            return document.documentElement.clientHeight;
          }

          if (document.body) {
            return document.body.clientHeight;
          }
        }



        //element.css('height', getHeight() * 0.8 + 'px');
        element.css('height', getHeight() + 'px');
        //console.log($window.screen);
    };
});