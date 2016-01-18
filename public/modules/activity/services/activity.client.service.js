'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource',
  function($resource) {

    // taken from http://stackoverflow.com/questions/21115771/angularjs-upload-files-using-resource-solution
    //var transformRequest = function(data, headersGetter) { if (data === undefined) return data;var fd = new FormData();angular.forEach(data, function(value, key) { if (value instanceof FileList) { if (value.length == 1) { fd.append(key, value[0]);} else {angular.forEach(value, function(file, index) {fd.append(key + '_' + index, file);});}} else {if (value !== null && typeof value === 'object'){fd.append(key, JSON.stringify(value)); } else {fd.append(key, value);}}});return fd;}

    var transformRequest = function(data, headersGetter) {
      if (data === undefined)
        return data;

        console.log(data);

      var fd = new FormData();
      angular.forEach(data, function(value, key) {

        console.log(key, value);

        if (value instanceof FileList) {
          if (value.length === 1) {
            fd.append(key, value[0]);
          } else {
            angular.forEach(value, function(file, index) {
              fd.append(key + '_' + index, file);
            });
          }
        } else if (value instanceof Object) {
          console.log(JSON.stringify(value));
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value);
        }

        //console.log('fd', fd);
      });
      //console.log('fd', fd.toString());
      return fd;
    };

    var objectToFormData = function(obj, form, namespace) {

      var fd = form || new FormData();
      var formKey;

      for(var property in obj) {
        if(obj.hasOwnProperty(property)) {

          if(namespace) {
            formKey = namespace + '[' + property + ']';
          } else {
            formKey = property;
          }

          // if the property is an object, but not a File,
          // use recursivity.
          if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            
            objectToFormData(obj[property], fd, formKey);

          } else {

            // if it's a string or a File object
            fd.append(formKey, obj[property]);
          }

        }
      }

      return fd;

    };

    // wrap object to formdata method,
    // to use it as a transform with angular's http.
    var formDataTransform = function(data, headersGetter) {

      // we need to set Content-Type to undefined,
      // to make the browser set it to multipart/form-data
      // and fill in the correct *boundary*.
      // setting Content-Type to multipart/form-data manually
      // will fail to fill in the boundary parameter of the request.
      //headersGetter()['Content-Type'] = undefined;

      return objectToFormData(data);

    };


    return $resource('activity', {}, {
      save: {
          method: 'POST',
          transformRequest: formDataTransform,
          headers: {
            'Content-Type': undefined
          }
      }
    });
  }
]);
