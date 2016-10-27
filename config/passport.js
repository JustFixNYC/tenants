'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  passport = require('passport'),
  Identity = require('mongoose').model('Identity'),
  Tenant = require('mongoose').model('Tenant'),
  User = require('mongoose').model('User'),
  path = require('path'),
  rollbar = require('rollbar'),
  config = require('./config');

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user._identity);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    Identity.findOne({
      _id: id
    }, '-salt -password', function(err, identity) {

      if(err) {
        rollbar.handleError(err);
        done(err, null);
      } else {
        Tenant.findOne({
          _identity: identity._id
        }, function(err, tenant) {
          if(err) {
            rollbar.handleError(err);
            done(err, null);
          } else {
            var user = _.extend(identity.toObject(), tenant.toObject());
            done(err, user);
          }
        });
      }
    });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
    require(path.resolve(strategy))();
  });
};
