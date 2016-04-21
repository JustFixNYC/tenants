'use strict';

angular.module('onboarding').directive('selectionList', function selectionList(/*Example: $state, $window */) {
  return {
    templateUrl: 'modules/onboarding/partials/selection-list.client.view.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
    	var aTags = element.find('a');
    	var wrappedTags = [];

    	var activateThis = function() {
    		this.on('click', function(e) {
    			var thisWrapped = angular.element(this);
	    		for (var i = 0; i < wrappedTags.length; i++) {
	    			wrappedTags[i].removeClass('active');
	    		}
	  			thisWrapped.addClass('active');
	  			scope.process = this.getAttribute('process');
	  			console.log(scope);
    		});
    	};

    	for (var i = 0; i < aTags.length; i++) {
    		var elm = angular.element(aTags[i]);
    		activateThis.call(elm);
    		wrappedTags.push(elm);
    	}
    }
  };
});
