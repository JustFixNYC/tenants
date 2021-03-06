'use strict';

var _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    problems = require('../../public/data/checklist.json');

/**
  *   Utility functions. These are used on the front-end as well.
  */

Object.defineProperty(Array.prototype, "containsByKey", {
    enumerable: false,
    writable: true,
    value: function(key) {
      var i, l = this.length;
      for (i = 0; i < l; i++) if (this[i].key == key) return true;
      return false;
    }
});

Object.defineProperty(Array.prototype, "getByKey", {
    enumerable: false,
    writable: true,
    value: function(key) {
      var i, l = this.length;
      for (i = 0; i < l; i++) if (this[i].key == key) return this[i];
      return null;
    }
});

Object.defineProperty(Array.prototype, "removeByKey", {
    enumerable: false,
    writable: true,
    value: function(key) {
      var i, l = this.length;
      for (i = l-1; i >= 0; i--) if (this[i].key == key) this.splice(i,1);
      return;
    }
});


exports.getProblemKeys = function() {
  return _.pluck(problems, 'key');
};


var createProblemActivities = function(user, added, removed, byName) {

  var newActivities = [];

 	if(!added && !removed) {
 		return;
 	}

  if(added.length) {
    user.activity.push({
      key: 'checklist',
      title: 'modules.activity.other.added',
      problems: added,
      loggedBy: byName
    });
  }
  if(removed.length) {
    user.activity.push({
      key: 'checklist',
      title: 'modules.activity.other.removed',
      problems: removed,
      loggedBy: byName
    });
  }

};

/**
  *
  * Do a "diff" comparing two sets of problems - variable `prime` is compared to the `base`
  *
  */
var checkProblems = function(user, prblms, _prblms) {

  var changed = [];

  /**
    *
    * Iterate through the new problems to see what's been changed
    *
    */
  for(var i = 0; i < _prblms.length; i++) {

    // Current potential problem
    var _prblm = _prblms[i];

    // If the user hasn't completed the `Add Details` step for this problem, don't count it
    // if(!_.contains(_.pluck(user.activity, 'key'), _prblm.key)) {
    //   continue;
    // }

    // (3) if this problem is new, add it and all its issues
    if(!prblms.containsByKey(_prblm.key)) {

      // console.log(_prblm.key + ' not in base problems');

      changed.push({
        title: _prblm.title,
        key: _prblm.key,
        issues: _prblm.issues
      });

    // Problem exists, but has the user changed any issues?
    } else {

      // Current user issues
      var issues = prblms.getByKey(_prblm.key).issues;

      var changedIssues = [];

      for(var j = 0; j < _prblm.issues.length; j++) {

        // Potential issues
        var _issue = _prblm.issues[j];

        // Is this issue not currently in the user acct?
        if(!issues.containsByKey(_issue.key)) {
          changedIssues.push(_issue);
        }
      }

      // (4) User has updated issues within an existing problem
      if(changedIssues.length) {
        // console.log('changed issues for ' + _prblm.key, changedIssues);
        changed.push({
          title: _prblm.title,
          key: _prblm.key,
          issues: changedIssues
        });
      }

    }   // Potential problem exists already

  }   // For each potential problem

  return changed;
};



/**
  *   This compares updates to the checklist, and adds appropriate Activities
  *   based on things getting added or removed.
  *
  *   There are 4 basic possibilies:
  *
  *   1. User doesn't exist yet and no problems were created: do nothing
  *   2. User doesn't exist yet and some problems were created: add everything
  *   3. Add/remove problem and all its issues
  *   4. Add/remove just some new issues within the problem
  *
  *
  */
exports.updateActivitiesFromChecklist = function(req, res, next) {

  var _prblms = req.body.problems;

  // new user OR advocate user creating managed account
  if(!req.user || (req.user.roles[0] === 'advocate' && !res.locals.tenant)) {

    // (1) new user who didn't enter any problems
    if(!_prblms) next();

    // (2) activity array hasn't been created yet
    req.body.activity = [];

    // goofy and inelegant :~(
    // need to store the loged by info for the new activities
    var byName;
    if(req.user) {
      byName = req.user.fullName;
    } else {
      byName = req.body.firstName + ' ' + req.body.lastName;
    }

    createProblemActivities(req.body, _prblms, [], byName);
    next();

  // returning user OR advocate user updating managed account
  } else {

    var prblms;
    if(res.locals.tenant) {
      prblms = res.locals.tenant.problems;
    } else {
      prblms = req.user.problems;
    }

    var added = checkProblems(req.body, prblms, _prblms),
        removed = checkProblems(req.body, _prblms, prblms);

    createProblemActivities(req.body, added, removed, req.user.fullName);

    // only take relevant properties
    // for (var prop in req.body) {
    //   if (req.body.hasOwnProperty(prop) && !(prop == 'problems' || prop == 'activity')) {
    //     delete req.body[prop];
    //   }
    // }

    // console.log(_user);

    // var newBody = {
    //   activity: req.body.activity,
    //   problems: req.body.problems
    // };
    // req.body = newBody;

    next();
  }

};
