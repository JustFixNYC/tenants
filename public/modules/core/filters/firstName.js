'use strict';

angular.module('core').filter('firstname', function() {
    return function (input) {
      return input.split(' ')[0];
    }
});
