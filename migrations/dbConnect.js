'use strict';

var config = require('../config/config'),
    path = require('path');

var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var mongodb = null;

mongoose.Promise = require('q').Promise;

// Globbing model files
config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

console.log('Connecting to: ' + config.db);

mongoose.connect(config.db);

// mongoose.connection.on('error', function (err) {
//   console.log('connection error', err);
// });
//
// mongoose.connection.on('connecting', function () {
//   console.log('Mongoose default connecting');
// });
//
// mongoose.connection.on('connected', function () {
//   console.log('Mongoose default connection open');
// });

module.exports = {
  mongoose: mongoose,
  mongodb: MongoClient.connect(config.db) // mongo Driver return a Promise
};
