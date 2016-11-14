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

/**
 * Update user details
 *
 */
var updateUser = function(req) {

	var updated = Q.defer();

	// Init Variables
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if(req.user) {

		Tenant.findOne({ _id: req.user._id })
			.then(function (tenant) {

				// Merge existing user
				tenant = _.extend(tenant, req.body);
				tenant.updated = Date.now();

				return tenant.save();
			})
			.then(function (tenant) {

				var user = _.extend(req.user, tenant.toObject());
				console.log('updated', user);

				// login, serializes user
				req.login(user, function(err) {
					if (err) {
						updated.reject(err);
					} else {
						updated.resolve(user);
					}
				});
			})
			.catch(function (err) {
				updated.reject(err);
			});


	} else {
		updated.reject('User is not signed in');
	}

	return updated.promise;
};


exports.updateUserData = function(req, res) {

	updateUser(req)
		.then(function (user) {
			res.json(user);
			res.end(); // important to update session
		})
		.catch(function (err) {
			rollbar.handleError(errorHandler.getErrorMessage(err), req);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

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
    if(referrals.length) makeNewUrl(deferred);
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
 *  Return all users. This probably shouldn't be here - using authorization middleware
 */
// exports.list = function(req, res) {
// 	User.find({}, function(err, users) {
// 		if(err) {
// 			res.status(400).send(err);
// 		} else {
// 			res.json(users);
// 		}
// 	});
// };


/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
