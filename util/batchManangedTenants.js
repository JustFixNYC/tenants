'use strict';

var dbConnect = require('./dbConnect'),
    Q = require('q'),
    _ = require('lodash'),
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
      description: 'Enter the advocates phone number',
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

var handle = function(json) {

  var handled = Q.defer();
  var tenants = [];

  json.forEach(function (tenant) {

    if(tenant.phone) {

      Tenant.findOne({ phone: tenant.phone.replace(/\D+/g, '') })
        .then(function (tenant) {
          if(tenant) console.log(tenant.phone);
          else console.log('no');
        });


      // var newTenant = new Tenant();
      //
      // // specific to CASA doc - modify as necessary
      // var names = tenant.name.split(',');
      // newTenant.lastName = names[0].trim();
      // newTenant.firstName = names[1].trim();
      // newTenant.phone = tenant.phone.replace(/\D+/g, '');
      // newTenant.borough = 'Bronx';
      // newTenant.address = tenant.address;
      // newTenant.unit = tenant.unit;
      // newTenant.advocateRole = 'managed';
      // newTenant.advocate = advocate._id;
      // newTenant.sharing = { enabled: true };
      //
      // console.log(newTenant);
      //
      // tenants.push(newTenant);
    }
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
};

var parse = function(file) {
  csv()
    .fromFile(file)
    .on('end_parsed', function(json) {
      console.log('parsed', json.length);
      total = json.length;
      handle(json)
        .then(function (docs) {
          console.log(docs);
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
};

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
