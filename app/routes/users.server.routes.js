'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
// User Routes
var users = require('../../app/controllers/users.server.controller'),
		problems = require('../../app/controllers/problems.server.controller');

module.exports = function(app) {


	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
	app.route('/users/checklist').put(problems.updateActivitiesFromChecklist, users.update);
	app.route('/users/list').get(users.hasAuthorization(['admin']), users.list);
	//app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Public URLs
	app.route('/users/public').get(users.togglePublicView, users.update);
	app.route('/share/:key').get(function(req, res) {
    res.redirect('/#!/share?key=' + encodeURIComponent(req.params.key));
	});


	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/users/verify-password').post(users.verifyPassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(problems.updateActivitiesFromChecklist, users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
