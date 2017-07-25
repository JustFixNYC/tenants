'use strict';

/**
 * Module dependencies.
 */
var data = require('../../app/controllers/data.server.controller');

module.exports = function(app) {
	app.route('/api/data/bblslookup')
		.post(data.bblsLookup);

};
