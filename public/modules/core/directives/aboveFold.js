'use strict';

angular.module('core').directive('aboveFold', ['$window', 'deviceDetector', function($window, deviceDetector) {
    return function (scope, element, attrs) {
        //var w = angular.element($window);

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


        if(!deviceDetector.isMobile()) {
          $window.addEventListener('resize', function () {
            element.css('height', getHeight() + 'px');
          });         
        }
        element.css('height', getHeight() + 'px');

        //console.log($window.screen);
    };
}]);