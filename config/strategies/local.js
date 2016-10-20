'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	// User = require('mongoose').model('User');
	Identity = require('mongoose').model('Identity');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'phone',
			passwordField: 'password'
		},
		function(phone, password, done) {
			Identity.findOne({
				phone: phone
			},
			function(err, identity) {
				if (err) {
					return done(err);
				}
				if (!identity) {
					return done(null, false, {
						message: 'Sorry! This phone number was not found. Check that you are using the same one you used to register'
					});
				}
				if (!identity.authenticate(password)) {
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}

				return done(null, identity);
			});
		}
	));
};
