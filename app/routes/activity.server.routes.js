'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
		tenants = require('../../app/controllers/tenants.server.controller'),
		activity = require('../../app/controllers/activity.server.controller'),
  	multipart = require('connect-multiparty'),
  	// multipartMiddleware = multipart({ maxFieldsSize: 4 * 1024 * 1024 });
  	multipartMiddleware = multipart();
	// raising max to 4mb for higher-end smartphone
  //multer = require('multer');
  // upload = require('multer')({
  //   dest: 'uploads/',
  //   //inMemory: true
  // });

module.exports = function(app) {
	// Article Routes
	app.route('/api/activity')
		.get(users.requiresLogin, activity.list)
    //.post(users.requiresLogin, upload.array('photos'), activity.create);
    .post(users.requiresLogin, multipartMiddleware, activity.create, users.updateUserData);

	app.route('/api/activity/public').get(tenants.hasPublicView, function(req, res) {
		res.json(req.tempUser);
	});
};
