'use strict';

var dbConnect = require('./dbConnect');

exports.up = function(next) {

  // Rename Users collection to UsersOld
  // Drop users collection

  // Wait for mongodb Driver to be connected and get the mongodb object
  dbConnect.mongodb.then(function (mongodb) {


    // mongodb.collection('users_old').count().then(function (res) {
    //   console.log(res);
    // });
    // //
    mongodb.collection('users_old')
      .deleteMany({ "geo" : { $exists: false }})
      .then(function (res) {
        console.log('deleted (no geo)', res.result.n);
        // mongodb.close();
        return mongodb.collection('users_old').deleteMany({ $or:
          [
            { "geo.bbl": "3012380016" },
            // { "geo.bbl": "3012170028" },
            { "geo.bbl": "1004510016" }
          ]
        });
      })
      .then(function (res) {
        console.log('deleted (dummy addr)', res.result.n);
        // mongodb.close();
        next();
      })
      .catch(function (err) {
        console.log(err);
      });

  });

};

exports.down = function(next) {

  // dbConnect.mongodb.then(function (mongodb) {
  //   mongodb.collection('users_old').rename('users');
  //   next();
  //   mongodb.close();
  // });


  next();
};
