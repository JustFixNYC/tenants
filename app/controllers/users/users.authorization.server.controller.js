'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	rollbar = require('rollbar'),
	// User = mongoose.model('User'),
	Tenant = mongoose.model('Tenant');

/**
 * User middleware
 */
// exports.userByID = function(req, res, next, id) {
// 	User.findOne({
// 		_id: id
// 	}).exec(function(err, user) {
// 		if (err) return next(err);
// 		if (!user) return next(new Error('Failed to load User ' + id));
// 		req.profile = user;
// 		next();
// 	});
// };

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
				rollbar.handleError('User is not authorized', req);
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};


/**
 * User public view routing middleware
 */
exports.hasPublicView = function(req, res, next) {

	var _this = this;

	// allow for either /:key or ?key=
	var key = req.params.key || req.query.key;

	Tenant.findOne({
		'sharing.key' : key
	}).exec(function(err, user) {
		if (err || !user) {
			return res.status(500).send({ message: 'Error in checking authorization' });
		// allow admins to view all
		} else if( (req.user && _.intersection(req.user.roles, ['admin']).length) || user.sharing.enabled ) {
			req.tempUser = {
				fullName: user.fullName,
				phone: user.phone,
				activity: user.activity
			};
			next();
		} else {
			// [TODO] make this an adequate response page
			rollbar.handleError('Unauthorized request', req);
			return res.status(403).send({ message: 'Unauthorized request.' });
		}
	});

};
