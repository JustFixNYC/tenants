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

					// problemAssembler, if we don't have the problem set we just clear it out here
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
          	// Needs to not reset if landing on this page
          	var ourUserProblems = scope.newUser.problems = [];
          } else {
          	// This needs to be tested to see if it actually... works...
          	var ourUserProblems = Authentication.user.problems;
          	for(var i = 0; i < ourUserProblems.length; i++){
          		problemsActiveString += ourUserProblems[i].key;
          	}
          }

          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;

            // Set state if problems exist (NOT ACTIVE ON BOARDING)
            scope.problems.map(function(curr, idx, arr){
            	if(problemsActiveString.indexOf(curr.key) > -1){
            		curr.active = true;
            	}
            });
          });

          // modal opening/closing
          // passing scopes
					scope.open = function(problem) {
				   	
						// Reset current and global user
				   	ourUserCurrentProblem = undefined;
						scope.currentProblem = problem;

						// check if user has already filled out the CURRENT problem, set it, and remove it from ALL problems
						ourUserProblems.map(function(curr, idx, arr){
							if(curr.key == problem.key) {
								ourUserCurrentProblem = curr;
								arr.splice(idx, 1);
							}
						});

						// If the user didn't set the CURRENT problem, build new one
						if(!ourUserCurrentProblem) {
							ourUserCurrentProblem = newProblem(problem);
						}
						console.log(ourUserCurrentProblem);

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
				      resolve: {
				      	// All issues straight from the json fetch
				      	issues: function() {
				      		return scope.currentProblem.issues;
				      	},
				      	// Our user's CURRENT problem, if we found one above
				      	userProblem: function() {
				      		return ourUserCurrentProblem;
				      	}
				      }
				    });

				   	modalInstance.result.then(function(selectedIssues){
				   		if(selectedIssues){
				   			// If we got updates as set by the modal controller, our CURRENT problem should be updated accordingly
				   			ourUserCurrentProblem.issues = selectedIssues;
				   			// We pass the CURRENT problem into ALL problems -- no duplates, as we either created this issue brand new or deleted it from the original object
				   			ourUserProblems.push(ourUserCurrentProblem);

				   			// UX active state handle
				   			if(selectedIssues.length == 0) {
				   				scope.currentProblem.active = false;
				   			} else {
				   				scope.currentProblem.active = true;
				   			}
				   		} else {
				   			// Remember when we removed the original problem? This should attach it back into our object
				   			if(ourUserCurrentProblem.issues.length > 0) {
				   				ourUserProblems.push(ourUserCurrentProblem);
				   			}
				   			return;
				   		}
				   	});
					};




      }
    };
}]);
