'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    addressHandler = require('../services/address.server.service'),
    ActivitySchema = require('./activity.server.model.js'),
    ProblemSchema = require('./problem.server.model.js');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (this.provider !== 'local' || (password && password.length > 6));
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

      // this will prevent users from creating accounts if anything is broken...
      return callback(false);
    });
};

/**
 * User Schema
 */
var UserSchema = new Schema({
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
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: '',
    validate: [validateGeoclientAddress, 'Your address was not found! Please try again.']
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
  // issues: {
  //   type: Schema.Types.Mixed,
  //   default: {}
  // },
  activity: [ActivitySchema],
  phone: {
    type: String,
    unique: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your phone number'],
    match: [/[0-9]{7}/, 'Please fill a valid phone number']
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
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
  referral: {
    type: Schema.Types.Mixed,
    default: {}
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
 * Hook a pre save method to hash the password, and do user updating things
 * This is pretty nice to have in one spot!
 */
UserSchema.pre('save', function(next) {


  this.fullName = this.firstName + ' ' + this.lastName;

  if (this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

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

      console.log('user', user);
      next();
    })
    .fail(function (e) {
      console.log('[GEO]', e);
      var err = new Error(e);
      next(err);
    });

});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

// UserSchema.methods.addToDo = function(title, step, addIf) {
//  var _this = this;

//  //console.log(_this);
//  _this.findById( _this._id, function(err, user) {
//    console.log(_this);

//    _this.toDoActions.push({
//      title: title,
//      step: step,
//      addIf: addIf
//    });

//    _this.save(function (err) {
//      if(err) throw new Error("something bad");
//    })
//  })
// };

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

mongoose.model('User', UserSchema);
