'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource',
  function($resource) {
    return $resource('activity', {}, {
      // update: {
      //   method: 'PUT'
      // }
    });
  }
]);