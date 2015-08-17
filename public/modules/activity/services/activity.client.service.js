'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource',
  function($resource) {

    // taken from http://stackoverflow.com/questions/21115771/angularjs-upload-files-using-resource-solution
    //var transformRequest = function(data, headersGetter) { if (data === undefined) return data;var fd = new FormData();angular.forEach(data, function(value, key) { if (value instanceof FileList) { if (value.length == 1) { fd.append(key, value[0]);} else {angular.forEach(value, function(file, index) {fd.append(key + '_' + index, file);});}} else {if (value !== null && typeof value === 'object'){fd.append(key, JSON.stringify(value)); } else {fd.append(key, value);}}});return fd;}

    var transformRequest = function(data, headersGetter) {
      if (data === undefined)
        return data;

      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        // console.log(key + ' ' + value);

        if (value instanceof FileList) {
          if (value.length === 1) {
            fd.append(key, value[0]);
          } else {
            angular.forEach(value, function(file, index) {
              fd.append(key + '_' + index, file);
            });
          }
        } else {
          fd.append(key, value);
        }

        // console.log('fd', fd);
      });
      // console.log('fd', fd);
      return fd;
    };

    return $resource('activity', {}, {
      save: { 
          method: 'POST', 
          transformRequest: transformRequest, 
          headers: { 
            'Content-Type': undefined
          }
      } 
    });
  }
]);