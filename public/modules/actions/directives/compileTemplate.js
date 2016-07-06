'use strict';

// allow contents of tak action cards to include directives, functions, etc
// see http://stackoverflow.com/questions/20297638/call-function-inside-sce-trustashtml-string-in-angular-js

angular.module('actions').directive('compileTemplate', function($compile, $parse, $sce){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            var getStringValue = function() { return (parsed(scope) || '').toString(); }
            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
});
