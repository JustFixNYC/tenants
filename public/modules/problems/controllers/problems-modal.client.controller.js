'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userProblem',
	function($scope, problems, $modalInstance, issues, userProblem) {
		$scope.issues = issues;
		$scope.checkString = '';
		$scope.tempIssues = [];

		// Active mapper/other issue tracker
		for (var i = 0; i < userProblem.issues.length; i++) {
			$scope.tempIssues.push(userProblem.issues[i]);
			$scope.checkString += userProblem.issues[i].key;
			
			// If issues exists for this problem, create it in the scope we'll ref in the directive
			if(userProblem.issues[i].key == 'other') {
				$scope.other = userProblem.issues[i];
				console.log($scope.other);
				userProblem.issues.splice(i, 1);
			}
		}

		$scope.save = function(){
			if($scope.other) {
				$scope.tempIssues.push($scope.other);
			}
			$modalInstance.close($scope.tempIssues);
		}
		$scope.cancel = function(){
			$modalInstance.close();
		}

	}])