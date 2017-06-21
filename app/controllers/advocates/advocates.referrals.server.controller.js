'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  escapeRegExp = require('lodash.escaperegexp'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  twilioHandler = require('../../services/twilio.server.service.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant'),
  Advocate = mongoose.model('Advocate');

mongoose.Promise = require('q').Promise;

/**
 *  Validating an advocate code.
 *    Takes in an advocate code and
 *    Returns a promise
 *
 */
var validateCode = exports.validateCode = function(code) {

  var validated = Q.defer();

  // Advocate codes are case insensitive!
  Advocate.findOne({ code: { $regex: new RegExp('^' + escapeRegExp(code) + '$', 'i') } })
    .then(function (advocate) {

      // if(!advocate) {
      //   validated.reject(new Error("Invalid Access Code."));
      // } else {
      //   validated.resolve(advocate);
      // }

      // We're not gonna be opinionated here, I guess
      validated.resolve(advocate);

    })
    .catch(function (err) {
      console.log('error?', err);
      validated.reject(err);
    });

  return validated.promise;
};

exports.validateNewUser = function(req, res) {

  validateCode(req.query.code)
    .then(function (advocate) {

      if(advocate) {

        res.json({
          advocate: advocate._id,
          advocateRole: 'linked',
          referral: {                                   // this is just for display purposes
            email: advocate.email,
            contactPhone: advocate.contactPhone,
            contactPhoneExt: advocate.contactPhoneExt,
            organization: advocate.organization,
            name: advocate.fullName,
            code: advocate.code
          }
        });
      } else {
        res.json({ advocate: null, referral: null });
      }



    })
    .catch(function (err) {
      console.log(err);
      rollbar.handleError("Invalid Access Code", { code: req.query.code, error: err }, req);
      res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    });

};

exports.validateExistingUser = function(req, res) {

  // TODO

};

exports.linkToSupport = function(req, res, next) {

  var SUPPORT_CODE = 'justfixsupport';

  validateCode(SUPPORT_CODE)
    .then(function (advocate) {

      if(!advocate) {
        res.status(500).send({
          message: 'Error: No support advocate'
        });
      }
      req.body.advocateRole = 'linked';
      req.body.advocate = advocate._id;
      next();
    });
};

exports.sendReferralSMS = function(req, res) {

  var toCellNo = req.body.phone;
  var bodyStr = req.body.message;

  twilioHandler.sendSMSMessage(toCellNo, bodyStr)
    .then(function (message) {
      console.log('done', message);
      res.json({
        status: 'success'
      });
    })
    .catch(function (err) {
      console.log(err);
      rollbar.handleError("Twilio Error", { error: err }, req);
      res.status(500).send({
        message: 'Error with the Twilio SMS system.'
      });
    });


};
