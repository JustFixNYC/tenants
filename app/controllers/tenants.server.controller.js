'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./tenants/tenants.authentication.server.controller'),
	require('./tenants/tenants.authorization.server.controller'),
	require('./tenants/tenants.profile.server.controller')
);
