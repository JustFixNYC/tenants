'use strict';

angular.module('actions').controller('SethLowSMSReferralController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'Authentication', 'Advocates', '$window', 'tenantPhone',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, Authentication, Advocates, $window, tenantPhone) {

		$scope.sms = {
			phone: '',
      message: '',
			type: ''
		};

		if(tenantPhone) {
			$scope.sms.phone = tenantPhone
		}

    $scope.status = {
			loading: false,
			sent: false,
			error: false
		};

		var messages = {
			job: "Thank you for participating in the survey! For employment or financial counseling please contact Madeline Sanders, Brownsville Partnership at 9292529296",
			legal: "Thank you for participating in the survey! Please visit Legal Hand at 650 Rockaway Ave or call 3474049567 for free legal info on issues of housing & more."
		}

		$scope.selectMessageType = function(type) {
			$scope.sms.type = type;
			$scope.sms.message = messages[type];
		}

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


    $scope.sendSMS = function() {

			$scope.status.loading = true;

			Advocates.sendReferralSMS({}, { phone: $scope.sms.phone, message: $scope.sms.message},
				function (success) {
					setCreationTimer();
					$scope.status.loading = false;
					$scope.status.sent = true;
				},
				function (error) {
					$scope.status.loading = false;
					$scope.status.error = true;
					Rollbar.error("Error with SMS referral service");
	  			$scope.errorCode = error.data.message;
				}
			);

    };

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({});
		};
	}]);
