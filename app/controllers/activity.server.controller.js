'use strict';

var _ = require('lodash'),
  q = require('q'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  fullActions = require('../data/actions.json');

/* things:

  action
  gave 

*/


// var addActionFlag = function(id, flag) {
//   var deferred = q.defer();

//   User.update({ '_id': id },
//     {$push: { 'actionFlags': flag }},
//     function(err, numAffected) {
//       if(err) deferred.reject(err);
//       else deferred.resolve();
//     });

//   return deferred.promise;
// };

var list = function(req, res) {

  var user = req.user;
  if(user) {
    //var actions = generateActions(user);
    res.json(user.activity);
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }

};

var create = function(req, res) {
  var user = req.user;
  var activity = req.body;

  if(user) {

    // add to action flag
    user.followUpFlags.push(activity.key);

    // add 

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(user);
      }
    });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

module.exports = {
  list: list,
  create: create
};