'use strict';

angular.module('core')
  .directive('mobileDatePlaceholder', ['deviceDetector', function (deviceDetector) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, elm, attrs) {

        if(deviceDetector.isMobile() || deviceDetector.isTablet()) {
          elm.addClass('date-mobile');
        }

        scope.$watch(attrs.ngModel, function (v) {
          if(v) {
            elm.removeClass('date-mobile');
          }
        });



      }
    };

  }]);
