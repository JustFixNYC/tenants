'use strict';

angular.module('actions').controller('SMSReferralController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'Authentication', 'Advocates', '$window', '$httpParamSerializer',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, Authentication, Advocates, $window, $httpParamSerializer) {

		$scope.sms = {
			phone: '',
			userMessage: '',
      message: '',
      includeCode: true,
			spanish: false
		};

    $scope.status = {
			loading: false,
			sent: false,
			error: false
		};

    $scope.messageMaxLength = 160;

    var TEXT_MAX_LENGTH = 160;
    var SIGNUP_LINK = 'https://www.justfix.nyc/signup';
    // var originalLink = signupLink;
    var signupPrompt;

		// this is the actual text
    var updateMessage = function() {

			var qsObject = {};
			if($scope.sms.includeCode) qsObject.q = Authentication.user.code;
			if($scope.sms.spanish) qsObject.lang = 'es';

			var qs = $httpParamSerializer(qsObject);

			var signupLink = qs ? SIGNUP_LINK + '?' + qs : SIGNUP_LINK;

			if($scope.sms.spanish) {
				signupPrompt = ' Regístrate en: ' + signupLink;
			} else {
				signupPrompt = ' Sign up at: ' + signupLink;
			}

      $scope.sms.message = $scope.sms.userMessage + signupPrompt;
      $scope.length = $scope.sms.message.length;

      // represents the max amount of characters the user can enter
      $scope.messageMaxLength = TEXT_MAX_LENGTH - signupPrompt.length;
    };

		// this is the preformed user message
		var updateUserMessage = function() {

			if($scope.sms.includeCode && $scope.sms.spanish) {
				$scope.sms.userMessage = 'Comience a usar JustFix.nyc para enviar fotos e información a ' + Authentication.user.firstName + ' en ' + Authentication.user.organization + ".";
			} else if($scope.sms.includeCode && !$scope.sms.spanish) {
				$scope.sms.userMessage = "Start using JustFix.nyc to send info to " + Authentication.user.firstName + " at " + Authentication.user.organization + "!";
			} else if(!$scope.sms.includeCode && $scope.sms.spanish) {
				$scope.sms.userMessage = "Comience a usar JustFix.nyc para documentar sus problemas de vivienda!";
			} else {
				$scope.sms.userMessage = "Start using JustFix.nyc to document your issues!";
			}

		};


    $scope.$watch('sms.includeCode', function(newVal, oldVal) {
			updateUserMessage();
      updateMessage();
    });
		$scope.$watch('sms.spanish', function(newVal, oldVal) {
			updateUserMessage();
			updateMessage();
		});
		$scope.$watch('sms.userMessage', function(newVal, oldVal) {
			updateMessage();
		});

		$scope.setLangSpanish = function(yn) {
			$scope.sms.spanish = yn;
		};

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
