'use strict';

/**
 * NOTES:
 *  Everything in this doc should be *agnostic* to the type of user
 *
 */

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Q = require('q'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  rollbar = require('rollbar'),
  User = mongoose.model('User'),
  Identity = mongoose.model('Identity');

mongoose.Promise = require('q').Promise;

/**
 * Take a populated User model and flatten it for the api response
 *
 * identity and userdata should be mongoose objects
 */
var formatUserForClient = exports.formatUserForClient = function(identity, userdata) {

  var formatted = Q.defer();

  // save reference to identity _id;
  var _identity = identity._id;
  var _userdata = userdata._id;

  // build userdata document. This allows for custom actions to be done
  // which are specific to the type of user
  userdata.build()
    .then(function (userdata) {

      // create new "user" object from both identity and userdata objects
      // this is the data that will be sent back to the page
      // note: overlap values like _id & phone in `identity` will be overwritten
      // need to use mongoose `toObject()` here as well
      var userObject = _.extend(identity.toObject(), userdata.toObject());
      userObject._identity = _identity;
      userObject._userdata = _userdata;         // could probably just use _id, but lets be safe

      // Remove sensitive data
      userObject.password = undefined;
      userObject.salt = undefined;

      formatted.resolve(userObject);
    })
    .catch(function (err) {
      formatted.reject(err);
    });

    return formatted.promise;
};

/**
 * Save prepared user documents and create a new User
 */
var saveNewUser = exports.saveNewUser = function(req, identity, userdata, user) {

  var saved = Q.defer();
  var _this = this;


  // This is awful. Promises seem to be broken in Mongoose 4.6.x
  // We need to validate both documents before saving so we don't
  // accidentally save one and not the other.
  // https://github.com/Automattic/mongoose/issues/4728
  userdata.validate(function (err) {
    if(err) saved.reject(errorHandler.getErrorMessage(err));
    else {

      identity.validate(function (err) {
        if(err) saved.reject(errorHandler.getErrorMessage(err));
        else {

            // save both identity and userdata documents
            // mongoose is configured to run on q promises
            Q.allSettled([identity.save(), userdata.save()])
              .spread(function (identity, userdata) {

                if(identity.state === 'rejected') {
                  saved.reject(errorHandler.getErrorMessage(identity.reason));
                }
                if(userdata.state === 'rejected') {
                  saved.reject(errorHandler.getErrorMessage(userdata.reason));
                }

                // save the ObjectID references of the two documents
                user._identity = identity.value._id;
                user._userdata = userdata.value._id;

                // // save new User
                user.save()
                  .then(function (user) {

                    // this is nested because we'll need user for the req.login
                    formatUserForClient(identity.value, userdata.value)
                      .then(function (userObject) {

                        // passport login, serializes the user
                        // unfortunately not configured for q promises
                        // req.login (serialize) should be sent an *unpopulated* User document
                        req.login(user, function(err) {
                          if (err) {
                            saved.reject(errorHandler.getErrorMessage(err));
                          } else {
                            // pass this json for the res
                            saved.resolve(userObject);
                          }
                        });
                      })
                      .catch(function (err) {
                        saved.reject(errorHandler.getErrorMessage(err));
                      });
                  });
              })
              .catch(function (err) {
                console.log('err', err);
                saved.reject(errorHandler.getErrorMessage(err));
              });

        }
      });       // identity validate
    }
  });       // userdata validate

  return saved.promise;
};


/**
 * Signup should be specific to the type of user, so look in their
 * appropriate authentication controller
 */

/**
 * Signin after passport authentication
 *
 * This looks/feels wonky bc we want to make sure that the unpopulated User
 * is what actually gets sent to req.login
 */
exports.signin = function(req, res, next) {

  // sign in, returns the identity object
  passport.authenticate('local', function(err, identity, info) {
    if (err || !identity) {
      rollbar.handleError(info, req);
      res.status(400).send(info);
    } else {

      // get User document
      User.findOne({ _identity: identity._id })
        .then(function (user) {

          // log in, serializes the user
          // ensure that *unpopulated* User is what is always sent to req.login (serialize)
          req.login(user, function(err) {
            if (err) {
              rollbar.handleError(err, req);
              res.status(400).send(err);
            } else {

              // Now we can actually populate in order to send data back
              user.populate('_identity _userdata', '-salt -password')
                .execPopulate()
                .then(function (populatedUser) {
                  return formatUserForClient(populatedUser._identity, populatedUser._userdata);
                })
                .then(function (userObject) {
                  rollbar.reportMessage("User Sign In", "info", req);
                  res.json(userObject);
                  res.end();
                })
                .catch(function (err) {
                  rollbar.handleError(err);
                  res.status(400).send(err);
                });
            }
          });
        })
        .catch(function (err) {
          rollbar.handleError(err);
          res.status(400).send(err);
        });
    } // no error from passport
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};
