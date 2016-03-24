'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$scope', '$modalInstance', 'newActivity', 'Pdf', 'Authentication', '$window',
	function ($scope, $modalInstance, newActivity, Pdf, Authentication, $window) {

	  $scope.newActivity = newActivity;
	  var user = Authentication.user;

	  $scope.done = function () {
	  	Pdf.postComplaint().then(
	  		function success(data) {
	  			console.log();
	  			// TODO: render returned URL into a modal
	  			// $window.open(data);
	  		}, 
	  		function failure(error){
	  			console.log(error);
	  			// throw new Error(error);
	  		}
	  	);
	    $modalInstance.close($scope.newActivity);
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	}]);