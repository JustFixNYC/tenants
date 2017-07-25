'use strict';

/**
 * Module dependencies.
 */
var cors = require('cors'),
		data = require('../../app/controllers/data.server.controller');

module.exports = function(app) {
	app.route('/api/data/bblslookup')
		.options(cors())
		.post(data.bblsLookup);

};
