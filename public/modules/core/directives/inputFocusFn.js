'use strict';

angular.module('core').directive('inputFocusFn', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        scope.$parent[attr.inputFocusFn] = function () {
          $timeout(function () {
            element[0].focus();
          });
        };
      }
    };
  }]);
