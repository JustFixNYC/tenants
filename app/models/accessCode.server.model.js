'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Access Code Schema
 */
var AccessCodeSchema = new Schema({
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
    default: 'dan@justfix.nyc'
  },
  code: {
    type: String,
    default: '111-111'
  }
});

var AccessCode = mongoose.model('AccessCode', AccessCodeSchema);

// Check if code ID is being used already -- if so, invalidate
AccessCodeSchema.pre('save', function(next) {
	var self = this;
	AccessCode.findOne({code: self.code}, function(err, user) {
		if(err) {
			next(err);
		} else if(user) {
			console.log('am i being called?');
			self.invalidate('code', 'code must be unique');
			next(new Error('code must be unique'));
		} else {
			next();
		}
	});
	
});

module.exports = AccessCode;