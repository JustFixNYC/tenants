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
 * Update phone number
 * Tricky b/c this is shared by both tenant and identity models
 *
 */
var updatePhoneNumber = function(req) {

	var updated = Q.defer();

	// Init Variables
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if(req.user) {

		Tenant.findOne({ _id: req.user._id })
			.then(function (tenant) {

				// Update tenant phone
				tenant.phone = req.body.phone;
				tenant.updated = Date.now();

				return tenant.save();
			})
			.then(function (tenant) {

				// Get identity
				return Identity.findOne({ _id: req.user._identity });
			})
			.then(function (identity) {

				// Update identity phone
				identity.phone = req.body.phone;
				identity.updated = Date.now();

				return identity.save();
			})
			.then(function (identity) {

				// And finally...
				req.user.phone = req.body.phone;

				// login, serializes user
				req.login(req.user, function(err) {
					if (err) {
						updated.reject(err);
					} else {
						console.log(req.user);
						updated.resolve(req.user);
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


exports.updatePhoneNumber = function(req, res) {

	updatePhoneNumber(req)
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
