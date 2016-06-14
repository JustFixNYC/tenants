'use strict';

angular.module('core').directive('jumpTo', ['$document', function($document) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var id = $attrs.jumpTo;
        var duration = 1000; //milliseconds
        var easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }; //easeInOutCubic
        var offset = 0; //pixels; adjust for floating menu, context etc

        //Scroll to #some-id with 30 px "padding"
        //Note: Use this in a directive, not with document.getElementById 
        var someElement = angular.element(document.getElementById(id));

        $element.bind('click', function(e) {
          $document.scrollToElement(someElement, offset, duration, easing);
        });
    }
  };
}]);