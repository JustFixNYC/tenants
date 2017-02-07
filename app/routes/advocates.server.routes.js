'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
// User Routes
var users 		= require('../../app/controllers/users.server.controller'),
		advocates = require('../../app/controllers/advocates.server.controller'),
		problems = require('../../app/controllers/problems.server.controller'),
		activity = require('../../app/controllers/activity.server.controller'),
		multipart = require('connect-multiparty'),
		// multipartMiddleware = multipart({ maxFieldsSize: 4 * 1024 * 1024 });
		multipartMiddleware = multipart();

module.exports = function(app) {

	// Setting up the users profile api
	// app.route('/api/users/me').get(users.me);
	// app.route('/api/users').put(users.updateUserData);

	// Setting up the users authentication api
	app.route('/api/advocates/signup').post(advocates.signup);
	// app.route('/api/auth/signin').post(users.signin);
	// app.route('/api/auth/signout').get(users.signout);

	app.route('/api/advocates/validate/new').get(advocates.validateNewUser);

	app.route('/api/advocates').get(users.hasAuthorization(['advocate']), advocates.listTenants);

	app.route('/api/advocates/tenants/create').post(users.hasAuthorization(['advocate']), problems.updateActivitiesFromChecklist, advocates.createNewTenant);

	app.route('/api/advocates/tenants/:id').post(users.hasAuthorization(['advocate']), advocates.isManagedTenant, multipartMiddleware, activity.create, advocates.updateManagedTenant);
	app.route('/api/advocates/tenants/:id/checklist').put(users.hasAuthorization(['advocate']), advocates.isManagedTenant, problems.updateActivitiesFromChecklist, advocates.updateManagedTenant);


};
