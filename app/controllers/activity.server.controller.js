'use strict';

var _ = require('lodash'),
    Q = require('q'),
    errorHandler = require('./errors.server.controller'),
    s3Handler = require('../services/s3.server.service'),
    mongoose = require('mongoose'),
    rollbar = require('rollbar'),
    problemsHandler = require('./problems.server.controller.js'),
    User = mongoose.model('User');

var list = function(req, res) {
  if(req.user) {
    res.json(req.user.activity);
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

var s3upload = function(file) {

  var uploaded = Q.defer();

  // this is mainly for user friendliness. this field can be freely tampered by attacker.
  // if (!/^image\/(jpe?g|png|gif)$/i.test(file.type)) {
  //     return uploaded.reject('images only');
  // }

  if(!file) uploaded.reject('no file?');

  // console.log('file', file);
  // console.log('origname', file.originalFilename);

  var type = file.originalFilename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];

  s3Handler.uploadFile(file.path, type)
    .then(function (data) {
      console.log('s3 file success!', data);
      var url = data.Location;
      var resizedUrl = url.replace( /justfix/i, 'justfixresized' );

      uploaded.resolve({ url: data.Location, thumb: resizedUrl });
    }).fail(function (err) {
      uploaded.reject(err);
    });

  return uploaded.promise;

};

var create = function(req, res, next) {
  var user = req.user;
  var activity = req.body;

  // console.log(req.body, req.files);
  // don't forget to delete all req.files when done

  // if we're coming from users.requiresLogin, is this still necessary?
  if(user) {

    // remove from follow up flags
    var idx = _.findIndex(user.followUpFlags, { key: activity.key});
    // if(idx < 0) return res.status(500).send({ message: 'Follow up key not found, this is bad' });
    if(idx !== -1) user.followUpFlags.splice(idx, 1);


    // add to action flags
    if(!_.contains(user.actionFlags, activity.key)) user.actionFlags.push(activity.key);


    // init photos array
    activity.photos = [];

    var files = req.files['photos'];

    // console.log('files', files);

    // init photos queue
    var uploadQueue = [];

    for(var file in files) uploadQueue.push(s3upload(files[file]));

    Q.allSettled(uploadQueue).then(function (results) {

      results.forEach(function (r) {
        if(r.state !== 'fulfilled') {
          res.status(500).send({ message: "Photo is not fulfilled" });
        }

        activity.photos.push({
          url: r.value.url,
          thumb: r.value.thumb
        });
      });

      // add ref to problems
      if(_.contains(problemsHandler.getProblemKeys(), activity.key)) {
        var prob = user.problems.getByKey(activity.key);
        prob.startDate = activity.startDate;
        prob.description = activity.description;
        prob.photos = activity.photos;
      }

      // add activity object
      user.activity.push(activity);
      req.body = {};

      next();

    })  // end of Q.allSettled
    .fail(function (err) {
      // console.log('s3 error', err);
      rollbar.handleError(err, req);
    });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

module.exports = {
  list: list,
  create: create
};
