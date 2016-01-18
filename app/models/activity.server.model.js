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
    created: {
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
    },
    photos: [{
      url : { type : String}, 
      thumb : { type : String}, 
      created : { type : Date, default : Date.now }
    }],
    fields: [{
      title: { type: String },
      value: { type: String }
    }]
});

module.exports = ActivitySchema;
