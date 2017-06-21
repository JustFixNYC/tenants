'use strict';

angular.module('core').directive('variableHeight', ['$document', '$timeout', function($document, $timeout) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var parent = $attrs.variableHeight;
        var parentElm = document.getElementById(parent);

        $scope.$watch(function() {
          angular.element(parentElm).css('height', $element[0].offsetHeight + 'px');
        });

        $scope.$parent.$watch("elemHasChanged", function (newVal, oldVal) {
          if(newVal) {
            angular.element(parentElm).css('height', $element[0].offsetHeight + 'px');
          }
        });


        // $scope.$watch(function () {
        //     return $element[0].offsetHeight;
        //   }, function (newVal, oldVal) {
        //     console.log(newVal, oldVal);
        //   });
    }
  };
}]);
