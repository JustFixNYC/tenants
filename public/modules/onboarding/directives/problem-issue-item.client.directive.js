'use strict';

angular.module('onboarding').directive('problemIssueItem', ['$modal', 'Authentication', function($modal, Authentication){
  return {
    template: '',
    restrict: 'A',
    scope: false,
    link: function postLink(scope, element, attrs) {

    	user = Authentication.user;
    	element.text(attrs.text);
		
			// problemAssembler
			var newProblem = function(problem, issue) {
				
				var newProb = {};

				newProb.startDate = new Date();
		    newProb.createdDate = new Date();
		   	newProb.key = problem.key;
		    newProb.title = problem.title;
		    newProb.description = '';
		    newProb.photos = [];
		    newProb.relatedActivities = [];
		    newProb.issues = [issue];

		    return newProb;
			}

			// Selection of issue
			scope.selectIssue = function(problem, issue){

				if(element.hasClass('active')) {
					scope.removeIssue(problem, issue);
					element.removeClass('active');
					return;
				}

				if(user.problems.length === 0) {

					element.addClass('active');
					return user.problems.push(newProblem(problem, issue));
				}

				user.problems.map(function(val, idx, arr) {
					if(val.key === problem.key) {

						element.addClass('active');
						return val.issues.push(issue);
					}
				});
			};

			scope.removeIssue = function(problem, issue) {
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