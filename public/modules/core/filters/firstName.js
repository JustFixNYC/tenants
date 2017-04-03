'use strict';

angular.module('core').filter('firstname', function() {
    return function (input) {
    	if(input) {
	      return input.split(' ')[0];    		
    	}
    	else {
    		return input;
    	}
    }
});
