'use strict';

angular.module('onboarding').factory('UserListingService', ['$resource', function($resource) {
  // Public API
  return $resource('users/list');
}]);
