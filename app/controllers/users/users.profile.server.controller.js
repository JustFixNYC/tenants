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

/**
 * Update user details
 */
exports.updateTenantUser = function(req, res) {

	// Init Variables
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if(req.user) {

		Tenant.findOne({ _id: req.user._id }, function(err, tenant) {

			if (!err) {
				// Merge existing user
				tenant = _.extend(tenant, req.body);
				tenant.updated = Date.now();

				// Save tenant
				tenant.save(function(err) {
					if (!err) {
						req.login(user, function(err) {
							if (err) {
								rollbar.handleError(err, req);
								res.status(400).send(err);
							} else {
								res.json(user);
								res.end(); // important to update session
							}
						});
					} else {																														// error w tenant.save
						rollbar.handleError(errorHandler.getErrorMessage(err), req);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});
			} else {																																// error w tenant.findOne
				rollbar.handleError(errorHandler.getErrorMessage(err), req);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
		} else {
			res.status(400).send({
				message: 'User is not signed in'
			});
		}

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
  User.find({ 'sharing.key': newUrl }, function(err, referrals) {
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
