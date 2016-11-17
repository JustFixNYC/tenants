'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window', '$http',
  function (deviceDetector, $window, $http) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        if(!deviceDetector.isDesktop()) {
          element.css("display", "none");
        } else {
          element.addClass("print-button");
        }

        var printPg = document.createElement('iframe');
        printPg.src = '/print';
        printPg.width = 700;
        printPg.height = 100;
        printPg.name = 'frame';
        document.body.appendChild(printPg);

        printPg.onload = function() {

	        element.on('click', function (event) {
				    window.frames['frame'].print();
	        });
        };


      }
    };

  }]);
