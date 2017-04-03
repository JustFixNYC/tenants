'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  actionsHandler = require('../actions.server.controller'),
  addressHandler = require('../../services/address.server.service'),
  tenantProfileHandler = require('./tenants.profile.server.controller'),
  userAuthHandler = require('../users/users.authentication.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

var buildNewTenant = exports.buildNewTenant = function(tenant, advocate) {

  var built = Q.defer();

  tenant.actionFlags.push('initial');

  // make sure this comes before the 'added to checklist card'
  var acctCreatedDate = new Date();
  acctCreatedDate.setSeconds(acctCreatedDate.getSeconds() - 60);

  // self-explanatory?
  var createActivity = {
    key: 'createAcount',
    title: 'modules.activity.other.created',
    createdDate: acctCreatedDate,
    startDate: acctCreatedDate
  };

  if(advocate) {
    createActivity.loggedBy = advocate.fullName;
  } else {
    createActivity.loggedBy = tenant.firstName + ' ' + tenant.lastName;
  }

  tenant.activity.push(createActivity);

  tenant.updated = acctCreatedDate;

  // new user enabled sharing, so create a key
  // **actually, just create a key regardless**
  // if(user.sharing.enabled) {
    tenantProfileHandler.createPublicView().then(function(newUrl) {
      tenant.sharing.key = newUrl;
      built.resolve(tenant);
    });
  // }

  return built.promise;
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

  // this is a tenant user
  user.kind = 'Tenant';

  // Add missing user fields
  identity.provider = 'local';

  var message = null;

  buildNewTenant(tenant, undefined)
    .then(function (tenant) {
      return userAuthHandler.saveNewUser(req, identity, tenant, user);
    })
    .then(function (userObject) {
      rollbar.reportMessage("New User Signup!", "info", req);
      res.json(userObject);
    })
    .catch(function (err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      res.status(400).send(errorHandler.getErrorMessage(err));
    });

};
