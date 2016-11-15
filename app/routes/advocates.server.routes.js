'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
// User Routes
var users = require('../../app/controllers/users.server.controller'),
		advocates = require('../../app/controllers/advocates.server.controller');

module.exports = function(app) {

	// Setting up the users profile api
	// app.route('/api/users/me').get(users.me);
	// app.route('/api/users').put(users.updateUserData);

	// Setting up the users authentication api
	app.route('/api/advocates/signup').post(advocates.signup);
	// app.route('/api/auth/signin').post(users.signin);
	// app.route('/api/auth/signout').get(users.signout);

};
