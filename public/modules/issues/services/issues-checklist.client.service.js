'use strict';

angular.module('issues').factory('IssuesChecklist', ['$http', '$q', 
  function IssuesChecklist($http, $q) {

    var checklist = 'data/checklist.json';
    var request = function(url) {
      var deferred = $q.defer();

      $http.get(url).
        then(function(response) {
          deferred.resolve(response.data);
        }, function(err) {
          deferred.reject();
        });
        
      return deferred.promise;          
    };

    return {
      get: function() {
        return request(checklist);
      }
    };
  }
]);