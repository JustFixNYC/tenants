'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'deviceDetector',
	function($scope, Authentication, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;

	}
]);
