'use strict';

angular.module('onboarding').controller('OnboardingController', ['$scope', 'AccessCodeService', 'Authentication', 'Users', '$location', function($scope, AccessCode, Authentication, User, $location) {

	$scope.codeError = false;
  
  $scope.createUser = function(code) {

  	code = code + '';

  	var accessCodes = AccessCode.query(function() {

	  	var searchThru = [];
	  	for(var i = 0; i < accessCodes.length; i++) {
	  		searchThru.push(accessCodes[i].code);
	  	}

	  	// Check if code exists
	  	if(searchThru.indexOf(code) <= -1) {
	  		$scope.codeError = true;
	  		return;
	  	} else {
	  		console.log('legit code bro');

	  		var user = new User({code: code});
	  		Authentication.user = user;

	  		$location.path('onboarding-selection');
	  	}

  	});
  };


}]);