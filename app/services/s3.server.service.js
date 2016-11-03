'use strict';

var _ = require('lodash'),
    Q = require('q'),
    config = require('../../config/config'),
    AWS = require('aws-sdk'),
    rollbar = require('rollbar'),
    fs = require('fs');

AWS.config.update({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.key,
  region: 'us-east-1'
});

// assume you already have the S3 Bucket created, and it is called ierg4210-shopxx-photos
var photoBucket = new AWS.S3({params: {Bucket: 'justfix'}});

var uploadFileFromBuff = function(buff, type) {

  var uploaded = Q.defer();

  var destFileName = '10000' + parseInt(Math.random() * 10000000);

  photoBucket
      .upload({
          ACL: 'public-read',
          Body: buff,
          Key: 'images/' + destFileName.toString() + type,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
      })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
      // .on('httpUploadProgress', function(evt) { console.log(evt); })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
      .send(function(err, data) {
        if(err) {
          uploaded.reject(err);
        }

        // delete temp file?
        // fs.unlinkSync(path);
        uploaded.resolve(data);
      });

  return uploaded.promise;
};

var uploadFileFromPath = function(path, type) {

  var uploaded = Q.defer();

  var destFileName = '10000' + parseInt(Math.random() * 10000000);

  photoBucket
      .upload({
          ACL: 'public-read',
          Body: fs.createReadStream(path),
          Key: 'images/' + destFileName.toString() + type,
          ContentType: 'application/octet-stream' // force download if it's accessed as a top location
      })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
      // .on('httpUploadProgress', function(evt) { console.log(evt); })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
      .send(function(err, data) {
        if(err) {
          uploaded.reject(err);
        }

        // delete temp file?
        // fs.unlinkSync(path);
        uploaded.resolve(data);
      });

  return uploaded.promise;
};


module.exports = {
  uploadFileFromBuff: uploadFileFromBuff,
  uploadFileFromPath: uploadFileFromPath
};
