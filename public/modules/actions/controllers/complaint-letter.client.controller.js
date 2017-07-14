'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'newActivity', 'Pdf', 'Messages', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, newActivity, Pdf, Messages, Authentication, $window) {

		$scope.user = Authentication.user;
	  $scope.newActivity = newActivity;
		$scope.newActivity.fields = [];
		$scope.landlord = {
			name: '',
			address: ''
		};
		$scope.accessDates = [];
		$scope.accessDates.push('');

		$scope.status = {};
		$scope.status.created = false; // initial state
		$scope.status.state = 'landlordInfo'; // initial state
		// $scope.status.state = 'loading'; // initial state

		// landlordInfo, msgPreview,
		// loading, msgError,
		// msgSuccess, letterReview, letterSuccess

		$scope.addAccessDate = function() {
			$scope.accessDates.push('');
		};

	  // var user = Authentication.user;
		var timerCountdown = 30;
		var setCreationTimer = function() {
			$timeout(function () {
				if(!$scope.status.created) {
					$scope.status.state = 'error';
					Rollbar.warning("Request for the letter took too long to respond");
	  			$scope.errorCode = 'Request for the letter took too long to respond';
				}
			}, timerCountdown * 1000);
		};

		$scope.generatePreview = function() {
			$scope.msgPreview = Messages.getLandlordEmailMessage($scope.landlord.name, $scope.accessDates);
			$scope.status.state = 'msgPreview';
		};


	  $scope.createLetter = function() {

			$scope.status.state = 'loading';

	  	Pdf.createComplaint($scope.landlord, $scope.accessDates).then(
	  		function success(data) {
					setCreationTimer();
					$scope.status.state = 'msgSuccess';
					$scope.status.created = true;
					$scope.letterUrl = data;
					$scope.newActivity.fields.push({ title: 'letterURL', value: data });
	  		},
	  		function failure(error) {
					$scope.status.state = 'error';
					Rollbar.error("Error with letter generation");
	  			$scope.errorCode = error;
	  		}
	  	);

	  };

		$scope.sendLetter = function() {

			Rollbar.info("New Letter of Complaint!", {
				name: Authentication.user.fullName,
				phone: Authentication.user.phone,
				letterUrl: $scope.letterUrl,
				landlordName: $scope.landlord.name,
				landlordAddress: $scope.landlord.address
			});
			$scope.newActivity.fields.push({ title: 'landlordName', value: $scope.landlord.name });
			$scope.newActivity.fields.push({ title: 'landlordAddress', value: $scope.landlord.address });

			$scope.status.state = 'letterSuccess';
		};

		$scope.mailItMyself = function() {
			Rollbar.info("New Letter of Complaint! (mail on their own)", {
				name: Authentication.user.fullName,
				phone: Authentication.user.phone,
				letterUrl: $scope.letterUrl,
				landlordName: $scope.landlord.name,
				landlordAddress: $scope.landlord.address
			});
			$scope.done();
		};

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({ newActivity: $scope.newActivity, modalError: $scope.status.error });
		};
	}]);
