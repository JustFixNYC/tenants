
'use strict';

angular.module('onboarding')
  .controller('OnboardingCreateController', ['$scope', 'AccessCodeService', 'UserListingService', 'Authentication', 'Users', function($scope, AccessCode, UserListing, Authentication, Users) {

		// Check about actions taken
		$scope.response = "nothing yet";

		// Default settings for creating a new org
		$scope.codeInfo = {
			name: 'default',
			code: '123-abc',
			phone: 1234567890,
			email: 'default@justfix.nyc',
			organization: 'orgOrg'
		};

	  // Try to create new org/code
	  $scope.submit = function(newInfo) {

	  	var code = new AccessCode(newInfo);

			code.$save(function successfulCodeSave (response){
				console.log(response);
				$scope.response = 'Success!';
	  		$scope.codes = AccessCode.query();
			},
			function failedCodeSave (err) {
				console.log(err);
	  		$scope.response = err.data;
			});

	  }

	  // Delete code
	  $scope.remove = function(removeCode) {
	  	console.log(removeCode);

	  	AccessCode.delete({code: removeCode}, function(response) {
	  		$scope.codes = AccessCode.query();

	  	}, function(err) {
	  		console.log(err);
	  		$scope.response = err;
	  	});
	  }

  	var codes = AccessCode.query(function() {

  		$scope.codes = codes;

  	});

  	// List all users
  	var users = UserListing.query(function() {
  		$scope.users = users;
  		console.log($scope.users);
  	});

  	$scope.switchRole = function(user) {

  		user.roles[0] == 'admin' ? user.roles[0] = 'user': user.roles[0] = 'admin';
  		user.roles[0] = 'admin';

  		var user = new Users(user);

  		user.$update(function(response) {
        $scope.message = 'User Updated';
        Authentication.user = response;
      }, function(response) {
        $scope.message = response.data.message;
      });

  	}

	}]);
