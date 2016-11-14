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

mongoose.Promise = require('q').Promise;

/**
 * Take a populated User model and flatten it for the api response
 */
var formatUserForClient = exports.formatUserForClient = function(identity, tenant) {

  // save reference to identity _id;
  var _identity = identity._id;

  // create new "user" object from both identity and tenant objects
  // this is the data that will be sent back to the page
  // note: overlap values like _id & phone in `identity` will be overwritten
  // need to use mongoose `toObject()` here as well
  var userObject = _.extend(identity.toObject(), tenant.toObject());
  userObject._identity = _identity;

  return userObject;
};

/**
 * Save prepared user documents and create a new User
 */
var saveNewUser = function(req, identity, tenant, user) {

  var saved = Q.defer();
  var _this = this;

  // save both identity and tenant documents
  // mongoose is configured to run on q promises
  Q.allSettled([identity.save(), tenant.save()])
    .spread(function (identity, tenant) {

      if(identity.state === 'rejected') {
        saved.reject(errorHandler.getErrorMessage(identity.reason));
      }
      if(tenant.state === 'rejected') {
        saved.reject(errorHandler.getErrorMessage(tenant.reason));
      }

      // save the ObjectID references of the two documents
      user._identity = identity.value._id;
      user._userdata = tenant.value._id;

      // save new User
      return user.save();
    })
    .then(function (user) {

      // see above
      var userObject = formatUserForClient(identity, tenant);

      // passport login, serializes the user
      // unfortunately not configured for q promises
      req.login(user, function(err) {
        if (err) {
          saved.reject(errorHandler.getErrorMessage(err));
        } else {
          // pass this json for the res
          saved.resolve(userObject);
        }
      });

    })
    .catch(function (err) {
      console.log('err', err);
      saved.reject(errorHandler.getErrorMessage(err));
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
  var user = new User();
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

  // self-explanatory?
  tenant.activity.push({
    key: 'createAcount',
    title: 'modules.activity.other.created',
    createdDate: acctCreatedDate,
    startDate: acctCreatedDate
  });

  // save the user, do a bunch of mongoose things
  // returns a prepared user object
  saveNewUser(req, identity, tenant, user)
    .then(function (user) {
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

  // sign in, returns the identity object
  passport.authenticate('local', function(err, identity, info) {
    if (err || !identity) {
      rollbar.handleError(info, req);
      res.status(400).send(info);
    } else {

      // get User document
      User.findOne({ _identity: identity._id })
        .populate('_identity _userdata', '-salt -password')
        .then(function(user) {

          // format for the res
          var userObject = formatUserForClient(user._identity, user._userdata);

          // log in, serializes the user
          req.login(user, function(err) {
            if (err) {
              rollbar.handleError(err, req);
              res.status(400).send(err);
            } else {
              rollbar.reportMessage("User Sign In", "info", req);
              res.json(userObject);
            }
          });

        })
        .catch(function (err) {
          rollbar.handleError(err);
          res.status(400).send(err);
        });
    } // no error from passport

  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};
