'use strict';

/**
 * Module dependencies.
 */
var cors = require('cors'),
		data = require('../../app/controllers/data.server.controller');

// need to include the options field here for cors as the POST request is json,
// which forces a preflight check.

module.exports = function(app) {
	app.route('/api/data/bblslookup')
		.options(cors())
		.post(data.bblsLookup);

};
