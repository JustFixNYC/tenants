'use strict';

angular.module('core').directive('fullBg', function($window) {
    return function (scope, element, attrs) {
        element.css('width', $window.outerWidth + 'px');
    };
});