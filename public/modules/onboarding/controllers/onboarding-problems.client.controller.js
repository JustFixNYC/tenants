'use strict';

angular.module('onboarding').controller('OnboardingProblemsController', ['$scope', 'problemsService', '$modal', 'Authentication', '$location',
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
			console.log(arrayOfObjs[i]);
			
			keyString = keyString + ', ' + arrayOfObjs[i].key;

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

		// Well this backfired horrendously
		var stupidUserProblemTargetIdx = function() {
			for (var j = 0; j < user.problems.length; j++) {
				if(user.problems[j].key = problem.key) {
					return j;
				}
			}
		}

		// Well, never let it be said I tried
		if(user.problems.length){
			activeMapper(user.problems[stupidUserProblemTargetIdx()].issues, $scope.currentProblem.issues);
		}
		$scope.modalInstance = $modal.open({
      animation: 'true',
      templateUrl: 'modules/onboarding/partials/problem-modal.client.view.html',
      scope: $scope,
      size: 'md'
    });

    // Create a temporary user, if modal is opened (Cleared after modal is closed)
    $scope.modalInstance.opened.then(function(){
    	$scope.tempProblems.push(newProblem($scope.currentProblem));
    });
	};



	$scope.save = function (){

		if($scope.tempProblems.length === 0) {
			return;
		}

		if(user.problems.length) {
			user.problems.map(function(val, idx, arr){
				console.log(idx);
				if(val.key === $scope.tempProblems[0].key) {
					for (var i = 0; i < $scope.tempProblems[0].issues.length; i++){
						val.issues.push($scope.tempProblems[0].issues[i]);
					};
				} else if (idx === user.problems.length - 1) {
					user.problems.push($scope.tempProblems[0]);
				}
			});
		} else {
			user.problems.push($scope.tempProblems[0]);
		}
  	$scope.tempProblems = [];
		activeMapper(user.problems, $scope.problems);
  	$scope.modalInstance.dismiss('close');
	}

  $scope.close = function() {
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
