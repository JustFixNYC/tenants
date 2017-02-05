'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  tenantHandler = require('../tenants.server.controller.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity'),
  Tenant = mongoose.model('Tenant'),
  Advocate = mongoose.model('Advocate');

mongoose.Promise = require('q').Promise;

exports.createNewTenant = function(req, res) {

  var tenant = new Tenant(req.body);

  tenant.advocateRole = 'managed';
  tenant.advocate = req.user._userdata;
  tenant.updated = Date.now();

  tenantHandler.buildNewTenant(tenant, req.user)
    .then(function (tenant) {

      console.log('tenant?', tenant);
      // console.log(tenant.save() instanceof require('q').makePromise)
      tenant.save(function (err) {
        if (err) console.log(err);
        console.log('saved');
      // saved!
      });



    });
    // .then(function (tenant) {
    //   res.json(tenant);
    //   res.end();
    // })
    // .catch(function (err) {
    //   rollbar.handleError(errorHandler.getErrorMessage(err), req);
    //   res.status(400).send(errorHandler.getErrorMessage(err));
    // });

};


exports.listTenants = function(req, res) {

  Tenant.find({ advocate: req.user._userdata })
    .then(function (tenants) {

      tenants = _.map(tenants, function(t) {

        if(t.advocateRole !== 'managed') {
          t.activity = undefined;
          t.actionFlags = undefined;
          t.followUpFlags = undefined;
          t.problems = undefined;
        }
        // else if (t.advocateRole === 'none') {
        //   rollbar.handleError("Tenant/advocate mismatch", req);
        //   res.status(500).send({ message: "This shouldn\'t happen." });
        // }
        
        return t;

      });

      // console.log(tenants);
      res.json(tenants);
      res.end();
    })
    .catch(function (err) {
      rollbar.handleError("Error in finding advocate\'s tenants", req);
      res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    });

  //
  // Tenants.find({ advocate: })
};

exports.updateManagedTenant = function(req, res) {

  var tenant = res.locals.tenant;

  // console.log(tenant);

  if(!tenant) {
    rollbar.handleError("This shouldn't happen", req);
    res.status(400).send({ message: errorHandler.getErrorMessage("This shouldn't happen") });
  } else {

    tenant = _.extend(tenant, req.body);
    tenant.updated = Date.now();

    // console.log(tenant);

    tenant.save()
      .then(function (tenant) {
        res.json(tenant);
        res.end(); // important to update session
      })
      .catch(function (err) {
        rollbar.handleError("Error updating tenant info", req);
        res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			});
  }
  //
  // Tenant.find({ advocate: req.user._userdata })
  //   .then(function (tenants) {
  //
  //     tenants = _.map(tenants, function(t) {
  //
  //       if(t.advocateRole !== 'managed') {
  //         t.activity = undefined;
  //         t.actionFlags = undefined;
  //         t.followUpFlags = undefined;
  //         t.problems = undefined;
  //       }
  //       // else if (t.advocateRole === 'none') {
  //       //   rollbar.handleError("Tenant/advocate mismatch", req);
  //       //   res.status(500).send({ message: "This shouldn\'t happen." });
  //       // }
  //
  //       return t;
  //
  //     });
  //
  //     // console.log(tenants);
  //     res.json(tenants);
  //     res.end();
  //   })
  //   .catch(function (err) {
  //     rollbar.handleError("Error in finding advocate\'s tenants", req);
  //     res.status(400).send({ message: errorHandler.getErrorMessage(err) });
  //   });

};
