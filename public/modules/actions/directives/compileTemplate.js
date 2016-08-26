'use strict';

// allow contents of tak action cards to include directives, functions, etc
// see http://stackoverflow.com/questions/20297638/call-function-inside-sce-trustashtml-string-in-angular-js
// TODO: this is used all over the place, move it into /core module?

angular.module('actions').directive('compileTemplate', ['$compile', '$parse', '$sce', '$translate',
	function($compile, $parse, $sce, $translate){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            
            var getStringValue = function() { return (parsed(scope) || '').toString(); }
            //Recompile if the template changes
            scope.$watch(getStringValue, function(val) {
            	// Check if our translation service has failed
            	if(val.indexOf('modules') !== -1) {
            		$translate(val).then(function(newVal){
	            		element.html(newVal);
	            		$compile(element, null, -9999)(scope);	
            		});
            	} else {
            		element.html(val);
	              $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            	}
          	});
        }
    }
	}
]);
