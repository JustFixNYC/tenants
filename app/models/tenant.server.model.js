'use strict';

/**
 * Module dependencies.
 */
var Q = require('q'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    addressHandler = require('../services/address.server.service'),
    rollbar = require('rollbar'),
    ActivitySchema = require('./activity.server.model.js'),
    ProblemSchema = require('./problem.server.model.js'),
    IdentitySchema = require('./identity.server.model.js');

mongoose.Promise = require('q').Promise;

// mongoose.set('debug', true);

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for phone numbers
 * They should only be digits and only have 10 characters
 */
var validatePhone = function(property) {
  if(!property.length) return false;
  else return /^[0-9]{10}$/.test(property);
};

/**
 * A Validation function for address geolocation
 */
var validateGeoclientAddress = function(address, callback) {

  if(!_.isEmpty(this.geo)) {      // this was just for migration purposes
    return callback(true);
  } else {

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
  }
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
  advocateRole: {
    type: String,
    enum: ['linked', 'managed', 'none'],
    default: 'none'
  },
  currentAcuityEventId: {
    type: String,
    trim: true,
    default: ''
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
    validate: [validateGeoclientAddress, 'Your address was not found! Make sure that your apartment number is separated from your street address.'],
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
    default: ''
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

  if (this.address === '' || this.address !== newVal) {
    this._addressChanged = true;
  }
  return newVal;
});

TenantSchema.path('phone').validate(function (value, done) {

  var _this = this;

  mongoose.models['Tenant'].findOne({ phone: value }, function(err, tenant) {
      if(err) {
          done(err);
      } else if(tenant && !tenant._id.equals(_this._id)) {
          _this.invalidate("phone", "Phone number is already registered!");
          done(new Error("Phone number is already registered!"));
      } else {
          done();
      }
  });
});

/**
 * Can call this to perform additional functions after its populated as userdata
 */
TenantSchema.methods.build = function() {

  var built = Q.defer();
  var _this = this;

  // populate advocate information
  if(this.advocate) {
    this.populate({
        path: 'advocate',
        select: '-phone -firstName -lastName -created'
      })
      .execPopulate()
      .then(function (populatedTenant) {
        _this.advocate = populatedTenant.advocate;
        built.resolve(_this);
      })
      .catch(function (err) {
        built.reject(err);
      });
  } else {
    built.resolve(this);
  }

  // built.resolve();

  return built.promise;
};

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
  // - has a scheduled appointment



  if(this.problems.length === 0) {
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
  if(_.intersection(userProblems, this.actionFlags).length === userProblems.length) {
    if(!_.contains(this.actionFlags, 'allInitial')) this.actionFlags.push('allInitial');
  } else {
    _.pull(this.actionFlags, 'allInitial');
  }

  if(this.advocateRole === 'none' && this.currentAcuityEventId === '' && !_.contains(this.actionFlags, 'scheduleLater')) {
    this.actionFlags.push('scheduleLater');
  }


  // check NYCHA housing
  // if(user.nycha === 'yes') user.actionFlags.push('isNYCHA');

  // check some address stuff
  if(!this._addressChanged || !_.isEmpty(this.geo)) {
    next();
  } else {

    // console.log('ADDR CHANGED');

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

TenantSchema.pre('save', function(next) {
  if (_.isEmpty(this.geo)) {
    return next();
  }

  this.constructor.findOne({
    _id: { $ne: this._id },
    'geo.bbl': this.geo.bbl
  }, (err, doc) => {
    if (err) return next(err);
    if (doc !== null) {
      if (this.actionFlags.indexOf('hasNeighbors') === -1) {
        this.actionFlags.push('hasNeighbors');
      }
    }
    next();
  });
});

mongoose.model('Tenant', TenantSchema);
