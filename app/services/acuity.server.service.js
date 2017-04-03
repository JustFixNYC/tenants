'use strict';

var _ = require('lodash'),
    Q = require('q'),
    config = require('../../config/config'),
    bodyParser = require('body-parser'),
    Acuity = require('acuityscheduling'),
    rollbar = require('rollbar');

var acuity = Acuity.basic({
  "userId": config.acuity.id,
  "apiKey": config.acuity.key
});

var verifyMiddleware = bodyParser.urlencoded({
  verify: Acuity.bodyParserVerify(config.acuity.key),
  extended: true
});

var getApptInfo = function(req, res, next) {

  var apptId = req.body.id;

  acuity.request('appointments/' + apptId, function (err, res, appt) {
    req.body.appt = appt;
    next();
  });

};

var getUsersApptInfo = function(req, res, next) {

  var apptId = req.user.currentAcuityEventId;
  var response = res;

  acuity.request('appointments/' + apptId, function (err, res, appt) {
    response.json(appt);
  });

};


module.exports = {
  verifyMiddleware: verifyMiddleware,
  getApptInfo: getApptInfo,
  getUsersApptInfo: getUsersApptInfo
};
