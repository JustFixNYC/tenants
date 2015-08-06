'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	activity = require('../../app/controllers/activity.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/activity')
		.get(activity.list)
    .post(users.requiresLogin, activity.create);
};