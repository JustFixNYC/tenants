'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userProblem',
	function($scope, problems, $modalInstance, issues, userProblem) {
		$scope.issues = issues;
		$scope.checkString = '';
		$scope.tempIssues = [];

		// TODO: clean this up, remove selected issues
		$scope.selectedIssues = userProblem.issues;

		for (var i = 0; i < $scope.selectedIssues.length; i++) {
			$scope.tempIssues.push($scope.selectedIssues[i]);
			$scope.checkString += $scope.selectedIssues[i].key;
		}

		$scope.save = function(){
			$modalInstance.close($scope.tempIssues);
		}
		$scope.cancel = function(){
			$modalInstance.close();
		}

	}])