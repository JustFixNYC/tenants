'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userProblem',
	function($scope, problems, $modalInstance, issues, userProblem) {
		$scope.issues = issues;
		$scope.checkString = '';
		$scope.tempIssues = [];

		for (var i = 0; i < userProblem.issues.length; i++) {
			$scope.tempIssues.push(userProblem.issues[i]);
			$scope.checkString += userProblem.issues[i].key;
		}

		$scope.save = function(){
			if($scope.other.value !== '') {
				$scope.tempIssues.push($scope.other);
			}
			$modalInstance.close($scope.tempIssues);
		}
		$scope.cancel = function(){
			$modalInstance.close();
		}

	}])