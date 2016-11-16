'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    rollbar = require('rollbar'),
    IdentitySchema = require('./identity.server.model.js');

mongoose.Promise = require('q').Promise;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Advocate Schema
 */
var AdminSchema = new Schema({
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Can call this to perform additional functions after its populated as userdata
 */
AdminSchema.methods.build = function() {

    var built = Q.defer();

    console.log('build', this);

    built.resolve();

    return built.promise;
};

mongoose.model('Admin', AdminSchema);
