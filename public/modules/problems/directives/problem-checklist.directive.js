'use strict';

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems', '$modal',
  function(Authentication, Problems, $modal) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {
					var ourUserCurrentProblem;
					var problemsActiveString = '';

					// problemAssembler
					var newProblem = function(problem) {
						
						var newProb = {};

						newProb.startDate = new Date();
				    newProb.createdDate = new Date();
				   	newProb.key = problem.key;
				    newProb.title = problem.title;
				    newProb.description = '';
				    newProb.issues = [];
				    newProb.photos = [];
				    newProb.relatedActivities = [];

				    return newProb;
					} 


          // inherit newUser.problems or user.problems
          if(attrs.onboarding === 'true') {
          	// Can wrap this in a conditional, but I think I'm doing that too much...
          	var ourUserProblems = scope.$parent.newUser.problems = [];
          } else {
          	var ourUserProblems = Authentication.user.problems;
          	for(var i = 0; i < ourUserProblems.length; i++){
          		problemsActiveString += ourUserProblems[i].key;
          	}
          }

          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;

            // Active mapper helper
            scope.problems.map(function(curr, idx, arr){
            	if(problemActiveString.indexOf(curr.key)){
            		curr.active = true;
            	}
            });
          });

          // modal opening/closing
          // passing scopes
					scope.open = function(problem) {

						scope.currentProblem = problem;

						// check if user has already filled out THIS problem
						if(ourUserProblems !== []) {
							ourUserProblems.map(function(curr, idx, arr){
								if(curr.key == problem.key) {
									ourUserCurrentProblem = curr;
									arr.splice(idx, 1);
								}
							});
						}

						// If the user didn't set the current problem
						if(!ourUserCurrentProblem) {
							ourUserCurrentProblem = newProblem(problem);
						}

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
				      resolve: {
				      	issues: function() {
				      		return scope.currentProblem.issues;
				      	},
				      	userProblem: function() {
				      		return ourUserCurrentProblem;
				      	}
				      }
				    });

				   	modalInstance.result.then(function(selectedIssues){
				   		if(selectedIssues){
				   			ourUserCurrentProblem.issues = selectedIssues;
				   			ourUserProblems.push(ourUserCurrentProblem);
				   			scope.currentProblem.active = true;
				   		} else {
				   			// IDK if this will work lol
				   			if(ourUserCurrentProblem.issues.length == 0) {
				   				scope.currentProblem.active = false;
				   			}
				   		}
				   	});
					};




      }
    };
}]);
