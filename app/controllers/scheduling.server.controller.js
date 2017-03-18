'use strict';

var _ = require('lodash'),
    rollbar = require('rollbar'),
    mongoose = require('mongoose'),
    Tenant = mongoose.model('Tenant'),
    errorHandler = require('./errors.server.controller'),
    acuityService = require('../services/acuity.server.service');

mongoose.Promise = require('q').Promise;

exports.bookDate = function (req, res) {

  Tenant.findOne({ phone: req.body.appt.phone })
    .then(function (tenant) {

      if(!tenant) throw new Error("No Tenant Found");

      if(tenant.advocateRole === 'none') {
        tenant.advocateRole = req.body.advocateRole;
        tenant.advocate = req.body.advocate;
        tenant.sharing.enabled = true;
      }

      tenant.currentAcuityEventId = req.body.id;

      return tenant.save();
    })
    .then(function () {
      res.send({
        message: 'Successfully Updated Appt Id'
      });
    })
    .catch(function (err) {

      console.log(err);
      rollbar.handleError("Scheduling Error", { phone: req.body.appt.phone, error: err }, req);
      res.status(500).send({ message: errorHandler.getErrorMessage(err) });

    });



};
