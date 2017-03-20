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
      rollbar.handleError("Scheduling Error", { phone: req.body.appt.phone, error: err }, req);
      res.status(500).send({ message: errorHandler.getErrorMessage(err) });
    });
};

// add the scheduling card to actions
// could be done easily by tracking currentAcuityEventId,
// but do we want to make this available to everyone
// or just people who came to the site organically?
exports.saveForLater = function (req, res, next) {
  req.body.actionFlags = req.user.actionFlags;
  req.body.actionFlags.push('scheduleLater');
  next();
};
