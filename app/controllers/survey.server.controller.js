'use strict';

var _ = require('lodash'),
    rollbar = require('rollbar'),
    mongoose = require('mongoose'),
    Tenant = mongoose.model('Tenant'),
    errorHandler = require('./errors.server.controller'),
    acuityService = require('../services/acuity.server.service');

mongoose.Promise = require('q').Promise;

exports.processNewSurvey = function (req, res) {

  if(req.body && req.body.form_response && req.body.form_response.answers) {

    // var answers = [];

    for(var i = 0; i < req.body.form_response.answers.length; i++) {
      // answers[]
    }

  } else {
    // error
  }


};
