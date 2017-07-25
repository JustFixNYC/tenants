'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  sanitize = require('mongo-sanitize'),
  Tenant = mongoose.model('Tenant'),
  rollbar = require('rollbar');

mongoose.Promise = require('q').Promise;

exports.bblsLookup = function(req, res) {

  // enable cors for this
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // sanitize any user input
  var bbls = sanitize(req.body.bbls);

  // query the tenants
  var query = { 'geo.bbl' : { $in: bbls } };

  // see results
  Tenant.collection.find(query).toArray(function(err, data) {
    if(err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      return res.status(500).send(errorHandler.getErrorMessage(err));
    }
    else {
      var hasUsers = (data.length) ? true : false;
      return res.send({
        hasJustFixUsers: hasUsers
      });
    }
  });

};
