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
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant');

var saveNewUser = function(req, identity, tenant) {

  var saved = Q.defer();

  identity.save(function(err) {
    if (err) {
      saved.reject(errorHandler.getErrorMessage(err));
    }
    else {
      // Remove sensitive data before login
      identity.password = undefined;
      identity.salt = undefined;

      // Save reference to identity
      tenant._identity = identity._id;

      // Save tenant document, then login
      tenant.save(function (err) {
        if (err) {
          saved.reject(errorHandler.getErrorMessage(err));
        }
        else {

          // create new "user" object from both identity and tenant objects
          // note: overlap values like _id & phone in `identity` will be overwritten
          // need to use mongoose `toObject()` here as well
          var user = _.extend(identity.toObject(), tenant.toObject());

          req.login(user, function(err) {
            if (err) {
              saved.reject(errorHandler.getErrorMessage(err));
            } else {
              saved.resolve(user);
            }
          });
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
  // This is so the user can't set their own roles, duh
  delete req.body.roles;

  // Init Variables
  // Mongoose will just take what it needs for each model
  var identity = new Identity(req.body);
  var tenant = new Tenant(req.body);
  // var user = new User(req.body);

  var message = null;

  // Add missing user fields
  identity.provider = 'local';
  tenant.actionFlags.push('initial');

  // new user enabled sharing, so create a key
  // **actually, just create a key regardless**
  // if(user.sharing.enabled) {
    profileHandler.createPublicView().then(function(newUrl) {
      tenant.sharing.key = newUrl;
    });
  // }

  // make sure this comes before the 'added to checklist card'
  var acctCreatedDate = new Date();
  acctCreatedDate.setSeconds(acctCreatedDate.getSeconds() - 60);

  tenant.activity.push({
    key: 'createAcount',
    title: 'modules.activity.other.created',
    createdDate: acctCreatedDate,
    startDate: acctCreatedDate
  });

  saveNewUser(req, identity, tenant)
    .then(function (user) {
      // console.log('new user', user);
      rollbar.reportMessage("New User Signup!", "info", req);
      res.json(user);
    })
    .fail(function (err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      res.status(400).send(errorHandler.getErrorMessage(err));
    });


};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, identity, info) {
    if (err || !identity) {
      rollbar.handleError(info, req);
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      identity.password = undefined;
      identity.salt = undefined;

      Tenant.findOne({
        _identity: identity._id
      }, function(err, tenant) {
        if(err) {
          rollbar.reportMessage("Tenant/Identity mismatch?", "error", req);
          rollbar.handleError(err, req);
          res.status(400).send(err);
        } else {

          var user = _.extend(identity.toObject(), tenant.toObject());

          req.login(user, function(err) {
            if (err) {
              rollbar.handleError(err, req);
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
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
