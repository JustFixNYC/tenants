'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$modalInstance', 'newActivity', 'Pdf', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $modalInstance, newActivity, Pdf, Authentication, $window) {

	  $scope.newActivity = newActivity;
		$scope.newActivity.fields = [];
		$scope.landlord = {
			name: '',
			address: ''
		};
		$scope.accessDates = [];
		$scope.accessDates.push('');

		$scope.status = {
			loading: false,
			created: false,
			error: false
		}

		$scope.addAccessDate = function() {
			$scope.accessDates.push('');
		};


	  // var user = Authentication.user;

	  $scope.createLetter = function () {

			$scope.status.loading = true;

	  	Pdf.createComplaint($scope.landlord, $scope.accessDates).then(
	  		function success(data) {
					$scope.status.loading = false;
					$scope.status.created = true;
					$scope.letterUrl = data;
					$scope.newActivity.fields.push({ title: 'letterURL', value: data });
	  			console.log(data);
	  		},
	  		function failure(error) {
					$scope.status.loading = false;
					$scope.status.error = true;
	  			$scope.errorCode = error;
	  		}
	  	);




	    // $modalInstance.close($scope.newActivity);
	  };

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({ newActivity: $scope.newActivity, modalError: $scope.status.error });
		};
	}]);
