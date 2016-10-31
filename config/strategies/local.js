'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'phone',
			passwordField: 'password'
		},
		function(phone, password, done) {
			User.findOne({
				phone: phone
			},
			function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Sorry! This phone number was not found. Check that you are using the same one you used to register'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Wrong password - remember that they are case sensitive!'
					});
				}

				return done(null, user);
			});
		}
	));
};
