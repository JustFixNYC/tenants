'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	activity = require('../../app/controllers/activity.server.controller'),
  multipart = require('connect-multiparty'),
  multipartMiddleware = multipart();
  //multer = require('multer');
  // upload = require('multer')({
  //   dest: 'uploads/',
  //   //inMemory: true
  // });

module.exports = function(app) {
	// Article Routes
	app.route('/activity')
		.get(activity.list)
    //.post(users.requiresLogin, upload.array('photos'), activity.create);
    .post(users.requiresLogin, multipartMiddleware, activity.create);

	app.route('/activity/public').get(users.hasPublicView, function(req, res) {
		res.json(req.tempUser);
	});
};
