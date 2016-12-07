'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  userAuthHandler = require('../users/users.authentication.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Advocate = mongoose.model('Advocate');

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
  var advocate = new Advocate(req.body);
  var user = new User();

  // this is an advocate user
  user.kind = 'Advocate';
  identity.roles = ['advocate'];

  var message = null;

  // Add missing user fields
  identity.provider = 'local';

  // save the user, do a bunch of mongoose things
  // returns a prepared user object
  userAuthHandler.saveNewUser(req, identity, advocate, user)
    .then(function (user) {
      rollbar.reportMessage("New Advocate Signup!", "info", req);

      res.json(user);
    })
    .fail(function (err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      res.status(400).send(errorHandler.getErrorMessage(err));
    });


};
