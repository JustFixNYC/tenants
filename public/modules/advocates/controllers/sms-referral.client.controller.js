'use strict';

angular.module('actions').controller('SMSReferralController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, Authentication, $window) {

		$scope.sms = {
			phone: '',
			message: ''
		};

    $scope.includeCode = true;

		$scope.status = {
			loading: false,
			sent: false,
			error: false
		}




	  // var user = Authentication.user;
		var timerCountdown = 30;
		var setCreationTimer = function() {
			$timeout(function () {
				if(!$scope.status.sent) {
					$scope.status.loading = false;
					$scope.status.error = true;
					Rollbar.warning("Request for the sms took too long to respond");
	  			$scope.errorCode = 'Request for the sms took too long to respond';
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
