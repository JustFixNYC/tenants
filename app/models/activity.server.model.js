'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({

    date: { 
      type: Date, 
      default: Date.now
    },
    key: {
      type: String,
      default: '' 
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
    // ,
    // photos: [
    // ]
});

module.exports = ActivitySchema;