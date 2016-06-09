'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window',
  function (deviceDetector, $window) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        if(!deviceDetector.isDesktop()) {
          element.css("display", "none");
        } else {
          element.addClass("print-button");
        }


        element.on('click', function (event) {
          $window.print();
        });


      }
    };

  }]);
