'use strict';

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems', '$modal',
  function(Authentication, Problems, $modal, $translate) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {

					// problemAssembler, if we don't have the problem set we just clear it out here
					var newProblem = function(problem) {

						var newProb = {};

				   	newProb.key = problem.key;
				    newProb.title = problem.title;
				    newProb.icon = problem.icon;
				    newProb.issues = [];
				    newProb.photos = [];

				    return newProb;
					};


          // this is a reference to whichever user we're working with, i.e.
          // scope.newUser or Authentication.user
          // scope.ourUser;

          // user exists
          if(!Authentication.user) {
            // This needs to be tested to see if it actually... works...
            scope.ourUser = scope.newUser;
          } else {
            scope.ourUser = Authentication.user;
          }

          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;

            // initialize numChecked
            scope.ourUser.problems.forEach(function (userProb) {

              var prob = scope.problems.getByKey(userProb.key);

              prob.numChecked = userProb.issues.length;

              userProb.issues.forEach(function (i) {
                if(!prob.issues.containsByKey(i.key)) {
                  prob.issues.push(i);
                }
              });
            });


          });


          scope.hasChangedProblems = false;

          // modal opening/closing
          // passing scopes
					scope.open = function(problem) {

						scope.currentProblem = problem;

            // this will get ourUsers problems, or create a new skeleton
            // ourUserCurrentProblem is another reference to this object,
            // so changing it will change ourUser.problems[problem.key]
            // this would be sooo much easier if we were using ES6
            if(!scope.ourUser.problems.containsByKey(problem.key)) {
              scope.ourUser.problems.push(newProblem(problem));
            }

            var ourUserCurrentProblem = scope.ourUser.problems.getByKey(problem.key);
            var numIssuesOnModalOpen = ourUserCurrentProblem.issues.length;

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
              scope: scope,
              backdrop: 'static',
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

				   	modalInstance.result.then(function() {

              // in order to display on the grid icons
              scope.currentProblem.numChecked = ourUserCurrentProblem.issues.length;

              // check if anything has changed...
              if(numIssuesOnModalOpen != ourUserCurrentProblem.issues.length) {
                scope.hasChangedProblems = true;
              }

              // check if the modal was closed and no issues were selectedIssues
              // if so, remove from ourUser.problems
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }

            // modal was cancelled/dismissed
				   	}, function () {

              // this means a newProblem was created (see line 77)
              // but never actually used
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }
            });

					};




      }
    };
}]);
