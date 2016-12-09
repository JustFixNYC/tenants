'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window', '$timeout', '$rootScope',
  function (deviceDetector, $window, $timeout, $rootScope) {
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

        // Listen for when iFrame is loaded (safety measure so we KNOW the attached will load correctly)
        printPg.onload = function() {

	        // need to access scope INSIDE the iframe, so we can trust angular to tell us when we're fully loaded instead of parent JS
	        var printView = printPg.contentWindow.angular.element(printPg.contentWindow.document.querySelector('#print-view'));
	        console.log(printView);

	        var checkLoaded = function(){
	        	var printView = printPg.contentWindow.angular.element(printPg.contentWindow.document.querySelector('#print-view'));
	        	if(!printView.scope()) {
	        		return $timeout(function(){
	        			// Recusive functions FTW
		        		checkLoaded();
	        		}, 500);
	        	}
	        	var printableLoaded = printView.scope().printable;

	        	// Check if we're actually loaded
	        	if(!printableLoaded) {
	        		$timeout(function(){
	        			// Recusive functions FTW
		        		checkLoaded();
	        		}, 500);
	        	} else {
	        		// If we are loaded, let this button be free! 
		        	element.removeClass('disabled');

			        element.on('click', function (event) {
						    window.frames['frame'].print();
			        });

	        	}
	        };

	        checkLoaded();

        };


      }
    };

  }]);
