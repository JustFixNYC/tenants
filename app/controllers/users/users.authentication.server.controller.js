'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  actionsHandler = require('../actions.server.controller'),
  addressHandler = require('../../services/address.server.service'),
  profileHandler = require('./users.profile.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
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
      .then(function (user) {
        rollbar.reportMessage("New User Signup!", "info", req);
        res.json(user);
      })
      .fail(function (err) {
        rollbar.handleError(errorHandler.getErrorMessage(err), req);
        res.status(400).send(errorHandler.getErrorMessage(err));
      });
  };

  // Add missing user fields
  user.provider = 'local';
  user.actionFlags.push('initial');

  // new user enabled sharing, so create a key
  // **actually, just create a key regardless**
  // if(user.sharing.enabled) {
    profileHandler.createPublicView().then(function(newUrl) {
      user.sharing.key = newUrl;
    });
  // }

  // make sure this comes before the 'added to checklist card'
  var acctCreatedDate = new Date();
  acctCreatedDate.setSeconds(acctCreatedDate.getSeconds() - 60);

  user.activity.push({
    key: 'createAcount',
    title: 'modules.activity.other.created',
    createdDate: acctCreatedDate,
    startDate: acctCreatedDate
  });

  // // check some address stuff
  // addressHandler.requestGeoclient(user.borough, user.address)
  //   .then(function (geo) {
  //     user.geo = geo;
  //     // check for tenant harassment hotline
  //     if(addressHandler.harassmentHelp(user.geo.zip)) user.actionFlags.push('isHarassmentElligible');
  //     return addressHandler.requestRentStabilized(geo.bbl, geo.lat, geo.lon);
  //   })
  //   .then(function (rs) {
  //     if(rs) user.actionFlags.push('isRentStabilized');
  //     save();
  //   })
  //   .fail(function (e) {
  //     console.log('[GEO]', e);
  //     save();
  //   });

  save();

};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      rollbar.handleError(info, req);
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          rollbar.handleError(err, req);
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
