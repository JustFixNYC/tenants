'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Issues Schema
 */

var IssueSchema = new Schema({
  name: {
  	type: String,
  	default: ''
  },
  emergency: {
  	type: Boolean,
  	default: false
  },
  known: {
  	type: Boolean,
  	default: false
  }
});


/**
 * Problem Schema
 */
var ProblemSchema = new Schema({

    startDate: {
      type: Date,
      default: Date.now
    },
    createdDate: {
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
      url : {type : String}, 
      thumb : {type : String}, 
      created : {type : Date, default : Date.now }
    }],
    relatedActivities: [{
			type: Schema.Types.ObjectId,
			ref: 'Activity'
		}],
    issues: [IssueSchema]
});

module.exports = ProblemSchema;
