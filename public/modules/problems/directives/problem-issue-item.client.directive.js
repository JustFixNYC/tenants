'use strict';

angular.module('onboarding').directive('problemIssueItem', [function(){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

			// Selection of issue
			scope.selectIssue = function(issue){

				if(issue.active === true) {
					scope.removeIssue(issue);
					return;
				}

				issue.active = true;
				scope.$parent.selectedIssues.push(issue);
			};

			// This controls this problem's Other issue
			scope.toggleOther = function() {
				// Show/hide
				scope.addMore = !scope.addMore;

			}

			scope.removeIssue = function(issue) {
				issue.active = false;
				scope.$parent.selectedIssues.map(function(curr, idx, arr){
					if(curr.key == issue.key) {
						arr.slice(idx, 1);
					}
				});
			};
    }
  };

}]);