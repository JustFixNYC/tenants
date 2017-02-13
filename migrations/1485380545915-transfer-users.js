'use strict';

var dbConnect = require('./dbConnect'),
    Q = require('q'),
    _ = require('lodash'),
    User = dbConnect.mongoose.model('User'),
    Identity = dbConnect.mongoose.model('Identity'),
    Advocate = dbConnect.mongoose.model('Advocate'),
    Tenant = dbConnect.mongoose.model('Tenant');

dbConnect.mongoose.Promise = require('q').Promise;

exports.up = function(next) {

  dbConnect.mongodb.then(function (mongodb) {

    // get the collection needed
    var users = mongodb.collection('users_old');

    // get all advocates for cross-referencing
    // getting them all upfront will save on async calls, especially because
    // theres only a few of them
    mongodb.collection('advocates').find({}).toArray().then(function (docs) {

      var advocates = docs;

      // these will hold documents to be inserted so they can
      // all be inserted as once. only performant way to do it
      var tenantsToBeInserted = [];
      var identitiesToBeInserted = [];
      var usersToBeInserted = [];

      // store the total number needed so we can keep track
      var userCursor = users.find({});
      var totalNumOfUsers = userCursor.length;

      // For each user in UsersOld
      userCursor.each(function (err, doc) {
        if (err) {
          console.log('[1]', err);

        } else if (doc !== null) {

          // it feels like it'll cause problems if we keep this
          // its just the old ref id and mongo won't want us to reuse it
          delete doc._id;

          // Create Tenant and Identity
          var newIdentity = new Identity(doc);
          var newTenant = new Tenant(doc);

          newIdentity.provider = 'local';
          newIdentity.roles = [ "tenant" ];

          // If they have a referral:
          if(doc.referral) {

            // see if advocate has been seeded
            // use toLowerCase in order to be case insensitive
            var advocate = _.find(advocates, function(ad) { return ad.code === doc.referral.code.toLowerCase(); });

            if(advocate) {
              newTenant.advocate = advocate._id;
              newTenant.advocateRole = 'linked';
            }
          }

          // add just the OBJECT to the array - if we add the mongoose instance
          // there is a bunch of menthods and stuff that breaks the insertion
          tenantsToBeInserted.push(newTenant.toObject());
          identitiesToBeInserted.push(newIdentity.toObject());

        // end of loop
        } else if (doc === null) {

          console.log('tenants to be inserted', tenantsToBeInserted.length);
          console.log('identities to be inserted', identitiesToBeInserted.length);


          // insert new arrays
          Q.allSettled([
                Tenant.collection.insertMany(tenantsToBeInserted),
                Identity.collection.insertMany(identitiesToBeInserted)
              ])
              .spread(function (tenants, identities) {

                if(tenants.state === 'rejected') {
                  throw tenants.reason;
                }
                if(identities.state === 'rejected') {
                  throw identities.reason;
                }

                // assuming all is well, now we have to go back thru all of them
                // in order to create the user documents
                // this sucks, i know, but batch inserting the docs and losing our
                // reference points seems to be the only way to do it
                var tenantsCollection = mongodb.collection('tenants');
                var identitiesCollection = mongodb.collection('identities');

                var itr = 0;

                tenantsCollection.find({}).each(function (err, tenant) {

                  if (err) {
                    console.log('[2]', err);

                  } else if(tenant !== null) {

                    // this is a series of aync calls that get made for each iteration of the tenants.find() loop
                    // we use the itr to keep track of when the last async call completes
                    identitiesCollection.findOne({ phone: tenant.phone }, function (err, identity) {
                      if (err) {
                        console.log('[3]', err);
                      } else if (!identity) {
                        console.log('no matching identity found?? this shouldn\'t happen');
                      } else {

                        // finally, create the user document
                        var newUser = new User();
                        newUser.kind = 'Tenant';

                        newUser._identity = identity._id;
                        newUser._userdata = tenant._id;

                        usersToBeInserted.push(newUser.toObject());

                        // this means its the last async call
                        if(++itr === tenantsToBeInserted.length) {

                          console.log('users to be inserted', usersToBeInserted.length);

                          User.collection.insertMany(usersToBeInserted)
                            .then(function (users) {
                              console.log('users sucessfully inserted', users.result.n);
                              next();
                            });
                        }
                      }
                    });   // end identity find

                  }

                }); // end tenants loop
              })
              .catch(function (err) {
                console.log('[4]', err);
              });

        }

      }); // iterate over users

    }); // get advocates array

  }); // db connect
};

exports.down = function(next) {


  dbConnect.mongodb.then(function (mongodb) {

    var identities = mongodb.collection('identities');

    identities.remove({ roles: "user" })
      .then(function (result) {
        return mongodb.collection('tenants').drop();
      })
      .then(function (result) {
        return mongodb.collection('users').remove({ kind: "Tenant" });
      })
      .then(function (result) {
        next();
      })
      .catch(function (err) {
        console.log(err);
      });

  });





};
