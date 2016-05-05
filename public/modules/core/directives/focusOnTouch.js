'use strict';

/**
 *  BEWARE dragons: https://github.com/angular-ui/bootstrap/issues/2280
 *                  https://github.com/angular-ui/bootstrap/issues/2017
 *
 */

angular.module('core')
.directive('focusOnTouch', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on('touchstart', function (e) {
        element.focus();
        e.preventDefault();
        e.stopPropagation();
      });
    }
  };
})
.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on(attr.stopEvent, function (e) {
        e.stopPropagation();
      });
    }
  };
});
