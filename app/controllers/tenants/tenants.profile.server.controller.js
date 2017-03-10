'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	Q = require('q'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	rollbar = require('rollbar'),
	// User = mongoose.model('User');
	Identity = mongoose.model('Identity'),
	Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

var makeNewURL = function(deferred) {

  if(!deferred) var deferred = Q.defer();

	var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var URL_LENGTH = 10;

  // generate rando code
  var newUrl = '';
  for(var j = URL_LENGTH; j > 0; --j) newUrl += CHARS[Math.floor(Math.random() * CHARS.length)];

	// console.log(newUrl);

  // check if url already exists
  Tenant.find({ 'sharing.key': newUrl }, function(err, referrals) {
    if(referrals.length) makeNewURL(deferred);
    else deferred.resolve(newUrl);
  });

  return deferred.promise;
};


exports.createPublicView = function() {

 	var deferred = Q.defer();

	makeNewURL().then(function (newUrl) {
		deferred.resolve(newUrl);
	});

	return deferred.promise;
};


/**
 * Toggle user public view
 */
exports.togglePublicView = function(req, res, next) {

	var user = req.user;

	if(user) {

		var _sharing = user.sharing;


		// because the key is made on signup, this first case should never happen
		if(!_sharing.enabled && !_sharing.key) {			// key doesn't exist
			_sharing.enabled = true;
			makeNewURL().then(function (newUrl) {
				_sharing.key = newUrl;
				req.body = { sharing: _sharing };
				next();
			});
		} else if(!_sharing.enabled) {									// key already exists
			_sharing.enabled = true;
			req.body = { sharing: _sharing };
			next();
		}	else {																			// disable but keep key
			_sharing.enabled = false;
			req.body = { sharing: _sharing };
			next();
		}

	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 *  Add Acuity booking id for later reference.
 *	Also link this tenant acct to our support staff dashboard.
 */
exports.scheduleEvent = function(req, res, next) {

	if(!req.body.currentAcuityEventId) {
		res.status(500).send({
			message: 'Error: No acuity event ID'
		});
	} else {
		next();
	}

};
