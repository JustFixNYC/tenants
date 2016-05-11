'use strict';

// lets make our lives easier!
// theres probably a better place to put these...
Array.prototype.containsByKey = Array.prototype.containsByKey || function(key) {
  var i, l = this.length;
  for (i = 0; i < l; i++) if (this[i].key == key) return true;
  return false;
};

Array.prototype.getByKey = Array.prototype.getByKey || function(key) {
  var i, l = this.length;
  for (i = 0; i < l; i++) if (this[i].key == key) return this[i];
  return null;
};

Array.prototype.removeByKey = Array.prototype.removeByKey || function(key) {
  var i, l = this.length;
  for (i = l-1; i >= 0; i--) if (this[i].key == key) this.splice(i,1);
  return;
};

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems', '$modal',
  function(Authentication, Problems, $modal) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {

          // displaying the state for problems can be handled by something like
          // ourUser.problems[problem].length
					// var problemsActiveString = '';

					// problemAssembler, if we don't have the problem set we just clear it out here
					var newProblem = function(problem) {

						var newProb = {};

						newProb.startDate = new Date();
				    newProb.createdDate = new Date();
				   	newProb.key = problem.key;
				    newProb.title = problem.title;
				    newProb.icon = problem.icon;
				    newProb.description = '';
				    newProb.issues = [];
				    newProb.photos = [];
				    newProb.relatedActivities = [];

				    return newProb;
					}


          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;
            // Set state if problems exist (NOT ACTIVE ON BOARDING)

            // you can just use the length of ourUser.problems (see above)
            // scope.problems.map(function(curr, idx, arr){
            // 	if(problemsActiveString.indexOf(curr.key) > -1){
            // 		curr.active = true;
            // 	}
            // });
          });


          // // inherit newUser.problems or user.problems
          // if(attrs.onboarding === 'true') {
          // 	// Needs to not reset if landing on this page
          // 	var ourUserProblems = scope.newUser.problems = [];
          // } else {
          // 	// This needs to be tested to see if it actually... works...
          // 	var ourUserProblems = Authentication.user.problems;
          // 	for(var i = 0; i < ourUserProblems.length; i++){
          // 		problemsActiveString += ourUserProblems[i].key;
          // 	}
          // }

          // this is a reference to whichever user we're working with, i.e.
          // scope.newUser or Authentication.user
          scope.ourUser;

          // user exists
          if(!Authentication.user) {
            // This needs to be tested to see if it actually... works...
            scope.ourUser = scope.newUser;
          } else {
            scope.ourUser = Authentication.user;
          }

          // just referring to this as scope.ourUser.problems
          // var ourUserProblems = scope.ourUser.problems;

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

						// // check if user has already filled out the CURRENT problem, set it, and remove it from ALL problems
						// ourUserProblems.map(function(curr, idx, arr){
						// 	if(curr.key == problem.key) {
						// 		ourUserCurrentProblem = curr;
						// 		arr.splice(idx, 1);
						// 	}
						// });
            //
						// // If the user didn't set the CURRENT problem, build new one
						// if(!ourUserCurrentProblem) {
						// 	ourUserCurrentProblem = newProblem(problem);
						// }
						// console.log(ourUserCurrentProblem);

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
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

				   	modalInstance.result.then(function(){

              scope.currentProblem.numChecked = ourUserCurrentProblem.issues.length;

              // check if the modal was closed and no issues were selectedIssues
              // if so, remove from ourUser.problems
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }

              // lectedIssues){
              // f we got updates as set by the modal controller, our CURRENT problem should be updated accordingly
              // serCurrentProblem.issues = selectedIssues;
              // e pass the CURRENT problem into ALL problems -- no duplates, as we either created this issue brand new or deleted it from the original object
              // e.ourUser.problems.push(ourUserCurrentProblem);
              //
              // X active state handle
              //   // see above comments about state
              //   // ectedIssues.length == 0) {
              //   // .currentProblem.active = false;
              //   //  {
              //   // .currentProblem.active = true;
              //   //
              // e {
              // emember when we removed the original problem? This should attach it back into our object
              // urUserCurrentProblem.issues.length > 0) {
              // pe.ourUser.problems.push(ourUserCurrentProblem);
              //
              // rn;
              //

              // Reset current and global user
              // ourUserCurrentProblem = undefined;
				   	});

					};




      }
    };
}]);
