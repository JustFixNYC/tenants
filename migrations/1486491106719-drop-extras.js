'use strict';

var dbConnect = require('./dbConnect');

exports.up = function(next) {

    // Wait for mongodb Driver to be connected and get the mongodb object
    dbConnect.mongodb.then(function (mongodb) {

      mongodb.collection('users_old').drop()
        .then(function (res) {
          return mongodb.collection('sessions').remove({});
        })
        .then(function (res) {
          return mongodb.collection('referrals').drop();
        })
        .then(function (res) {
          mongodb.close();
          next();
        })
        .catch(function (err) {
          console.log(err);
        });

    });
};

exports.down = function(next) {
  next();
};
