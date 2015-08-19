'use strict';

angular.module('core').directive('propagateEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on('click', function (e) {
          console.log('propagate event');
          //attr.propagate(); 
        });
      }
    };
  });