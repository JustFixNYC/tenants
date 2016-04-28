'use strict';

angular.module('problems').controller('OnboardingProblemsController', ['$scope', 'problemsService', '$modal', 'Authentication', '$location',
	function($scope, problems, $modal, Authentication, $location) {

	var user = Authentication.user;
	$scope.problemArray = [];
	var currentDate = new Date();
  $scope.tempProblems = [];

	// Take array of Objs (should be user object, generally) and apply active state to another Object (scope)
	var activeMapper = function(arrayOfObjs, arrayToApplyActiveTo) {

		var keyString = '';

		if(!arrayOfObjs) {
			return;
		}

		for (var i = 0; i < arrayOfObjs.length; i++) {

			if(keyString === '') {
				keyString = arrayOfObjs[i].key
			} else {			
				keyString = keyString + ', ' + arrayOfObjs[i].key;
			}

		}

		// If nothing returned, just scrap it
		if(keyString !== ''){

			arrayToApplyActiveTo.map(function(curr, idx, arr) {

				if(keyString.indexOf(curr.key) >= 0){
					curr.active = true;
				};
			});
		}
	};



	// Given problem, get current problem from User Obj (if exists)
	// TODO: see if we can replace some of our PitA getUserProblem loops with this
	var currentProblemUserObj = function(problem) {

		for (var j = 0; j < user.problems.length; j++) {
			if(user.problems[j].key = problem.key) {
				return user.problems[j];
			}
		}
	}


		
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
    if(issue) {
   	  newProb.issues = [issue];
    } else {
    	newProb.issues = [];
    }

    return newProb;
	}

	// TODO: discuss bring user creation to global?
	if(user === '') {
		user = {};
		user.problems = [];
	}

	$scope.next = function() {
		$location.path('/onboarding-details');
	};
	$scope.back = function() {
		$location.path('/onboarding-selection');
	};

	// Modal Directive
	$scope.open = function(problem) {

		$scope.currentProblem = problem;
			
		$scope.other = {
			key: 'other',
			value: '',
			emergency: false	
		};

		// Well, never let it be said I tried
		if(user.problems.length){
			activeMapper(currentProblemUserObj(problem).issues, $scope.currentProblem.issues);
		}
		$scope.modalInstance = $modal.open({
      animation: 'true',
      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
      scope: $scope,
      size: 'md'
    });

		if(currentProblemUserObj(problem)) {
			var issuesForLoop = currentProblemUserObj(problem).issues;

			// Find our other option, put it into the scope, and remove it (We're saving it later if it exists!)
			for (var i = 0; i < issuesForLoop.length; i++) {
				if(issuesForLoop[i].key == "other") {
					$scope.other.value = issuesForLoop[i].value;

					issuesForLoop.splice(i, 1);
				} 
			}
		}

    // Create a temporary user, if modal is opened (Cleared after modal is closed)
    $scope.modalInstance.opened.then(function(){
    	$scope.tempProblems.push(newProblem($scope.currentProblem));
    });
	};



	$scope.save = function (){

		// Handle 'other' Issue
		if($scope.other.value !== ''){

			$scope.tempProblems[0].issues.push({
				key: 'other',
				value: $scope.other.value,
				emergency: false
			});
		}
		// if the user has problems already
		if(user.problems.length) {
			user.problems.map(function(val, idx, arr){

				// current user problem matches current temp problem? 
				if(val.key === $scope.tempProblems[0].key) {
					for (var i = 0; i < $scope.tempProblems[0].issues.length; i++){

						// Push issue into user problems array
						// TODO: check if issue exists in issues array (SHOULD NOT BE AN ISSUE: gets removed on click)
						val.issues.push($scope.tempProblems[0].issues[i]);
					};
				} else if (idx === user.problems.length - 1) {

					// If no matching problem, just push the new problem into the user problems array
					user.problems.push($scope.tempProblems[0]);
				}
			});
		} else {
			// No probems for the user? Just push the probem into the array
			user.problems.push($scope.tempProblems[0]);
		}

		// Clear temp issue, update view
  	$scope.tempProblems = [];
		activeMapper(user.problems, $scope.problems);
  	$scope.modalInstance.dismiss('close');
	}

  $scope.close = function() {
  	// Empty current object, do nothing else
  	$scope.tempProblems = [];
  	$scope.modalInstance.dismiss('close');
  }


	var allIssues = problems.localFile().then(function(response) {

		$scope.problems = response;

		activeMapper(user.problems, $scope.problems);


	}, function(err) {
		throw new Error('I\'m sorry, we\'re having trouble fetching the issues list. Please try again!');
	});

}]);
