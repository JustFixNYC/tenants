'use strict';

angular.module('issues').factory('Issues', ['$http', '$q', 'Authentication',
  function Issues($http, $q, Authentication) {

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
      getChecklist: function() {
        return request(checklist);
      },
      getUserIssuesByKey: function(key) {
        return Authentication.user.issues[key];
      },
      getUserAreas: function() {
        var areas = [];
        angular.forEach(Authentication.user.issues, function (v, k) {
          if(v.length) { areas.push(k); }
        });
        return areas;
      }
    };
  }
]);
