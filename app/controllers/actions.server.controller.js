'use strict';

var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  addressHandler = require('../services/address.server.service'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
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

var areaTitle = function(area) {
  switch(area) {
    case 'generalApt': return 'Whole Apartment';
    case 'entryHallway': return 'Entry/Hallway';
    case 'kitchen': return 'Kitchen';
    case 'bathroom': return 'Bathrooms';
    case 'diningRoom': return 'Dining Room';
    case 'livingRoom': return 'Living Room';
    case 'bedrooms': return 'Bedrooms';
    case 'publicAreas': return 'Public Areas';
    default: return '';
  }  
};

var getAreaActions = function(user) {

  var areaActions = [];
  var issues = user.issues;

  for(var area in issues) {
    if(issues[area].length) {

      // make sure that area isn't already in action flags
      if(user.actionFlags.indexOf(area) === -1) {

        areaActions.push({
          title: 'Text/Photos',
          content: 'Add some initial information about your <b>' + areaTitle(area) + '</b> issues. This will help to provide evidence for the issues you selected.',
          key: area,
          addIf: ['initial'],
          cta: {
            type: 'initialContent',
            buttonTitle: 'Add Details',
            template: 'update-activity.client.view.html',
            controller: 'UpdateActivityController'
          },
          isFollowUp: false       
        });

      }
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
    var reject = user.actionFlags.indexOf(action.key) !== -1;

    // checks if action is a followup or not
    if(user.followUpFlags.indexOf(action.key) !== -1) action.isFollowUp = true;
    else action.isFollowUp = false;

    if(add && !reject) actions.push(action);

  });

  return actions;
};

var list = function(req, res) {
  var user = req.user;
  if(user) {
    var actions = generateActions(user);
    res.json(actions);
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


var followUp = function(req, res) { 
  
  var id = req.user._id,
      key = req.body.key;
  var query;

  if(req.query.type === 'add') {
    query = User.update({ '_id': id }, {$addToSet: { 'followUpFlags': key }});
    req.body.isFollowUp = true;
  }
  else {
    query = User.update({ '_id': id }, {$pull: { 'followUpFlags': key }});
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