'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window', '$timeout',
  function (deviceDetector, $window, $timeout) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        if(!deviceDetector.isDesktop()) {
          element.css("display", "none");
        } else {
          element.addClass("print-button");
          element.addClass('disabled');
        }

        var printPg = document.createElement('iframe');
        printPg.src = '/print';
        printPg.width = 700;
        printPg.height = 0;
        printPg.name = 'frame';
        document.body.appendChild(printPg);

        printPg.onload = function() {

        	element.removeClass('disabled');

	        element.on('click', function (event) {
				    window.frames['frame'].print();
	        });
        };


      }
    };

  }]);
