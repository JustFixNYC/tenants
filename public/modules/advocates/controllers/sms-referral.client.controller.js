'use strict';

angular.module('actions').controller('SMSReferralController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'Authentication', 'Advocates', '$window',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, Authentication, Advocates, $window) {

		$scope.sms = {
			phone: '',
			userMessage: '',
      message: '',
      includeCode: true
		};

    $scope.status = {
			loading: false,
			sent: false,
			error: false
		};

    $scope.messageMaxLength = 160;

    var TEXT_MAX_LENGTH = 160;
    var signupLink = 'https://www.justfix.nyc/signup';
    var originalLink = signupLink;
    var signupPrompt;

    var updateMessage = function() {

      $scope.sms.message = $scope.sms.userMessage + signupPrompt;
      $scope.length = $scope.sms.message.length;

      // represents the max amount of characters the user can enter
      $scope.messageMaxLength = TEXT_MAX_LENGTH - signupPrompt.length;
    };


    $scope.$watch('sms.includeCode', function(newVal, oldVal) {
      if(newVal) {
        signupLink += '?q=' + Authentication.user.code;
        $scope.sms.userMessage = "Start using JustFix.nyc to send info to " + Authentication.user.firstName + " at " + Authentication.user.organization + "!";
      } else {
        signupLink = originalLink;
        $scope.sms.userMessage = "Start using JustFix.nyc to document your issues!";
      }

      signupPrompt = ' Sign up at: ' + signupLink;

      updateMessage();
    });

    $scope.$watch('sms.userMessage', function(newVal, oldVal) {
      updateMessage();
    });


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

      if($scope.sms.userMessage.length > $scope.messageMaxLength) {
        $scope.lengthError = true;
      } else {
        $scope.lengthError = false;
      }

      if(!$scope.sms.phone.length) {
        $scope.phoneError = true;
      } else {
        $scope.phoneError = false;
      }

			if($scope.lengthError || $scope.phoneError) {
				// display the error messages
				// necessary to trigger a change in height
				$timeout(function () {
					$scope.elemHasChanged = true;
				});
			} else {

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
			}

    };

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({});
		};
	}]);
