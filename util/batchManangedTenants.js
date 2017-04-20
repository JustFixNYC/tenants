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
    prompt = require('prompt'),
    csv = require('csvtojson');

console.log('JustFix.nyc dashboard batch import. Hello!');

var promptSchema = {
  properties: {
    phone: {
      description: 'Enter the advocate\'s phone number',
      required: true
    },
    file: {
      description: 'Enter the path of the CSV file',
      default: '/Users/dan/Desktop/jordantest.csv',
      required: true
    }
  }
};

var total;        // represents total number of docs to insert
var advocate;     // ref to advocate

prompt.start();

prompt.get(promptSchema, function (err, result) {

  if(err) console.error(err);

  var phone = result.phone;
  var file = result.file;

  Advocate.findOne({ phone: result.phone })
    .then(function (_advocate) {

      if(!_advocate) {
        console.log('Advocate not found. Try again dude.');
        process.exit(1);
      }

      advocate = _advocate;

      parse(file);
    })
    .catch(function (err) {
      console.error(err);
      process.exit(1);
    });

});

function parse(file) {
  csv()
    .fromFile(file)
    .on('end_parsed', function(json) {
      console.log('parsed', json.length);
      total = json.length;
      handle(json)
        .then(function () {
          // console.log(docs);
          process.exit();
        })
        .catch(function (err) {
          console.error(err);
          process.exit(1);
        });
    })
    .on('error', function(err) {
      console.log('error', err);
    });
    // .on('done', function (err) {
    //   console.log('end');
    // });
}


function handle(json) {

  var handled = Q.defer();
  var rawTenants = [];

  json.forEach(function (tenant) {

    if(tenant.phone) {

      // Tenant.findOne({ phone: tenant.phone.replace(/\D+/g, '') })
      //   .then(function (tenant) {
      //     if(tenant) console.log(tenant.phone);
      //     else console.log('no');
      //   });

      // var newTenant = {};
      var newTenant = new Tenant();

      // specific to CASA doc - modify as necessary
      var names = tenant.name.split(',');
      newTenant.lastName = names[0].trim();
      newTenant.firstName = names[1].trim();
      newTenant.phone = tenant.phone.replace(/\D+/g, '');
      newTenant.borough = 'Bronx';
      newTenant.address = tenant.address;
      newTenant.unit = tenant.unit;
      newTenant.advocateRole = 'managed';
      newTenant.advocate = advocate._id;
      newTenant.sharing = { enabled: true };

      rawTenants.push(newTenant);
    }
  });

  var buildPromises = [];
  rawTenants.forEach(function (tenant) {
    buildPromises.push(tenantProfileHandler.buildNewTenant(tenant, advocate));
  });

  Q.allSettled(buildPromises)
    .then(function (results) {

      var tenantsSave = [];

      var tenantSavePromise = function(tenant) {
        var saved = Q.defer();

        tenant.save()
          .then(function (tenant) {
            console.log('saved', tenant.phone);
            saved.resolve(tenant);
          })
          .catch(function (err) {
            console.error('error while saving', tenant.phone, tenant.lastName, ' -- ', err.message);
            saved.reject(err);
          });

        return saved.promise;
      };

      results.forEach(function (result) {
          if (result.state === "fulfilled") {
            tenantsSave.push(tenantSavePromise(result.value));
          } else {
            console.error('this really shouldn\'t happen');
          }
      });


      return Q.allSettled(tenantsSave);
    })
    .then(function (results) {

      var successes = _.filter(results,function(obj) {
          return obj.state.indexOf('fulfilled') !== -1;
      }).length;

      console.log('total saved:', successes);

      // don't exit(1) even if some fail, i guess
      handled.resolve();
    })
    .catch(function (err) {
      console.error(err);
    });

  // console.log(tenants);
  // //
  // // insertMany doesn't use promises on 4.6.... are you serious
  // Tenant.insertMany(tenants, function(err, docs) {
  //
  //   if(err) handled.reject(err);
  //   else handled.resolve(docs);
  //
  // });


  return handled.promise;
}
