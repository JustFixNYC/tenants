'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();

		// check issues for emergency ones
	  for(var area in user.issues) {
	    user.issues[area].forEach(function (i) {
	      if(i.emergency && user.actionFlags.indexOf('hasEmergencyIssues') === -1) {
	        user.actionFlags.push('hasEmergencyIssues');
	      }
	    });
	  }

    var allInitial = true;
    // for every area in issues
    for(var area in user.issues) {
      // if the area has issues...
      if(user.issues[area].length) {
        // if the area content hasn't been done yet
        if(user.actionFlags.indexOf(area) === -1) allInitial = false;
      }
    }
    if(!allInitial && _.contains(user.actionFlags, 'allInitial')) _.pull(user.actionFlags, 'allInitial');

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.list = function(req, res) {
	User.find({}, function(err, users) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.json(users);
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
