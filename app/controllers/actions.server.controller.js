'use strict';

var fs = require('fs'),
  q = require('q');

exports.populateToDos = function(user) {
  var deferred = q.defer();
  fs.readFile('app/data/actions.json', 
    function (err, data) {
      if (err) {
        new Error('Failed to load defulat ToDo actions');
        deferred.reject();
      }
      var obj = JSON.parse(data);
      obj.actions.forEach(function(action) {
        user.toDoActions.push(action);
      });
      deferred.resolve();
  });
  return deferred.promise;
};