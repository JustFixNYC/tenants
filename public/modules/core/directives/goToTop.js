'use strict';

angular.module('core').directive('goToTop', function($document) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.bind("click", function () {

                // Maybe abstract this out in an animation service:
                // Ofcourse you can replace all this with the jQ 
                // syntax you have above if you are using jQ
                function scrollToTop(element, to, duration) {
                    if (duration < 0) return;
                    var difference = to - element.scrollTop;
                    var perTick = difference / duration * 10;

                    setTimeout(function () {
                        element.scrollTop = element.scrollTop + perTick;
                        scrollToTop(element, to, duration - 10);
                    }, 10);
                }

                // then just add dependency and call it
                scrollToTop($document[0].body, 0, 200);
            });
        }
    };
});