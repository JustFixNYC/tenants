'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Issue Schema
 */
var IssueSchema = new Schema({
  category: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  urgency: {
    type: String,
    default: ''
  },  
  contactType: {
    type: String,
    default: ''
  },  
  contactName: {
    type: String,
    default: ''
  },  
  contactPhone: {
    type: String,
    default: ''
  },
  borough: {
    type: String,
    default: ''
  },  
  streetNumber: {
    type: String,
    default: ''
  }, 
  streetName: {
    type: String,
    default: ''
  }, 
  created: {
    type: Date,
    default: Date.now
  },
  hasUser: {
    type: Boolean,
    default: true   
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Issue', IssueSchema);