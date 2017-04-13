'use strict';

var dbConnect = require('./dbConnect'),
    Q = require('q'),
    _ = require('lodash'),
    tenantProfileHandler = require('../app/controllers/tenants/tenants.authentication.server.controller.js'),
    User = dbConnect.mongoose.model('User'),
    Identity = dbConnect.mongoose.model('Identity'),
    Advocate = dbConnect.mongoose.model('Advocate'),
    Tenant = dbConnect.mongoose.model('Tenant');

var chalk = require('chalk'),
    prompt = require('prompt');

console.log('JustFix.nyc manual tenant link. Hello!');

var promptSchema = {
  properties: {
    advocatePhone: {
      description: 'Enter the advocate\'s phone number',
      default: '6468200349',
      required: true
    },
    tenantPhone: {
      description: 'Enter the tenants\'s phone number',
      required: true
    }
  }
};

var total;        // represents total number of docs to insert
var advocate;     // ref to advocate

prompt.start();

prompt.get(promptSchema, function (err, result) {

  if(err) console.error(err);

  var advocatePhone = result.advocatePhone;
  var tenantPhone = result.tenantPhone;

  Advocate.findOne({ phone: result.advocatePhone })
    .then(function (advocate) {

      if(!advocate) {
        throw new Error('no advocate found');
      } else {
        Tenant.findOne({ phone: result.tenantPhone })
          .then(function (tenant) {
            if(!tenant) {
              throw new Error('no tenant found');
            } else {
              tenant.sharing.enabled = true;
              tenant.advocateRole = 'linked';
              tenant.advocate = advocate._id;
              return tenant.save();
            }
          })
          .then(function (resullt) {
            console.log('updated', result);
            process.exit();
          })
          .catch(function (err) {
            console.error(err);
            process.exit(1);
          });
      }
    })
    .catch(function (err) {
      console.error(err);
      process.exit(1);
    });
});
