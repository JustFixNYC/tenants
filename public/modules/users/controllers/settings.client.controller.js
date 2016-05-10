'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$filter', 'Users', 'Authentication',
  function($scope, $http, $location, $filter, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.passwordVerified = false;
    
    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');

    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function(provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function(provider) {
      $scope.success = $scope.error = null;

      $http.delete('/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signOut = function() {
    	$http.get('/auth/signout')
    		.then(function(success) {
    			console.log(success);
    		}, function(err) {
    			console.log(err);
    		});
    }

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        console.log('user', user);
        // This is a horrendus patch and needs to be fixed in onboarding
        user.firstName = user.fullName.split(' ')[0];
        user.lastName = user.fullName.split(' ')[1];

        user.$update(function(response) {
        	console.log(response);
          $scope.success = true;
          Authentication.user = response;
        }, function(response) {
        	console.log(response);
          $scope.error = response.data.message.message;
          // TODO: run the stack up to why this error is so nested
          if(response.data.message.errors)  {
          	if(response.data.message.errors.phone) {
          		$scope.errorPhone = response.data.message.errors.phone.message;
          	}
          }
        });
      } else {
        $scope.submitted = true;
      }
    };

    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.verifyPassword = function(password) {

    	$http.post('/users/verify-password', {"password": password}).success(function(response){
    		$scope.passwordVerified = true;
    	}).error(function(err) {
    		$scope.passwordError = true;
    		$scope.errorMessage = err.message; 
    	});
    }
  }
]);