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
 * A Validation function for address geolocation
 */
var validateGeoclientAddress = function(address, callback) {

  addressHandler.requestGeoclient(this.borough, address)
    .then(function (geo) {
      return callback(true);
    })
    .fail(function (e) {
      console.log('[Geoclient Validation]', e);
      rollbar.handleError(e);
      // this will prevent users from creating accounts if anything is broken...
      return callback(false);
    });
};

/**
 * Tenant Schema
 */
var TenantSchema = new Schema({
  // referral: {
  //   type: Schema.Types.Mixed,
  //   default: {}
  // },
  advocate: {
    type: Schema.Types.ObjectId,
    ref: 'Advocate'
  },
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
  borough: {
    type: String,
    default: '',
    required: true
  },
  address: {
    type: String,
    trim: true,
    default: '',
    validate: [validateGeoclientAddress, 'Your address was not found! Please try again.'],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  geo: {
    type: Schema.Types.Mixed,
    default: {}
  },
  actionFlags: [{
    type: String,
    default: []
  }],
  followUpFlags: [{
    key: {
      type: String,
      default: []
    },
    startDate: {
      type: Date,
      default: Date.now
    }
  }],
  problems: [ProblemSchema],
  activity: [ActivitySchema],
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
  },
  sharing: {
    enabled: {
      type: Boolean,
      default: false
    },
    key : {
      type : String,
      default: ''
    }
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});


/**
 * Only query geoclient if its detected that address has changed
 */
TenantSchema.path('address').set(function (newVal) {

  if (this.address == '' || this.address != newVal) {
    this._addressChanged = true;
  }
  return newVal;
});


/**
 * Hook a pre save method to hash the password, and do user updating things
 * This is pretty nice to have in one spot!
 */
TenantSchema.pre('save', function(next) {


  this.fullName = this.firstName + ' ' + this.lastName;

  var userProblems = [];
  // go through all issues and problems
  // check to see if the user has:
  // - selected emergency issues, or not
  // - completed details for all issues, or not
  // - if the user hasn't selected any issues

  if(this.problems.length == 0) {
    _.pull(this.actionFlags, 'hasProblems');
  } else if(!_.contains(this.actionFlags, 'hasProblems')) {
    this.actionFlags.push('hasProblems');
  }

  for(var i = 0; i < this.problems.length; i++) {
    var problem = this.problems[i];
    userProblems.push(problem.key);
    // userIssues[problem.key] = problem.issues;

    for(var j = 0; j < problem.issues.length; j++) {

      if(problem.issues[j].emergency && !_.contains(this.actionFlags, 'hasEmergencyIssues')) {
        this.actionFlags.push('hasEmergencyIssues');
      }
    }
  }

  // check is everything in userProblems is in actionFlags
  if(_.intersection(userProblems, this.actionFlags).length == userProblems.length) {
    if(!_.contains(this.actionFlags, 'allInitial')) this.actionFlags.push('allInitial');
  } else {
    _.pull(this.actionFlags, 'allInitial');
  }

  // check NYCHA housing
  // if(user.nycha === 'yes') user.actionFlags.push('isNYCHA');

  // check some address stuff
  if(!this._addressChanged) {
    next();
  } else {

    console.log('ADDR CHANGED');

    this._addressChanged = false;
    var user = this;

    addressHandler.requestGeoclient(this.borough, this.address)
      .then(function (geo) {
        user.geo = geo;
        // check for tenant harassment hotline
        if(addressHandler.harassmentHelp(user.geo.zip)) user.actionFlags.push('isHarassmentElligible');
        return addressHandler.requestRentStabilized(geo.bbl, geo.lat, geo.lon);
      })
      .then(function (rs) {
        if(rs) user.actionFlags.push('isRentStabilized');
        next();
      })
      .fail(function (e) {
        console.log('[GEO]', e);
        rollbar.handleError(e);
        var err = new Error(e);
        next(err);
      });
  }


});

mongoose.model('Tenant', TenantSchema);
