'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$modalInstance', 'newActivity', 'Pdf', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $modalInstance, newActivity, Pdf, Authentication, $window) {

	  $scope.newActivity = newActivity;
	  var user = Authentication.user;

	  $scope.done = function () {
			$rootScope.loading = true;
	  	Pdf.postComplaint().then(
	  		function success(data) {
					$scope.newActivity.successResponse = $sce.trustAsHtml("View your link <a href='" + data + "'>Here</a>");
					$rootScope.loading = false;
	  			console.log(data);
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
