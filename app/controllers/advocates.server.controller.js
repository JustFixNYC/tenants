'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./advocates/advocates.authentication.server.controller')
	// require('./advocates/advocates.authorization.server.controller'),
	// require('./advocates/advocates.profile.server.controller')
);
