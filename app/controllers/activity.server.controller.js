'use strict';

var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

var list = function(req, res) {

  if(req.user) {
    //var actions = generateActions(user);
    res.json(req.user.activity);
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

    // remove from follow up flags
    var idx = user.followUpFlags.indexOf(activity.key);
    if(idx < 0) return res.status(500).send({ message: 'Follow up key not found, this is bad' });
    else user.followUpFlags.splice(idx, 1);

    // add to action flags
    user.actionFlags.push(activity.key);

    // create activity object
    user.activity.create(activity);

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