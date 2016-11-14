'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	Q = require('q'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Identity = mongoose.model('Identity'),
	config = require('../../../config/config'),
	// nodemailer = require('nodemailer'),
	// async = require('async'),
	crypto = require('crypto');

mongoose.Promise = require('q').Promise;


/**
 * Change Password
 */
exports.newTempPassword = function(req, res) {

	Identity.findOne({ phone: req.body.phone })
		.then(function (identity) {
			identity.password = config.tempPassword;
			return identity.save();
		})
		.then(function (identity) {
			res.send({
				message: 'Password changed successfully'
			});
		})
		.catch(function (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};




/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {

			Identity.findById(req.user._identity)
				.then(function (identity) {
					if (identity.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {

							identity.password = passwordDetails.newPassword;

							identity.save()
								.then(function (identity) {

									// just need req.user because only password (hidden) is changed
									req.login(req.user, function(err) {
										if (err) {
											res.status(400).send(err);
										} else {
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								})
								.catch(function (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								});

						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}

				})
				.catch(function (err) {
					res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				});

		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Verfiy password Password
 */
exports.verifyPassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;
	// console.log(passwordDetails);
	// console.log(req.user);

	Identity.findById(req.user._identity)
		.then(function (identity) {
			if (identity.authenticate(passwordDetails.password)) {
				res.send('message correct');
			} else {
				res.status(400).send({
					message: 'Current password is incorrect'
				});
			}
		})
		.catch(function (err) {
			res.status(400).send({
				message: 'User is not found'
			});
		});

}
