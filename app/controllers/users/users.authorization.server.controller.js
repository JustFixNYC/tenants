'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {

	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};


/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				// [TODO] reset this.
				/*return res.status(403).send({
					message: 'User is not authorized'
				});*/
				return next();
			}
		});
	};
};


/**
 * User public view routing middleware
 */
exports.hasPublicView = function(req, res, next) {

	// allow for either /:key or ?key=
	var key = req.params.key || req.query.key;

	User.findOne({
		'sharing.key' : key
	}).exec(function(err, user) {
		if (err) {
			return res.status(500).send({ message: 'Error in checking authorization' });
		}
		else if(!user || !user.sharing.enabled) {
			// [TODO] make this an adequate response page
			return res.status(401).send({ message: 'Unauthorized request.' });
		}
		else {
			req.tempUser = {
				fullName: user.fullName,
				phone: user.phone,
				activity: user.activity
			};
			next();
		}
	});

};
