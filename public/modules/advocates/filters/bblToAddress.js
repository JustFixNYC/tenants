'use strict';

angular.module('advocates').filter('toAddress', function() {
  return function(input, bbls) {
    return bbls[input];
  };
});
