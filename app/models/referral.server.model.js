'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Referral Schema
 */
var ReferralSchema = new Schema({
	name: {
    type: String,
    default: 'JustFixNYC'
  },
  organization: {
    type: String,
    default: 'Community Group'
  },
  phone: {
    type: Number,
    default: 7777777777
  },
  email: {
    type: String,
    default: 'hello@justfix.nyc'
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    default: ''
  },
  inUse: {
    type: Number,
    default: 0
  }
});

var Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;
