'use strict';

var _ = require('lodash'),
    Q = require('q'),
    ExifImage = require('exif').ExifImage,
    gm = require('gm'),
    errorHandler = require('./errors.server.controller'),
    s3Handler = require('../services/s3.server.service'),
    mongoose = require('mongoose'),
    rollbar = require('rollbar'),
    problemsHandler = require('./problems.server.controller.js'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity');

var list = function(req, res) {

  // Activity.populate(req.user.activity, { path: 'loggedBy', select: 'fullName' })
  //   .then(function (activities) {
  //     res.json(activities);
  //   })
  //   .fail(function (err) {
  //     rollbar.handleError(err, req);
  //     res.status(500).send({ message: errorHandler.getErrorMessage(err) });
  //   });



  res.json(req.user.activity);
};

// GPS processing helper function
var convertDMSToDD = function(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
};

var convertDegToDirection = function(deg) {
  if(deg >= 337.5 || deg < 22.5) {
    return 'N';
  } else if (deg >= 22.5 && deg < 67.5) {
    return 'NE';
  } else if (deg >= 67.5 && deg < 112.5) {
    return 'E';
  } else if (deg >= 112.5 && deg < 157.5) {
    return 'SE';
  } else if (deg >= 157.5 && deg < 202.5) {
    return 'S';
  } else if (deg >= 202.5 && deg < 247.5) {
    return 'SW';
  } else if (deg >= 247.5 && deg < 292.5) {
    return 'W';
  } else if (deg >= 292.5 && deg < 337.5) {
    return 'NW';
  } else {
    return '';
  }

};

var getExifData = function(path) {

  var extracted = Q.defer();

  try {
      new ExifImage({ image : path }, function (error, exifData) {
          if (error) {
            extracted.resolve({ exif: undefined, error: error });
          } else {
            extracted.resolve({ exif: exifData, error: undefined });
          }
      });
  } catch (error) {
      extracted.resolve({ exif: undefined, error: error });
  }

  return extracted.promise;
};



var s3Upload = function(pathOrBuff, type, isBuff) {

  var uploaded = Q.defer();

  if(isBuff) {

    console.log('from buff');

    s3Handler.uploadFileFromBuff(pathOrBuff, type)
      .then(function (data) {
        var url = data.Location;
        var resizedUrl = url.replace( /justfix/i, 'justfixresized' );
        uploaded.resolve({ url: url, thumb: resizedUrl });
      }).fail(function (err) {
        uploaded.reject(err);
      });
  } else {

    console.log('from path');
    s3Handler.uploadFileFromPath(pathOrBuff, type)
      .then(function (data) {
        var url = data.Location;
        var resizedUrl = url.replace( /justfix/i, 'justfixresized' );
        uploaded.resolve({ url: url, thumb: resizedUrl });
      }).fail(function (err) {
        uploaded.reject(err);
      });
  }



  return uploaded.promise;
};

var processAndSavePhotoAlt = function(file) {

  var processed = Q.defer();

  if(!file) processed.reject('no file?');

  var fileType = file.originalFilename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];

  s3Upload(file.path, fileType, false).then(function(urls) {
    processed.resolve({ url: urls.url, thumb: urls.thumb, exif: {} });
  }).fail(function(err) {
    processed.reject(err);
  });

  return processed.promise;
};

