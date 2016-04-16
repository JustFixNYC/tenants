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
    newReferral.totalUsers = numCodes;
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


var search = function(query) {

  var deferred = Q.defer();

  // just for convinience - allows you to do ?code= instead of ?codes=
  if(query.code) {
    query.codes = query.code;
    delete query.code;
  }

	Referral.find(query, function(err, referrals) {
		if(err) {
      deferred.reject(err);
		} else {
			deferred.resolve(referrals);
		}
	});

  return deferred.promise;
};

exports.list = function(req, res) {

  search(req.query)
    .then(function(referrals) {
      res.json(referrals);
    }).fail(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

exports.validate = function(req, res) {

  // limit query to just code for security
  var query = { code: req.query.code };

  search(query)
    .then(function(r) {
      if (r.length > 1) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage("Multiple referrals for a single code - this shouldn't happen.")
        });
      } else if (r.length == 0) {
        res.json({ referral: null });
      } else {

        var newReferral = {
          email: r[0].email,
          phone: r[0].phone,
          organization: r[0].organization,
          name: r[0].name,
          code: req.query.code
        };

        // remove used code
        Referral.findOneAndUpdate({ _id: r[0]._id }, { $pull: { "codes" : req.query.code } },
          function(err, referral) {
            if(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json({ referral: newReferral });
            }
          });
      }
    }).fail(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
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
