'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	authHandler = require('./users.authentication.server.controller'),
	Q = require('q'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	rollbar = require('rollbar'),
	Identity = mongoose.model('Identity'),
	User = mongoose.model('User'),
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

	// console.log(req.user);

	if(req.user) {

		User.findOne({ _userdata: req.user._userdata })
			.then(function (user) {
				return user.populate('_identity _userdata', '-salt -password').execPopulate();
			})
			.then(function (user) {
				var userdata = user._userdata;
				var identity = user._identity;

				// Merge existing user
				userdata = _.extend(userdata, req.body);
				userdata.updated = Date.now();

				userdata.save()
					.then(function (userdata) {
						return authHandler.formatUserForClient(identity, userdata);
					})
					.then(function (userObject) {

						// just to be clean
						user.depopulate('_userdata');
						user.depopulate('_identity');

						// login, serializes user
						req.login(user, function(err) {
							if (err) {
								updated.reject(err);
							} else {
								updated.resolve(userObject);
							}
						});
					})  // end of userdata.save
					.catch(function (err) {
						updated.reject(err);
					});
			})	// end of user.populate
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

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
