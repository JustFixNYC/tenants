'use strict';

var dbConnect = require('./dbConnect'),
    // mongooseDb = dbConnect.mongoose.connection,
    Q = require('q'),
    User = dbConnect.mongoose.model('User'),
    Identity = dbConnect.mongoose.model('Identity'),
    Advocate = dbConnect.mongoose.model('Advocate');

var advocates = require('./advocates.json');

exports.up = function(next) {

  var inserted = 0;

  dbConnect.mongodb.then(function (mongodb) {

    // Seed Advocate users
      // Get advocates from seed file
      // For each seed advocate
        // Create Advocate and Identity, then save
          // Push "advocate" on identity roles
        // Create User
      advocates.forEach(function (advocate) {

        var newIdentity = new Identity(advocate);
        var newAdvocate = new Advocate(advocate);
        var newUser = new User();

        newUser.kind = 'Advocate';
        newIdentity.roles = ['advocate'];
        newIdentity.provider = 'local';

        Q.allSettled([newIdentity.save(), newAdvocate.save()])
          .spread(function (identity, userdata) {

            if(identity.state === 'rejected') {
              throw identity.reason;
            }
            if(userdata.state === 'rejected') {
              throw userdata.reason;
            }

            // save the ObjectID references of the two documents
            newUser._identity = identity.value._id;
            newUser._userdata = userdata.value._id;

            return newUser.save();
          })
          .then(function (user) {
            console.log('new user');

            return mongodb.collection('users_old').remove({ phone: newIdentity.phone });
          })
          .then(function (result) {

            console.log('result ok:' + result.result.ok + ' num:' + result.result.n);

            if(++inserted === advocates.length) {
              next();
            }
          })
          .catch(function (err) {
            console.log('err', err);
          });
      });


  }); // connect to native mongo driver


};

exports.down = function(next) {

  var deleted = 0;

  dbConnect.mongodb.then(function (mongodb) {

    var advocates = mongodb.collection('advocates');
    var identities = mongodb.collection('identities');
    var users = mongodb.collection('users');

    var advocatesCursor = users.find({ kind: 'Advocate' });
    var advocatesLength = advocatesCursor.length;

    advocatesCursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else if (doc !== null) {
        advocates.remove({ _id: doc._userdata });
        identities.remove({ _id: doc._identity });
      } else if (doc === null) {
        users.remove({}, function(err, num) {
          if (err) {
            console.log(err);
          } else {
            mongodb.close();
            next();
          }
        });
      }
    });
  });

};
