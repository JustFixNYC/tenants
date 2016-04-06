'use strict';

angular
  .module('onboarding')
  .controller('OnboardingDetailsController', [ '$scope', 'Authentication', 'Users', '$http',
		function($scope, Authentication, User, $http){


  		$scope.title = 'Create Account';
  		var user = Authentication.user;
  		$scope.userInfo = user;

  		if(!$scope.userInfo || $scope.userInfo === '') {
  			$scope.userInfo = {};
  		}

  		if(user.fullName) {
  			$scope.userInfo.firstName = $scope.user['fullName'].split(' ')[0];
  			$scope.userInfo.lastName = $scope.user['fullName'].split(' ')[1];
  		}

  		if(!user.borough) {
  			$scope.userInfo.borough = 'Bronx';
  		}

  		if(!user.nycha) {
  			$scope.userInfo.nycha = 'yes';
  		}

  		$scope.createAndNext = function () {

  			$scope.userInfo.fullName = $scope.userInfo.firstName + ' ' + $scope.userInfo.lastName;

  			Authentication.user = $scope.userInfo;

  			console.log(Authentication.user);

  			$http({
  				method: 'POST',
  				url: '/auth/signup',
  				data: Authentication.user
  			}).then(function(success){
  				console.log('success!');
  				console.log(success);
  			}, function(err) {
  				console.log(err);
  				console.log('poop');
  			})

  			/*var savingUser = new Authentication.prepUser(Authentication.user);
  			savingUser.$signUp*/
  		}
  
  }]);
