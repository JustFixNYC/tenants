'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Q = require('q'),
    Referral = mongoose.model('Referral');

var PARTS = 2;
var PART_LENGTH = 4;
var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

var makeNewCode = function(deferred) {

  if(!deferred) var deferred = Q.defer();

  // generate rando code
  var code = '';
  for(var i = 0; i < PARTS; i++) {
    for(var j = PART_LENGTH; j > 0; --j) code += CHARS[Math.floor(Math.random() * CHARS.length)];
    if(i+1 != PARTS) code += '-';
  }

  // check if code already exists
  Referral.find({ codes: code }, function(err, referrals) {
    if(referrals.length) makeNewCode(deferred);
    else deferred.resolve(code);
  });

  return deferred.promise;
};


exports.create = function(req, res) {

  var newReferral = new Referral(req.body);
  var numCodes = parseInt(req.body.numCodes);
  var codePromises = [];

  // create a promise for each new code
  for(var i = 0; i < numCodes; i++) { codePromises.push(makeNewCode()); }

  // create all codes then store the new referral
  Q.all(codePromises).then(function (codes) {
    newReferral.codes = codes;
    newReferral.save(function (err, referral) {
      if(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(referral);
      }
    });

  });
};

exports.list = function(req, res) {

  // just for convinience - allows you to do ?code= instead of ?codes=
  if(req.query.code) {
    req.query.codes = req.query.code;
    delete req.query.code;
  }

	Referral.find(req.query, function(err, referrals) {
		if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
		} else {
			res.json(referrals);
		}
	});
};

exports.remove = function(req, res) {

  if(!req.query.id) {
    return res.status(400).send({ message: errorHandler.getErrorMessage('No referral ID given.') });
  }

  Referral.remove({ _id: req.query.id }, function(err) {
    if(err) {
			res.status(400).send({ message: errorHandler.getErrorMessage('Problem with deleting a referral:', req.query.id) });
		} else {
      res.json({ message: 'Referral deleted.' });
    }
  });
};
