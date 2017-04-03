'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userProblem',
	function($scope, problems, $modalInstance, issues, userProblem) {

		$scope.issues = issues;
		$scope.userProblem = userProblem;

		// only use this in case of "cancel"
		var userIssuesClone = $scope.userProblem.issues.slice(0);

		// we should just take advantage of angulars data binding here
		$scope.isSelected = function(issue) {
			return $scope.userProblem.issues.containsByKey(issue.key);
		};

		$scope.select = function(issue) {
			if($scope.isSelected(issue)) {
				$scope.userProblem.issues.removeByKey(issue.key);
			} else {
				$scope.userProblem.issues.push(issue);
			}
		};

		$scope.save = function(event) {
			// did we end up making our other issue -- if it's not created in the above loop or the parent directive, then this doesn't get fired
			if($scope.newOther && $scope.newOther.key.length) {
				$scope.addOther(event);
			}

			$modalInstance.close();
		}
		$scope.cancel = function() {
			$scope.userProblem.issues = userIssuesClone;
			$modalInstance.dismiss();
		}

	}])
