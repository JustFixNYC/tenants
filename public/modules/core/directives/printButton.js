'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window', '$timeout', '$rootScope',
  function (deviceDetector, $window, $timeout, $rootScope) {
    return {
      restrict: 'A',
      scope: {
        userId: '='
      },
      link: function (scope, element, attrs) {
      	var printPg;

      	// Set up our button state as soon as we init
        if(!deviceDetector.isDesktop()) {
          element.css("display", "none");
        } else {
          element.addClass("print-button");
          element.addClass('disabled');
        }

        // Helper function for checking if printPg is loaded
        var checkLoaded = function(){
	        // need to access scope INSIDE the iframe, so we can trust angular to tell us when we're fully loaded instead of parent JS
        	var printView = printPg.contentWindow.angular.element(printPg.contentWindow.document.querySelector('#print-view'));

        	// Smol bug: sometimes, printView returns an empty instance, so we need to check to make sure angular is inited correctly
        	if(!printView.scope()) {
        		return $timeout(function(){
        			// Recusive functions FTW
	        		checkLoaded();
        		}, 500);
        	}
        	var printableLoaded = printView.scope().printable;

        	// Check if the content is actually loaded (dependent on child controller, in /activity/controllers/print.controller)
        	if(!printableLoaded) {
        		return $timeout(function(){
	        		checkLoaded();
        		}, 500);
        	} else {

        		// If we are loaded, let this button be free!
	        	element.removeClass('disabled');

		        element.on('click', function (event) {
					    window.frames['print-frame'].print();
		        });

        	}
        };

        var iframe = document.getElementById('print-frame');
        var queryKey = '';
        if(scope.userId) {
        	queryKey = scope.userId;
        }

        if (iframe) {
        	// If we're returning here, reload iFrame and begin checking when loaded
        	printPg = iframe;
        	printPg.src = '/print/' + queryKey;
        	printPg.contentWindow.location.reload(); // just reload w/ new SRC
        } else {
        	// init new print instance
	        printPg = document.createElement('iframe');
	        printPg.src = '/print/' + queryKey;
	        printPg.width = 700;
	        printPg.height = 0;
	        printPg.setAttribute('id', 'print-frame');
	        printPg.name = 'print-frame';
	        document.body.appendChild(printPg);
        }

        // Listen for when iFrame is loaded if the first time (safety measure so we KNOW the following will init printView var correctly)
        printPg.onload = function() {
	        checkLoaded();
        };


      }
    };

  }]);
