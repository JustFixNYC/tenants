'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userIssues',
	function($scope, problems, $modalInstance, issues, userProblem) {
		$scope.issues = issues;
		$scope.selectedIssues = [];
		console.log(userIssues);

		if(userIssues) {

			$scope.selectedIssues = userProblem.issues;
		}

		$scope.save = function(){
			$modalInstance.close($scope.selectedIssues);
		}
		$scope.cancel = function(){
			$modalInstance.close();
		}

	}])