var processAndSavePhoto = function(file) {

  var processed = Q.defer();

  // this is mainly for user friendliness. this field can be freely tampered by attacker.
  // if (!/^image\/(jpe?g|png|gif)$/i.test(file.type)) {
  //     return uploaded.reject('images only');
  // }

  if(!file) processed.reject('no file?');

  var fileType = file.originalFilename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];

  console.time("exif");

  // try to get EXIF for metadata and orientation
  getExifData(file.path).then(function (result) {

    console.timeEnd("exif");

    var _exif = {};

    // if theres no error
    // if(!result.error && _.has(result.exif.image, 'Orientation')) {
    if(!result.error) {

      var exif = result.exif;

      console.log("found exif", exif);

      if(exif.gps && !_.isEmpty(exif.gps)) {

        if(_.has(exif.gps, 'GPSLatitude')) _exif.lat = convertDMSToDD(exif.gps.GPSLatitude[0],exif.gps.GPSLatitude[1],exif.gps.GPSLatitude[2],exif.gps.GPSLatitudeRef);
        if(_.has(exif.gps, 'GPSLongitude')) _exif.lng = convertDMSToDD(exif.gps.GPSLongitude[0],exif.gps.GPSLongitude[1],exif.gps.GPSLongitude[2],exif.gps.GPSLongitudeRef);
        if(_.has(exif.gps, 'GPSImgDirection')) _exif.dir = convertDegToDirection(exif.gps.GPSImgDirection);
      }
      if(exif.exif && !_.isEmpty(exif.exif)) {

        if(_.has(exif.exif, 'CreateDate')) {
          // format to JS readable date
          var tmp = exif.exif.CreateDate.split(" ");
          tmp[0] = tmp[0].split(":").join("-");
          _exif.created = tmp[0] + "T" + tmp[1];
        }

        if(_.has(exif.exif, 'LensModel')) _exif.lens = exif.exif.LensModel;
      }
      if(exif.image && !_.isEmpty(exif.image)) {
        if(_.has(exif.image, 'Make')) _exif.make = exif.image.Make;
        if(_.has(exif.image, 'Model')) _exif.model = exif.image.Model;
        if(_.has(exif.image, 'Orientation')) _exif.orientation = exif.image.Orientation;
      }


      // if the orientation metadata is set, we can autoOrient the image by converting it to a buffer
      // if(exif.image && !_.isEmpty(exif.image) && _.has(exif.image, 'Orientation')) {

      console.time("buffCreate");

      // this should *just work* even without an Orientation exif value
      gm(file.path)
        .autoOrient()
        .toBuffer(function (err, buffer) {
          if (err) {
            console.log('aaw, shucks', err);
            processed.reject(err);
          }

          console.timeEnd("buffCreate");
          console.time("s3buffUpload");

          // upload to s3
          s3Upload(buffer, fileType, true).then(function(urls) {
            console.timeEnd("s3buffUpload");
            processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
          }).fail(function(err) {
            processed.reject(err);
          });

        });

      // } else {
      //
      //   console.log('has exif, but no orientation');
      //
      //   // upload to s3
      //   console.time("s3PathUpload");
      //   s3Upload(file.path, fileType, false).then(function(urls) {
      //     console.timeEnd("s3PathUpload");
      //     processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
      //   }).fail(function(err) {
      //     processed.reject(err);
      //   });
      //
      // }

        // gm(file.path)
        //   .autoOrient()
        //   .write(file.path, function (err) {
        //     if (err) {
        //       processed.reject(err);
        //       console.log('aaw, shucks', err);
        //     }
        //
        //     // upload to s3
        //     s3Upload(file.path, fileType, false).then(function(urls) {
        //       console.timeEnd("pathSave");
        //       processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
        //     }).fail(function(err) {
        //       processed.reject(err);
        //     });
        //
        //   });


    } else {

      // exif error (doesn't mean that it found anything)
      // rollbar.handleError(result.error, req);
      console.log(result.error);
      console.log(result.error.toString());
      rollbar.reportMessage(result.error.toString(), "debug");

      console.time("s3PathUpload");

      // upload to s3
      s3Upload(file.path, fileType, false).then(function(urls) {
        console.timeEnd("s3PathUpload");
        processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
      }).fail(function(err) {
        processed.reject(err);
      });

    }



  });


  return processed.promise;

};

var create = function(req, res, next) {

  if(req.user) {

    // format req.body;
    var newActivity = _.clone(req.body);
    req.body = {};

    // updating a managed tenant
    if(res.locals.tenant) {
      req.body.activity = res.locals.tenant.activity;
      // store updates to flag objects
      req.body.followUpFlags = res.locals.tenant.followUpFlags;
      req.body.actionFlags = res.locals.tenant.actionFlags;
    } else {
      req.body.activity = req.user.activity;
      // store updates to flag objects
      req.body.followUpFlags = req.user.followUpFlags;
      req.body.actionFlags = req.user.actionFlags;
    }

    // remove from follow up flags
    var idx = _.findIndex(req.body.followUpFlags, { key: newActivity.key});
    // if(idx < 0) return res.status(500).send({ message: 'Follow up key not found, this is bad' });
    if(idx !== -1) req.body.followUpFlags.splice(idx, 1);

    // add to action flags
    if(!_.contains(req.body.actionFlags, newActivity.key)) req.body.actionFlags.push(newActivity.key);

    // stored logged by info
    // we aren't gonna store a reference to the author
    // in the interest of all activity data
    // being *unchangable* from the time that its created.
    // so instead this is just the author's name at the time
    newActivity.loggedBy = req.user.fullName;



    // this will allow you to store a reference to the author
    //
    // newActivity.loggedBy = req.user._userdata;
    //
    // // for the time being there's only one referenced role
    // // how to acct when there could be multiple types of user data?
    // var role = req.user.roles[0];
    // // convert from role to Model, bleh
    // newActivity.loggedByKind = role.charAt(0).toUpperCase() + role.substring(1);

    // console.log(newActivity);

    // init photos array
    newActivity.photos = [];

    var files = req.files['photos'];

    // console.log('files', req.files);

    // init photos queue
    var uploadQueue = [];

    for(var file in files) uploadQueue.push(processAndSavePhoto(files[file]));

    Q.allSettled(uploadQueue)
      .then(function (results) {

        results.forEach(function (r) {

          if(r.state !== 'fulfilled') {
            console.log(r.reason);
            rollbar.handleError(r.reason, req);
            res.status(500).send({ message: "Photo is not fulfilled" });
          }

          newActivity.photos.push({
            url: r.value.url,
            thumb: r.value.thumb,
            exif: r.value.exif
          });
        });

        // add ref to problems
        // we aren't using this right now so i'll handle it later
        // if(_.contains(problemsHandler.getProblemKeys(), newActivity.key)) {
        //   var prob = req.user.problems.getByKey(newActivity.key);
        //   prob.startDate = newActivity.startDate;
        //   prob.description = newActivity.description;
        //   prob.photos = newActivity.photos;
        // }

        // add activity object
        req.body.activity.push(newActivity);

        next();

      })  // end of Q.allSettled
      .fail(function (err) {

        // s3 error

        // console.log('s3 error', err);
        rollbar.handleError(err, req);
        res.status(500).send({ message: errorHandler.getErrorMessage(err) });

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
