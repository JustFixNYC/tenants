'use strict';

var controller = require('../controllers/accessCode.server.controller');

module.exports = function(app) {
	app.route('/access-code')
		.get(controller.get)
		.post(controller.save);
};