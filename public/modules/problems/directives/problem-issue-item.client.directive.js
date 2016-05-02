'use strict';

angular.module('onboarding').directive('problemIssueItem', [function(){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

    	if(scope.$parent.checkString) {
    		if(scope.$parent.checkString.indexOf(attrs.issue) > -1){
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

			// This controls this problem's Other issue
    	scope.other = {
				key: 'other',
				value: '',
  			emergency: false
    	}

			scope.toggleOther = function() {
				// Show/hide
				scope.addMore = !scope.addMore;
        
        // targeted copy of jumpTo.js in core directives (need to target element, not $document)
        var someElement = angular.element(document.getElementById('other-block'));
        var parentModal = angular.element(document.getElementsByClassName('selection-module')[0]);
        parentModal.scrollToElement(someElement, 0, 800);

			}

			scope.removeIssue = function(issue) {
				element.removeClass('active');
				scope.$parent.tempIssues.map(function(curr, idx, arr){
					if(curr.key == issue.key) {
						arr.splice(idx, 1);
					}
				});
			};
    }
  };

}]);