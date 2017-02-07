'use strict';

var dbConnect = require('./dbConnect');

exports.up = function(next) {

  // Rename Users collection to UsersOld
  // Drop users collection

  // Wait for mongodb Driver to be connected and get the mongodb object
  dbConnect.mongodb.then(function (mongodb) {
    mongodb.collection('users').rename('users_old')
      .then(function () {
        // mongodb.close();
        next();
      })
      .catch(function (err) {
        console.log(err);
      });

  });

};

exports.down = function(next) {

  dbConnect.mongodb.then(function (mongodb) {
    mongodb.collection('users_old').rename('users')
      .then(function () {
        mongodb.close();
        next();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

};
