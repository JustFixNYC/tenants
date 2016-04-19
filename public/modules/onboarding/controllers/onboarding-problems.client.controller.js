'use strict';

angular.module('onboarding').controller('OnboardingProblemsController', ['$scope', 'problemsService', '$modal', 'Authentication', '$location',
	function($scope, problems, $modal, Authentication, $location) {

	var user = Authentication.user;
	$scope.problemArray = [];
	var currentDate = new Date();

	// Take array of Objs (should be user object, generally) and apply active state to another Object (scope)
	var activeMapper = function(arrayOfObjs, arrayToApplyActiveTo) {

		var keyString = '';

		if(!arrayOfObjs) {
			return;
		}

		for (var i = 0; i < arrayOfObjs.length; i++) {
			
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
		if(user.problems){
			activeMapper(user.problems[stupidUserProblemTargetIdx()].issues, $scope.currentProblem.issues);
		}
		var modalInstance = $modal.open({
      animation: 'true',
      templateUrl: 'modules/onboarding/partials/problem-modal.client.view.html',
      scope: $scope,
      size: 'lg'
    });
	};


	var allIssues = problems.localFile().then(function(response) {

		$scope.problems = response;

		// WHELP, this is a version of testing, right?
		/*if(user.problems.length === 0) {
			var demoSave = {
				startDate: currentDate,
		    createdDate: currentDate,
		    key: 'kitchen',
		    title: 'kitchen',
		    description: '',
		    photos: [],
		    relatedActivities: [],
		    issues: [{
		    	key: 'Defective refrigerator',
				  emergency: false,
				  known: false
				}, {
		    	key: 'Gas leaks',
				  emergency: true,
				  known: false
				}]
		  }


		  user.problems.push(demoSave);

		  var savingUser = new User(user);
		  console.log(user);

		  savingUser.$update(function(success) {
		  	console.log(success);
		  }, function(error) {
		  	console.log(error);
		  });
		}*/

		activeMapper(user.problems, $scope.problems);


	}, function(err) {
		throw new Error('Whoa, looks like this is a problem...');
	});

}]);
