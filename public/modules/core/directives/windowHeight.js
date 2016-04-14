'use strict';

angular.module('core').directive('windowHeight', ['$window', 'deviceDetector', function($window, deviceDetector) {
    return function (scope, element, attrs) {
        //var w = angular.element($window);

        function getHeight() {
          if (self.innerWidth) {
            console.log('self', self.innerHeight);
            return self.innerHeight;
          }

          if (document.documentElement && document.documentElement.clientWidth) {
            console.log('ele', document.documentElement.clientHeight);
            return document.documentElement.clientHeight;
          }

          if (document.body) {
            console.log('body', document.body.clientHeight);
            return document.body.clientHeight;
          }
        }


        if(!deviceDetector.isMobile()) {
          $window.addEventListener('resize', function () {
            element.css('height', getHeight() + 'px');
          });
        }

        if(deviceDetector.isMobile() && deviceDetector.browser === 'safari') {
          element.css('height', getHeight() + 60 + 'px');
        } else {
          element.css('height', getHeight() + 'px');
        }

    };
}]);
