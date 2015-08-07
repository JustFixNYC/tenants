'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    actions = require('../../app/controllers/actions.server.controller');

module.exports = function(app) {
	app.route('/actions')
		.get(actions.list)
    .post(users.requiresLogin, actions.followUp);

};