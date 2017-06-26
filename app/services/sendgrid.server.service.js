'use strict';

var _ = require('lodash'),
    Q = require('q'),
    config = require('../../config/config'),
    bodyParser = require('body-parser'),
    sendgridHelper = require('sendgrid').mail,
    sg = require('sendgrid')(config.sendgrid.apiKey),
    rollbar = require('rollbar'),
    mongoose = require('mongoose'),
    Advocate = mongoose.model('Advocate');

mongoose.Promise = require('q').Promise;

var sendEmail = function(mail) {

  var sentEmail = Q.defer();

  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      sentEmail.reject(error);
    }
    sentEmail.resolve(response);
    // console.log(response.statusCode);
    // console.log(response.body);
    // console.log(response.headers);
  });

  return sentEmail.promise;
};

var advocateNotification = function(advocateId, tenantName, subject, templateId) {

  var notified = Q.defer();

  var fromEmail = new sendgridHelper.Email('hello@justfix.nyc', 'JustFix.nyc');

  Advocate.findOne({ _id: advocateId })
    .then(function (advocate) {

      if(!advocate) {
        notified.reject(new Error("Invalid Advocate ID."));
      } else {

        var toEmail = new sendgridHelper.Email(advocate.email);
        var content = new sendgridHelper.Content('text/html', 'I\'m replacing the <strong>body tag</strong>');

        var mail = new sendgridHelper.Mail(fromEmail, subject, toEmail, content);

        mail.personalizations[0].addSubstitution(
          new sendgridHelper.Substitution('-advocateName-', advocate.firstName));
        mail.personalizations[0].addSubstitution(
          new sendgridHelper.Substitution('-tenantName-', tenantName));
        mail.setTemplateId(templateId);

        return sendEmail(mail);
      }
    })
    .then(function (response) {
      notified.resolve(response);
    })
    .catch(function (err) {
      notified.reject(err);
    });

  return notified.promise;
};

var sendNewSignUpEmail = function(advocateId, tenantName) {

  var subject = tenantName + ' has created an account on your JustFix.nyc Dashboard.';
  var templateId = '674ceacf-5704-437e-9368-1afbe3ff5dcd';

  return advocateNotification(advocateId, tenantName, subject, templateId);
};

var sendUpdatedAcctEmail = function(advocateId, tenantName) {

  var subject = tenantName + ' has added an update to their account!';
  var templateId = '1ea4724e-c4ec-4eda-9b61-0bed29145592';

  return advocateNotification(advocateId, tenantName, subject, templateId);
};



module.exports = {
  sendNewSignUpEmail: sendNewSignUpEmail,
  sendUpdatedAcctEmail: sendUpdatedAcctEmail
};
