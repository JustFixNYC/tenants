'use strict';

angular.module('core').directive('variableHeight', ['$document', '$timeout', function($document, $timeout) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var parent = $attrs.variableHeight;
        var parentElm = document.getElementById(parent);

        $scope.$watch(function() {
          angular.element(parentElm).css('height', $element[0].offsetHeight + 'px');
        });
    }
  };
}]);
