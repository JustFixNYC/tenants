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
				scope.addMore = !scope.addMore;
				
				var helperCreateOtherIssue = function() {
					return scope.tempProblems[0].issues.push({
						key: 'other',
						value: element.find('textarea').val(),
						emergency: false
					});
				}

				// No issues? Make sure we have an actual other issue value and push it in
				if(scope.tempProblems[0].issues.length === 0 && element.find('textarea').val()) {
					helperCreateOtherIssue();
				}

				scope.tempProblems[0].issues.map(function(val, idx, arr) {

					if(val.key === 'other') {

						val.value = element.find('textarea').val();

					} else if (idx === scope.tempProblems[0].issues.length - 1) {
						helperCreateOtherIssue();
					}
				});
			}

			scope.removeIssue = function(problem, issue) {

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

				user.problems.map(function(val, idx, arr){
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