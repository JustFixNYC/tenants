'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    addressHandler = require('../services/address.server.service'),
    rollbar = require('rollbar'),
    ActivitySchema = require('./activity.server.model.js'),
    ProblemSchema = require('./problem.server.model.js'),
    IdentitySchema = require('./identity.server.model.js');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Advocate Schema
 */
var AdvocateSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name.']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name.']
  },
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your phone number'],
    match: [/[0-9]{7}/, 'Please fill a valid phone number'],
    required: true
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});


/**
 * Hook a pre save method to hash the password, and do user updating things
 * This is pretty nice to have in one spot!
 */
AdvocateSchema.pre('save', function(next) {

  this.fullName = this.firstName + ' ' + this.lastName;

  next();

});

mongoose.model('Advocate', AdvocateSchema);
