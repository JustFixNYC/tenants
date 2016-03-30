'use strict';

angular.module('onboarding').directive('selectionList', function selectionList(/*Example: $state, $window */) {
  return {
    templateUrl: 'modules/onboarding/partials/selection-list.client.view.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
    	var aTags = element.find('a');
    	console.log(aTags.length); 

    	for (var i = 0; i < aTags.length; i++) {

    		aTags[i].addEventListener('click', function(e){
    			console.log(e);
    			// IDK if this works across the board...
    			e.preventDefault();
    		});
    	}
    }
  };
});
