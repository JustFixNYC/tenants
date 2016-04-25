'use strict';

angular.module('onboarding').directive('problemIssueItem', ['Authentication', function(Authentication){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

    	var user = Authentication.user;
    	
    	element.text(attrs.text);

			// Selection of issue
			scope.selectIssue = function(problem, issue){

				if(element.hasClass('active')) {
					scope.removeIssue(problem, issue);
					element.removeClass('active');
					return;
				}

				if(scope.tempProblems.length === 0) {

					element.addClass('active');
					scope.tempProblems.push(newProblem(problem, issue));
					return;

				}

				scope.tempProblems.map(function(val, idx, arr) {
					if(val.key === problem.key) {

						element.addClass('active');
						return val.issues.push(issue);
					}
				});
			};

			// This controls this problem's Other issue
			scope.toggleOther = function() {
				// Show/hide
				scope.addMore = !scope.addMore;

				// Boy oh boy this should be reconsidered
				if(!scope.other) {
					scope.other = {
						key: 'other',
						value: '',
						emergency: false
					};
				}

			}

			scope.removeIssue = function(problem, issue) {

				// Check if we've created problems module
				if(user.problems) {
					user.problems.map(function(val, idx, arr){
						if(val.key === problem.key) {
							val.issues.map(function(val2, idx2, arr2) {
								if(val2.key === issue.key) {
									return arr2.splice(idx2, 1);
								}
							});
						}
					});
				}

				// Ctrl C! Ctrl V! Think of better approach for this.
				scope.tempProblems.map(function(val, idx, arr){
					if(val.key === problem.key) {
						val.issues.map(function(val2, idx2, arr2) {
							if(val2.key === issue.key) {
								return arr2.splice(idx2, 1);
							}
						});
					}
				});
			};
    }
  };

}]);