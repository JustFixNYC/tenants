'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$scope', '$modalInstance', 'newActivity', 'Pdf', 
	function ($scope, $modalInstance, newActivity, Pdf) {

	  $scope.newActivity = newActivity;

	  $scope.done = function () {
	  	Pdf.postComplaint();
	    $modalInstance.close($scope.newActivity);
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	}]);