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

  tenantHandler.buildNewTenant(tenant)
    .then(function (tenant) {
      return tenant.save();
    })
    .then(function (tenant) {
      res.json(tenant);
      res.end();
    })
    .catch(function (err) {
      rollbar.handleError(errorHandler.getErrorMessage(err), req);
      res.status(400).send(errorHandler.getErrorMessage(err));
    });

};

//
// exports.validateNewUser = function(req, res) {
//
//   validateCode(req.query.code)
//     .then(function (advocate) {
//
//       if(advocate) {
//
//         res.json({
//           advocate: advocate._id,
//           advocateRole: 'linked',
//           referral: {                                   // this is just for display purposes
//             email: advocate.email,
//             contactPhone: advocate.contactPhone,
//             contactPhoneExt: advocate.contactPhoneExt,
//             organization: advocate.organization,
//             name: advocate.fullName,
//             code: advocate.code
//           }
//         });
//       } else {
//         res.json({ advocate: null, referral: null });
//       }
//
//
//
//     })
//     .catch(function (err) {
//       console.log(err);
//       rollbar.handleError("Invalid Access Code", { code: req.query.code, error: err }, req);
//       res.status(400).send({ message: errorHandler.getErrorMessage(err) });
//     });
//
// };
//
//
//
// exports.listTenants = function(req, res) {
//
//   Tenant.find({ advocate: req.user._userdata })
//     .then(function (tenants) {
//
//       tenants = _.map(tenants, function(t) {
//
//         if(t.advocateRole !== 'managed') {
//           t.activity = undefined;
//           t.actionFlags = undefined;
//           t.followUpFlags = undefined;
//           t.problems = undefined;
//         }
//         // else if (t.advocateRole === 'none') {
//         //   rollbar.handleError("Tenant/advocate mismatch", req);
//         //   res.status(500).send({ message: "This shouldn\'t happen." });
//         // }
//
//         return t;
//
//       });
//
//       // console.log(tenants);
//       res.json(tenants);
//       res.end();
//     })
//     .catch(function (err) {
//       rollbar.handleError("Error in finding advocate\'s tenants", req);
//       res.status(400).send({ message: errorHandler.getErrorMessage(err) });
//     });
//
//   //
//   // Tenants.find({ advocate: })
// };
