'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
  AutoLogin = require('mongoose').model('AutoLogin');

module.exports = function() {
	// Use local strategy
	passport.use('auto-local', new LocalStrategy({
			usernameField: 'key',
			passwordField: 'key'
		},
		function(_, key, done) {
      AutoLogin.findOne({
        key: key
      }, function(err, autoLogin) {
        if (err) {
          return done(err);
        }
        if (!autoLogin) {
          return done(null, false, {
            message: 'key not found'
          });
        }

        autoLogin.consumeAndGetIdentity().then(identity => {
          done(null, identity);
        }).catch(done);
      });
		}
	));
};
