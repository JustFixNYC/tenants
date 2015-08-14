'use strict';

var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

var aptSpaces = ['generalApt', 'entryHallway', 'kitchen', 'bathroom', 'diningRoom', 'livingRoom', 'bedrooms', 'publicAreas', 'otherContent'];

var list = function(req, res) {

  if(req.user) {
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

    console.log(activity);

    // ignore area related activities from follow up check
    if(aptSpaces.indexOf(activity.key) === -1) {
      // remove from follow up flags
      var idx = user.followUpFlags.indexOf(activity.key);
      if(idx < 0) return res.status(500).send({ message: 'Follow up key not found, this is bad' });
      else user.followUpFlags.splice(idx, 1);
    }

    // add to action flags
    if(activity.key !== 'otherContent') user.actionFlags.push(activity.key);

    var allInitial = true;
    // for every area in issues
    for(var area in user.issues) {
      // if the area has issues...
      if(user.issues[area].length) {
        // if the area content hasn't been done yet
        if(user.actionFlags.indexOf(area) === -1) allInitial = false;
      }
    }
    if(allInitial) user.actionFlags.push('allInitial');
    else {
      var idx = user.actionFlags.indexOf('allInitial');
      if(idx !== -1) user.actionFlags.splice(idx, 1);
    }

    // create activity object
    user.activity.push(activity);

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