'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	actions = require('../../app/controllers/actions.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/actions')
		.get(actions.list);

	// Finish by binding the article middleware
	//app.param('articleId', articles.articleByID);
};