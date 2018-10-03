'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AutoLoginSchema = new Schema({
  key: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
  }
});

AutoLoginSchema.methods.consumeAndGetIdentity = function() {
  return mongoose.models['Identity'].findOne({ phone: this.phone }).then((id) => {
    if (id === null) {
      throw new Error('identity with phone number not found');
    }
    return this.remove().then(() => { return id; });
  });
};

mongoose.model('AutoLogin', AutoLoginSchema);
