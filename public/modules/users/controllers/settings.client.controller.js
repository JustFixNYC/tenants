'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$filter', 'Users', 'Authentication', '$rootScope',
  function($scope, $http, $location, $filter, Users, Authentication, $rootScope) {
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
    			$location.path('/');
    		}, function(err) {
    			console.log(err);
    		});
    }

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        if(isValid) {

				$scope.userError = false;
				$rootScope.loading = true;

				user.$update(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					Authentication.user = response;
					$location.path('/settings/profile');

				}, function(err) {
					$rootScope.loading = false;
					console.log(err);
        	$scope.error = err;
				});

				} else {
					$scope.userError = true;
				}
			}
    };

    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
				$location.path('/settings/profile');
      }).error(function(response) {
        $scope.error = response.message;
      });
      return
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