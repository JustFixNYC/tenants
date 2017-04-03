'use strict';

/**
 * Module dependencies.
 */
var acuityService = require('../../app/services/acuity.server.service'),
    scheduling = require('../../app/controllers/scheduling.server.controller'),
    users = require('../../app/controllers/users.server.controller'),
    advocates = require('../../app/controllers/advocates.server.controller');

module.exports = function(app) {
	app.route('/api/acuity')
		.get(acuityService.getUsersApptInfo)
    .post(acuityService.verifyMiddleware,
          acuityService.getApptInfo,
          advocates.linkToSupport,
          scheduling.bookDate);
};
