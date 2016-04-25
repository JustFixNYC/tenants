'use strict';

angular.module('onboarding').directive('problemIssueItem', ['Authentication', function(Authentication){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

    	var user = Authentication.user;

			// Selection of issue
			scope.selectIssue = function(problem, issue){

				if(issue.active === true) {
					scope.removeIssue(problem, issue);
					element.removeClass('active');
					return;
				}

				if(scope.tempProblems.length === 0) {
					scope.tempProblems.push(newProblem(problem, issue));
					return;
				}

				issue.active = true;
				scope.tempProblems[0].issues.push(issue);
				console.log(scope.tempProblems);
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

    			console.log(scope);
				} else {
					console.log(scope.other);
				}

			}

			scope.removeIssue = function(problem, issue) {

				// Check if we've created problems module
				if(user.problems) {
					console.log('problem exists');
					user.problems.map(function(val, idx, arr){
						if(val.key === problem.key) {
							val.issues.map(function(val2, idx2, arr2) {
								if(val2.key === issue.key) {
									issue.active = false;
									return arr2.splice(idx2, 1);
								}
							});
						}
					});
				}

				// Ctrl C! Ctrl V! Think of better approach for this.
				scope.tempProblems.map(function(val, idx, arr){
					console.log('problem doesnot exist');
					if(val.key === problem.key) {
						val.issues.map(function(val2, idx2, arr2) {
							if(val2.key === issue.key) {
								issue.active = false;
								arr2.splice(idx2, 1);
							}
						});
					}
				});
			};
    }
  };

}]);