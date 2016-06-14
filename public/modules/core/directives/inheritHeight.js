'use strict';

angular.module('core').directive('inheritHeight', ['$window', '$timeout', 'deviceDetector', function($window, $timeout, deviceDetector) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {

        scope.$watch("status.loading", function(newV, oldV) {
          $timeout(function () {
            elm.css('height', elm[0].querySelector('.letter-step.ng-enter').offsetHeight + 'px');
          });
        });

      }
    };
}]);
