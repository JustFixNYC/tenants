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

// GPS processing helper function
var convertDMSToDD = function(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction == "S" || direction == "W") {
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
    console.time("pathSave");
    s3Handler.uploadFileFromPath(pathOrBuff, type)
      .then(function (data) {
        console.timeEnd("pathSave");
        var url = data.Location;
        var resizedUrl = url.replace( /justfix/i, 'justfixresized' );
        uploaded.resolve({ url: url, thumb: resizedUrl });
      }).fail(function (err) {
        uploaded.reject(err);
      });
  }



  return uploaded.promise;
};

var processAndSavePhoto = function(file) {

  var processed = Q.defer();

  if(!file) processed.reject('no file?');

  var fileType = file.originalFilename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];

  s3Upload(file.path, fileType, false).then(function(urls) {
    processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
  }).fail(function(err) {
    processed.reject(err);
  });

  return processed.promise;
};

// var processAndSavePhoto = function(file) {
//
//   var processed = Q.defer();
//
//   // this is mainly for user friendliness. this field can be freely tampered by attacker.
//   // if (!/^image\/(jpe?g|png|gif)$/i.test(file.type)) {
//   //     return uploaded.reject('images only');
//   // }
//
//   if(!file) processed.reject('no file?');
//
//   var fileType = file.originalFilename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];
//
//   // try to get EXIF for metadata and orientation
//   getExifData(file.path).then(function (result) {
//
//     var _exif = {};
//
//     // if theres no error
//     if(!result.error) {
//
//       var exif = result.exif;
//
//       if(exif.gps) {
//         _exif.lat = convertDMSToDD(exif.gps.GPSLatitude[0],exif.gps.GPSLatitude[1],exif.gps.GPSLatitude[2],exif.gps.GPSLatitudeRef);
//         _exif.lng = convertDMSToDD(exif.gps.GPSLongitude[0],exif.gps.GPSLongitude[1],exif.gps.GPSLongitude[2],exif.gps.GPSLongitudeRef);
//         _exif.dir = convertDegToDirection(exif.gps.GPSImgDirection);
//       }
//       if(exif.exif) {
//
//         // format to JS readable date
//         var tmp = exif.exif.CreateDate.split(" ");
//         tmp[0] = tmp[0].split(":").join("-");
//         _exif.created = tmp[0] + "T" + tmp[1];
//
//         _exif.lens = exif.exif.LensModel;
//       }
//       if(exif.image) {
//         _exif.make = exif.image.Make;
//         _exif.model = exif.image.Model;
//         _exif.orientation = exif.image.Orientation;
//       }
//
//       // console.time("buffSave");
//       console.time("pathSave");
//
//       // gm(file.path)
//       //   .autoOrient()
//       //   .toBuffer(function (err, buffer) {
//       //     if (err) console.log('aaw, shucks', err);
//       //
//       //     // upload to s3
//       //     s3Upload(buffer, fileType, true).then(function(urls) {
//       //       console.timeEnd("buffSave");
//       //       processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
//       //     }).fail(function(err) {
//       //       processed.reject(err);
//       //     });
//       //
//       //   });
//
//       gm(file.path)
//         .autoOrient()
//         .write(file.path, function (err) {
//           if (err) {
//             processed.reject(err);
//             console.log('aaw, shucks', err);
//           }
//
//           // upload to s3
//           s3Upload(file.path, fileType, false).then(function(urls) {
//             console.timeEnd("pathSave");
//             processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
//           }).fail(function(err) {
//             processed.reject(err);
//           });
//
//         });
//
//     } else {
//
//       // exif error (doesn't mean that it found anything)
//       // rollbar.handleError(result.error, req);
//       // console.log(result.error);
//       rollbar.reportMessage(result.error.toString, "debug");
//
//       // upload to s3
//       s3Upload(file.path, fileType, false).then(function(urls) {
//         processed.resolve({ url: urls.url, thumb: urls.thumb, exif: _exif });
//       }).fail(function(err) {
//         processed.reject(err);
//       });
//
//     }
//
//
//
//   });
//
//
//   return processed.promise;
//
// };

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

    for(var file in files) uploadQueue.push(processAndSavePhoto(files[file]));

    Q.allSettled(uploadQueue).then(function (results) {

      results.forEach(function (r) {

        if(r.state !== 'fulfilled') {
          console.log(r.reason);
          rollbar.handleError(r.reason, req);
          res.status(500).send({ message: "Photo is not fulfilled" });
        }

        activity.photos.push({
          url: r.value.url,
          thumb: r.value.thumb,
          exif: r.value.exif
        });
      });

      // add ref to problems
      if(_.contains(problemsHandler.getProblemKeys(), activity.key)) {
        var prob = user.problems.getByKey(activity.key);
        prob.startDate = activity.startDate;
        prob.description = activity.description;
        prob.photos = activity.photos;
      }

      console.log('new activity', activity);

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
