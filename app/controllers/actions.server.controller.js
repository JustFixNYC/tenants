'use strict';

var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  addressHandler = require('../services/address.server.service'),
  mongoose = require('mongoose'),
  Tenant = mongoose.model('Tenant'),
  fullActions = require('../data/actions.json');

/* things:

add item to list
remove item from list
update item in list
replace entire list
apply logic to recreate list (then replace)

once user logs in, start child process...

1. get subset based on user.currentstep
2. filter by flags


*/


var getAreaActions = function(user) {

  var areaActions = [];
  var issues = user.issues;
  var problems = user.problems;


  // {
  //   "title": "Complete your Issue Checklist",
  //   "activityTitle": "DHCR Decreased Services App",
  //   "content": "In order to create a letter of complaint and other actions",
  //   "key": "decreasedServices",
  //   "addIf": ["getRentalHistory"],
  //   "type": "once",
  //   "cta": {
  //     "type": "link",
  //     "buttonTitle": "View form",
  //     "url": "http://www.nyshcr.org/forms/rent/ra84.pdf"
  //   },
  //   "followUp": {
  //     "title": "Have you heard back from DHCR yet?"
  //   }
  // },

  if(problems.length == 0) {
    areaActions.push({
      title: 'actions.catchAction.title',
      content: 'actions.catchAction.content',
      addIf: ['initial'],
      type: 'once',
      cta: {
        type: 'link-internal',
        buttonTitle: 'actions.catchAction.cta.buttonTitle',
        url: 'updateProblems'
      },
      hasFollowUp: false
    });
  }

  for(var i = 0; i < problems.length; i++) {

    var p = problems[i];

    // make sure that area isn't already in action flags
    // this means that the user hasn't "added details"
    if(!_.contains(user.actionFlags, p.key)) {
      areaActions.push({
        title: 'actions.addDetails.' + p.key + '.title',
        activityTitle: 'actions.addDetails.' + p.key + '.activityTitle',
        content: 'actions.addDetails.' + p.key + '.content',
        key: p.key,
        addIf: ['initial'],
        type: 'once',
        cta: {
          type: 'initialContent',
          buttonTitle: 'actions.addDetails.' + p.key + '.cta.buttonTitle',
          template: 'add-details.client.view.html',
          controller: 'AddDetailsController'
        },
        isFollowUp: false,
        hasFollowUp: false
      });
    }
  }

  return areaActions;
};

/**
 * Iterate through full list of actions and detirmine where the
 * user is at. Return that list.
 *
 */
var generateActions = function(user) {

  var actions = getAreaActions(user);

  //iterate through full list of actions, push
  fullActions.forEach(function (action) {

    // check addIf array against user.actionFlags
    // if length = 0, means that one of the addIf flags exists for the user
    var add = _.intersection(action.addIf, user.actionFlags).length;

    // prevents actions from being listed after completed
    // [TODO] check against time since completion
    // var reject = user.actionFlags.indexOf(action.key) !== -1 && action.type == 'once';

    var reject = _.contains(user.actionFlags, action.key) && action.type == 'once';

    if(add && !reject) {
      if(action.followUp) action.hasFollowUp = true;
      else action.hasFollowUp = false;

      // checks if action is a followup or not
      var followUpKeys = _.pluck(user.followUpFlags, 'key');

      if(_.contains(followUpKeys, action.key)) {
        // console.log('found', _.find(user.followUpFlags, { key: action.key}).startDate);
        action.isFollowUp = true;
        action.startDate = _.find(user.followUpFlags, { key: action.key}).startDate;
      }
      else action.isFollowUp = false;

      actions.push(action);
    }

    // actions.push(action);   // DEBUG

  });

  return actions;
};

var list = function(req, res) {
  var user = req.user;
  var key = req.query.key;

  // get actions to be added (and make sure they haven't been done yet)
  if(user && key) {

    // disabling this for the time being...
    // seems like a chicken/egg problem where this call to generateActions already has the new cards
    // var actionKeys = _.pluck(generateActions(user), 'key');

    var newActions = fullActions.filter(function (action) {
      // var valid = _.contains(action.addIf, key) && !_.contains(actionKeys, action.key);
      // var valid = _.contains(action.addIf, key);
      if(_.contains(action.addIf, key)) {
        if(action.followUp) action.hasFollowUp = true;
        else action.hasFollowUp = false;
        return true;
      } else {
        return false;
      }
    });
    res.json(newActions);

  } else if(user) {
    var actions = generateActions(user);                  // get a curated list
    res.json(actions);
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 *
 *      TODO: decouple this from req.user and updating tenant directly
 *
 */
var followUp = function(req, res) {

  var userdata = req.user._userdata,
      key = req.body.key,
      startDate = req.body.startDate;       // this might be undefined - mongoose assigns the default value
  var query;

  // var oldBody = _.clone(req.body);
  // req.body = {};                          // building this to send to users.update


  if(req.query.type === 'add') {
    query = Tenant.update({ '_id': userdata }, {$addToSet: { 'followUpFlags': { key: key, startDate: startDate } }});
    req.body.isFollowUp = true;
  }
  else {
    query = Tenant.update({ '_id': userdata }, {$pull: { 'followUpFlags': { key : key } }});
    req.body.isFollowUp = false;
  }

  query.exec(function(err, numAffected) {
    if(err) return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(req.body);
  });

};

module.exports = {
  list: list,
  followUp: followUp
};
