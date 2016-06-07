'use strict';

angular.module('core').directive('bottomOnClick', ['$document', '$timeout', function($document, $timeout) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var parent = $attrs.bottomOnClick;
        var parentElm = document.getElementById(parent);

        $element.bind('click', function(e) {
          $timeout(function() {
            parentElm.scrollTop = parentElm.scrollHeight;
          }, 0);
        });
    }
  };
}]);
