'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  actionsHandler = require('../actions.server.controller'),
  addressHandler = require('../../services/address.server.service'),
  profileHandler = require('../users/users.profile.server.controller'),
  userAuthHandler = require('../users/users.authentication.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

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

  // this is a tenant user
  user.kind = 'Tenant';

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
  userAuthHandler.saveNewUser(req, identity, tenant, user)
    .then(function (user) {
      rollbar.reportMessage("New User Signup!", "info", req);
      res.json(user);
    })
    .fail(function (err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      res.status(400).send(errorHandler.getErrorMessage(err));
    });


};
