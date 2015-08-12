'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  actionsHandler = require('../actions.server.controller'),
  addressHandler = require('../../services/address.server.service'),  
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

var saveUser = function(req, user) {

  var saved = Q.defer();

  user.save(function(err) {
    if (err) {
      saved.reject(errorHandler.getErrorMessage(err));
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;  

      req.login(user, function(err) {
        if (err) {
          saved.reject(errorHandler.getErrorMessage(err));
        } else {
          saved.resolve(user);
        }
      });
    }
  });

  return saved.promise;
};

/**
 * Signup
 */
exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  var save = function() {
    saveUser(req, user)
      .then(function (user) { res.json(user); })
      .fail(function (err) { res.status(400).send(err); });
  };

  // Add missing user fields
  user.provider = 'local';
  user.actionFlags.push('initial');

  // check issues for emergency ones
  for(var area in user.issues) {
    user.issues[area].forEach(function (i) {
      if(i.emergency) user.actionFlags.push('hasEmergencyIssues');
    });
  }

  // check some address stuff
  addressHandler.requestGeoclient(user.borough, user.address)
    .then(function (geo) {
      user.geo = geo;
      return addressHandler.requestRentStabilized(geo.bbl, geo.lat, geo.lon);
    })
    .then(function (rs) {
      if(rs) user.actionFlags.push('isRentStabilized');
      save();
    })
    .fail(function (e) {
      console.log(e);
      save();
    });




};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {


          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};