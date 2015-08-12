'use strict';

angular.module('core').directive('aboveFold', function($window) {
    return function (scope, element, attrs) {
        element.css('height', $window.outerHeight * 0.6 + 'px');
    };
});