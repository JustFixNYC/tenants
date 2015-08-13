'use strict';

angular.module('core').directive('aboveFold', function($window) {
    return function (scope, element, attrs) {
        var w = angular.element($window);
        element.css('height', w.height() * 0.6 + 'px');
        //console.log($window.screen);
    };
});