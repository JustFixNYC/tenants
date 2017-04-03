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
    // loggedBy: {
    //   type: Schema.Types.ObjectId,
    //   refPath: 'loggedByKind'
    // },
    // loggedByKind: {
    //   type: String,
    //   enum: ['Tenant', 'Advocate', 'Admin']
    // },
    // this is just the name, not the reference
    loggedBy: {
      type: String,
      default: ''
    },
    photos: [{
      url : { type : String}, 
      secure_url : { type : String}, 
      thumb : { type : String}, 
      exif: {
        type: Schema.Types.Mixed,
        default: {}
      },
      cloudinary_public_id : { type : String}, 
      created : { type : Date, default : Date.now }
    }],
    fields: [{
      title: { type: String },
      value: { type: Schema.Types.Mixed }
    }],
    relatedProblems: [{
			type: String,
			ref: 'Problem'
		}],
    problems: {
      type: Schema.Types.Mixed,
      default: {}
    }
});

mongoose.model('Activity', ActivitySchema);

module.exports = ActivitySchema;
