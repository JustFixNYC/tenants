'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'newActivity', 'Pdf', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, newActivity, Pdf, Authentication, $window) {

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
		var timerCountdown = 30;
		var setCreationTimer = function() {
			$timeout(function () {
				if(!$scope.status.created) {
					$scope.status.loading = false;
					$scope.status.error = true;
					Rollbar.warning("Request for the letter took too long to respond");
	  			$scope.errorCode = 'Request for the letter took too long to respond';
				}
			}, timerCountdown * 1000);
		};


	  $scope.createLetter = function () {

			$scope.status.loading = true;

	  	Pdf.createComplaint($scope.landlord, $scope.accessDates).then(
	  		function success(data) {
					setCreationTimer();
					$scope.status.loading = false;
					$scope.status.created = true;
					$scope.letterUrl = data;
					Rollbar.info("New Letter of Complaint!", { name: Authentication.user.fullName, phone: Authentication.user.phone, letterUrl: data });
					$scope.newActivity.fields.push({ title: 'letterURL', value: data });
	  		},
	  		function failure(error) {
					$scope.status.loading = false;
					$scope.status.error = true;
					Rollbar.error("Error with letter generation");
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
