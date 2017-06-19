// Twilio Integration
'use strict';

var _ = require('lodash'),
    Q = require('q'),
    request = require('request'), //for future use
    mongoose = require('mongoose'), //for future use
    twilio = require('twilio'),
    config = require('../../config/config');

mongoose.Promise = require('q').Promise;

//require the Twilio module and create a REST client
var client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

//Method to send a message to cell number "toCellNo" with message "bodyStr"
exports.sendSMSMessage = function(toCellNo, bodyStr) {

  var smsSent = Q.defer();

   client.messages.create({
       to: '+1' + toCellNo,
       from: config.twilio.twilioNumber,
       body: bodyStr,
   }, function(err, message) {
        if(err) {
          smsSent.reject(err);
        }
        smsSent.resolve(message);
   });

  return smsSent.promise;
};
