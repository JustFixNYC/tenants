'use strict';

var referrals = require('../controllers/referrals.server.controller'),
		users = require('../controllers/users.server.controller');


module.exports = function(app) {
	app.route('/referrals')
		.get(users.hasAuthorization(['admin']), referrals.list)
		.post(users.hasAuthorization(['admin']), referrals.create)
		.delete(users.hasAuthorization(['admin']), referrals.remove);

	app.route('/referrals/validate').get(referrals.validate);
};
