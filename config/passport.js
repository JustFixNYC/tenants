'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  Identity = require('mongoose').model('Identity'),
  Tenant = require('mongoose').model('Tenant'),
  User = require('mongoose').model('User'),
  authHandler = require('../app/controllers/users/users.authentication.server.controller'),
  path = require('path'),
  rollbar = require('rollbar'),
  config = require('./config');

mongoose.Promise = require('q').Promise;

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id })
      .populate('_identity _userdata', '-salt -password')
      .then(function(user) {
        var userObject = authHandler.formatUserForClient(user._identity, user._userdata);
        done(null, userObject);
      })
      .catch(function (err) {
        rollbar.handleError(err);
        done(err, null);
      });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
    require(path.resolve(strategy))();
  });
};
