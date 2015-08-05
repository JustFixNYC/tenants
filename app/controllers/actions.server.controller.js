'use strict';

var _ = require('lodash'),
  q = require('q'),
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
    case 'generalApt': return 'Inside Whole Apartment';
    case 'entryHallway': return 'Entry/Hallway Inside Apartment';
    case 'kitchen': return 'Kitchen';
    case 'bathroom': return 'Bathroom';
    case 'diningRoom': return 'Dining Room';
    case 'livingRoom': return 'Living Room / Sitting Room';
    case 'bedrooms': return 'Bedrooms';
    case 'publicAreas': return 'Public Areas of Building';
    default: return '';
  }  
};

var getAreaActions = function(issues) {

  var areaActions = []

  for(var area in issues) {
    if(issues[area].length) {
      areaActions.push({
        "title": areaTitle(area),
        "key": area,
        "addIf": ["initial"]       
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

  var actions = [];
  
  actions = actions.concat(getAreaActions(user.issues));

  //iterate through full list of actions, push 
  fullActions.forEach(function (action) {

    // check addIf array against user.actionFlags
    // if length = 0, means that one of the addIf flags exists for the user
    var add = _.intersection(action.addIf, user.actionFlags).length;

    // prevents actions from being listed after completed
    // [TODO] check against time since completion
    var reject = user.actionFlags.indexOf(action.key) !== -1;

    if(add && !reject) actions.push(action);

  });

  return actions;
};


var getInitialActions = function() {
  var deferred = q.defer();
  fs.readFile('app/data/actions.json', 
    function (err, data) {
      if (err) {
        new Error('Failed to load default actions');
        deferred.reject();
      }
      var obj = JSON.parse(data);


      // obj.actions.forEach(function(action) {
      //   user.actions.push(action);
      // });
      deferred.resolve(obj.actions);
  });
  return deferred.promise;
};

var populateActions = function(id) {
  var deferred = q.defer();
  // var action = {
  //   "title": "New Action",
  //   "step": 0,
  //   "addIf": []
  // };
  //getInitialActions().then(function (actions) {

    //console.log('actions', actions);

    User.update({ '_id': id },
      {$push: { 'actions': { $each: actions }}},
      function(err, numAffected) {
        if(err) deferred.reject(err);
        else deferred.resolve();
    }); 
 // });

  return deferred.promise;
};

var replaceActions = function(id, newActions) {
  var deferred = q.defer();
  var action = {
    'title': 'New Action',
    'step': 0,
    'addIf': []
  };

  User.update({ '_id': id },
    {$push: { 'actions': action }},
    function(err, numAffected) {
      if(err) deferred.reject(err);
      else deferred.resolve();
  });

  return deferred.promise;
};


var emptyActions = function(id) {
  var deferred = q.defer();
  // var action = {
  //   "title": "New Action",
  //   "step": 0,
  //   "addIf": []
  // };

  User.update({ '_id': id },
      {$set: { 'actions': [] }},
      function(err, numAffected) {
        if(err) deferred.reject(err);
        else deferred.resolve();
      });

  return deferred.promise;
};

var addActionFlag = function(id, flag) {
  var deferred = q.defer();


  User.update({ '_id': id },
    {$push: { 'actionFlags': flag }},
    function(err, numAffected) {
      if(err) deferred.reject(err);
      else deferred.resolve();
    });

  return deferred.promise;
};

var list = function(req, res) {


  var user = req.user;
  if(user) {

    var actions = generateActions(user);
    //console.log(actions);

    res.json(actions);

    // populateActions(user._id)
    //   .then(function() {
    //     //console.log(user.actions);
        
    //   })
    //   .catch(function(err) {
    //     new Error(err);
    //   });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }

};

module.exports = {
  addActionFlag: addActionFlag,
  populateActions: populateActions,
  list: list
};