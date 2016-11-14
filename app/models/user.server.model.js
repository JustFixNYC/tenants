'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    rollbar = require('rollbar');

/**
 * User Schema
 */
var UserSchema = new Schema({
  _identity: {
    type: Schema.Types.ObjectId,
    ref: 'Identity'
  },
  _userdata: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  // updated: {
  //   type: Date
  // },
  created: {
    type: Date,
    default: Date.now
  }
});


/**
 * Hook a pre save method to hash the password, and do user updating things
 * This is pretty nice to have in one spot!
 */
// UserSchema.pre('save', function(next) {
//
// });


//
// /**
//  * Create instance method for hashing a password
//  */
// UserSchema.methods.hashPassword = function(password) {
//   if (this.salt && password) {
//     return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
//   } else {
//     return password;
//   }
// };
//
// /**
//  * Create instance method for authenticating user
//  */
// UserSchema.methods.authenticate = function(password) {
//   return this.password === this.hashPassword(password);
// };


mongoose.model('User', UserSchema);
