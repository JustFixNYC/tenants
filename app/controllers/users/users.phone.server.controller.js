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
	User = mongoose.model('User'),
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

		// Get identity
		Identity.findOne({ _id: req.user._identity })
			.then(function (identity) {

				// Update identity phone
				identity.phone = req.body.phone;
				identity.updated = Date.now();

				return identity.save();
			})
			.then(function (identity) {

				// need the User document to pass back to req.login (serialize)
				// as well as get the userdata without needing to know which model it is
				User.findOne({ _identity: identity._id })
					.then(function (user) {

						// Get userdata (agnostic) to update phone there
						user.populate('_userdata')
							.execPopulate()
							.then(function (user) {

								// remember that this doesn't return the userdata, but the populated user
								user._userdata.phone = req.body.phone;
								user._userdata.updated = Date.now();

								// save just the userdata document
								return user._userdata.save();
							})
							.then(function (userdata) {

								// build new userObject
								var userObject =  authHandler.formatUserForClient(identity, userdata);

								// just to be clean
								user.depopulate('_userdata');

								// login, serializes user
								req.login(user, function(err) {
									if (err) {
										updated.reject(err);
									} else {
										updated.resolve(userObject);
									}
								});

							});
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
