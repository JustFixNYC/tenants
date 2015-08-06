'use strict';

/**
 * Module dependencies.
 */
var actions = require('../../app/controllers/actions.server.controller');

module.exports = function(app) {
	app.route('/actions')
		.get(actions.list);
};