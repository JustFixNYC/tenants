'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
// User Routes
var users = require('../../app/controllers/users.server.controller'),
		tenants = require('../../app/controllers/tenants.server.controller'),
		problems = require('../../app/controllers/problems.server.controller');

module.exports = function(app) {

	// Setting up the users profile api
	// app.route('/api/users/me').get(users.me);
	// app.route('/api/users').put(users.updateUserData);
	// app.route('/api/users/checklist').put(problems.updateActivitiesFromChecklist, users.updateUserData);

	// Public URLs
	// app.route('/api/users/public').get(users.togglePublicView, users.updateUserData);

	// Updating the users phone number
	// app.route('/api/users/phone').put(users.updatePhoneNumber);

	// Setting up the users password api
	// app.route('/api/users/password').post(users.changePassword);
	// app.route('/api/users/verify-password').post(users.verifyPassword);
	// app.route('/api/auth/temp-password').post(users.hasAuthorization(['admin']), users.newTempPassword);

	// Setting up the users authentication api
	app.route('/api/tenants/signup').post(problems.updateActivitiesFromChecklist, tenants.signup);
	// app.route('/api/auth/signin').post(users.signin);
	// app.route('/api/auth/signout').get(users.signout);

};
