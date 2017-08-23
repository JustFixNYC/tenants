'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
  errorHandler = require('../errors.server.controller'),
	rollbar = require('rollbar'),
	Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

/**
 * User authorizations routing middleware
 */
exports.isManagedTenant = function(req, res, next) {

  Tenant.findOne({ _id: req.params.id })
    .then(function (tenant) {
      if(!tenant) {
        rollbar.handleError("Invalid Tenant ID Field", req);
        res.status(400).send({ message: errorHandler.getErrorMessage("Invalid Tenant ID Field") });
      } else if(tenant.advocateRole !== 'managed' || !tenant.advocate.equals(req.user._userdata)) {
        rollbar.handleError("Unauthorized tenant access", req);
        res.status(400).send({ message: errorHandler.getErrorMessage("Unauthorized tenant access") });
      } else {
        res.locals.tenant = tenant;
        next();
      }
    })
    .catch(function (err) {
      rollbar.handleError("Invalid Tenant ID Field", req);
      res.status(400).send({ message: errorHandler.getErrorMessage("Invalid Tenant ID Field") });
    });
};
