'use strict';

angular.module('onboarding').controller('OnboardingController', ['$scope', 'AccessCodeService', 'Authentication', 'Users', function($scope, AccessCode, Authorization, User) {

	$scope.codeError = false;
/*	var code = new AccessCode($scope.enteredCode);

	code.$save(function successfulCodeSave (response){
			console.log(response);
		},
		function failedCodeSave (err) {
			console.log(err);
		});*/
  
  
  $scope.createUser = function(code) {

  	code = code + '';

  	var accessCodes = AccessCode.query(function() {
  		console.log(accessCodes.length);

	  	var searchThru = [];
	  	for(var i = 0; i < accessCodes.length; i++) {
	  		searchThru.push(accessCodes[i].code);
	  	};

	  	console.log(searchThru);

	  	if(searchThru.indexOf(code) <= -1) {
	  		$scope.codeError = true;
	  		return;
	  	} else {
	  		console.log('legit code bro');
	  	}
  	});
  }


}]);