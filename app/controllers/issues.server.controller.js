'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Issue = mongoose.model('Issue'),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 * Create a Issue
 */
exports.create = function(req, res) {

  var issue = new Issue(req.body);
  issue.user = req.user;

  issue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(issue);
    }
  });
};

/**
 * Show the current Issue
 */
exports.read = function(req, res) {
  res.jsonp(req.issue);
};

/**
 * Update a Issue
 */
exports.update = function(req, res) {
  var issue = req.issue;

  issue = _.extend(issue, req.body);

  issue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(issue);
    }
  });
};

/**
 * Delete an Issue
 */
exports.delete = function(req, res) {
  var issue = req.issue;

  issue.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(issue);
    }
  });
};

/**
 * List of Issues
 */
exports.list = function(req, res) { 

  // we want only user's issues
  Issue.find({ user: req.user._id }).sort('-created').populate('user', 'fullName').exec(function(err, issues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(issues);
    }
  });
};

/**
 * Issue middleware
 */
exports.issueByID = function(req, res, next, id) { 
  Issue.findById(id).populate('user', 'fullName').exec(function(err, issue) {
    if (err) return next(err);
    if (!issue) return next(new Error('Failed to load Issue ' + id));
    req.issue = issue;
    next();
  });
};

/**
 * Issue authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.issue.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
