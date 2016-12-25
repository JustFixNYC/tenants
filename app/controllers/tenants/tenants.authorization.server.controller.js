'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	rollbar = require('rollbar'),
	Identity = mongoose.model('Identity'),
	Tenant = mongoose.model('Tenant');

mongoose.Promise = require('q').Promise;

/**
 * User public view routing middleware
 */
exports.hasPublicView = function(req, res, next) {

  // allow for either /:key or ?key=
  var key = req.params.key || req.query.key;

  Tenant.findOne({ 'sharing.key' : key })
    .then(function (tenant) {
      // if there is a logged in, admin user OR if the tenant has sharing enabled
      if( (req.user && _.intersection(req.user.roles, ['admin']).length) || tenant.sharing.enabled ) {
    		req.tempUser = {
    			fullName: tenant.fullName,
    			phone: tenant.phone,
					address: tenant.address,
					unit: tenant.unit,
					borough: tenant.borough,
					gro: tenant.geo,
    			activity: tenant.activity
    		};
    		next();
    	} else {
    		// [TODO] make this an adequate response page
    		rollbar.handleError('Unauthorized request', req);
    		return res.status(403).send({ message: 'Unauthorized request.' });
    	}
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500).send({ message: 'Error in checking authorization' });
    });

};
