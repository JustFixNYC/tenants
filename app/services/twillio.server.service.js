// Twilio Integration
'use strict';

var _ = require('lodash'),
    Q = require('q'),
    request = require('request'), //for future use
    mongoose = require('mongoose'), //for future use
    config = require('../../config/config');


//require the Twilio module and create a REST client
var client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

//Method to send a message to cell number "toCellNo" with message "bodyStr"
var sendMessage = exports.sendMessage = function(toCellNo, bodyStr){
   client.messages.create({
       to: toCellNo,
       from: config.twilio.twilioNumber,
       body: bodyStr,
   }, function(err, message) {
       console.log("error while sending message from twilio number");
   });
 };
