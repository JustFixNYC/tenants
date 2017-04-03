'use strict';


angular.module('core').controller('HomeController', ['$rootScope', '$scope', '$timeout', 'Authentication', 'Users', 'deviceDetector',
	function($rootScope, $scope, $timeout, Authentication, Users, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;

		// After a client finishes scheduling we force an update to the user object
		// See line 11, public/modules/onboarding/config/onboarding.client.config.js
		$scope.$watch("authentication.user", function () {
			if($scope.authentication.user.currentAcuityEventId) {
				$scope.appt = Users.getScheduledEventInfo();
			}
		});

		$rootScope.closeDashboardAlert = false;

	}
]);
