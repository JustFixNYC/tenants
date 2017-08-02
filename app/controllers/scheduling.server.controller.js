'use strict';

var _ = require('lodash'),
    rollbar = require('rollbar'),
    mongoose = require('mongoose'),
    Tenant = mongoose.model('Tenant'),
    errorHandler = require('./errors.server.controller'),
    acuityService = require('../services/acuity.server.service');

mongoose.Promise = require('q').Promise;

exports.bookDate = function (req, res) {

  var consultationForm = _.find(req.body.appt.forms, { id: 602488 }).values;
  var tenantID = _.find(consultationForm, { fieldID: 3389743 }).value;

  Tenant.findById(tenantID)
  // Tenant.findOne({ phone: req.body.appt.phone })
    .then(function (tenant) {

      if(!tenant) throw new Error("No Tenant Found");

      if(tenant.advocateRole === 'none') {
        tenant.advocateRole = req.body.advocateRole;
        tenant.advocate = req.body.advocate;
        tenant.sharing.enabled = true;
      }

      if(_.contains(tenant.actionFlags, 'scheduleLater')) {
        _.pull(tenant.actionFlags, 'scheduleLater');

        // need to notify of array change
        // http://stackoverflow.com/a/13350955/991673
        tenant.markModified('actionFlags');
      }

      tenant.currentAcuityEventId = req.body.id;

      return tenant.save();
    })
    .then(function () {

      rollbar.reportMessage("New Appointment Scheduled!", "info", req);
      res.send({
        message: 'Successfully Updated Appt Id'
      });
    })
    .catch(function (err) {
      rollbar.handleErrorWithPayloadData("Scheduling Error", { phone: req.body.appt.phone, error: err }, req);
      res.status(500).send({ message: errorHandler.getErrorMessage(err) });
    });
};
