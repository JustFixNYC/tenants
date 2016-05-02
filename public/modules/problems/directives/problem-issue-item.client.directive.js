'use strict';

angular.module('onboarding').directive('problemIssueItem', [function(){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

    	// Our parent's checkString, and whether to make these active
    	if(scope.checkString) {
    		if(scope.checkString.indexOf(attrs.issue) > -1){
    			element.addClass('active');
    		}
    	}

			// Selection of issue
			scope.selectIssue = function(issue){

				if(element.hasClass('active') === true) {
					scope.removeIssue(issue);
					return;
				}

				element.addClass('active');
				scope.$parent.tempIssues.push(issue);
			};

			scope.toggleOther = function() {
				// Show/hide
				scope.addMore = !scope.addMore;

				// Our parent Modal Controller could contain the other issue -- if not, we can create it here (gets passed up into the modal save controller)
	    	scope.other = scope.other || {
					key: 'other',
					value: '',
	  			emergency: false 
	    	};
        
        // A not great copy of jumpTo.js in core directives (need to target element, not $document), willing to reassess
        var someElement = angular.element(document.getElementById('other-block'));
        var parentModal = angular.element(document.getElementsByClassName('selection-module')[0]);
        parentModal.scrollToElement(someElement, 0, 800);

			}

			scope.removeIssue = function(issue) {
				// UI update, then remove this issue from our temporary issues
				element.removeClass('active');
				scope.tempIssues.map(function(curr, idx, arr){
					if(curr.key == issue.key) {
						arr.splice(idx, 1);
					}
				});
			};
    }
  };

}]);