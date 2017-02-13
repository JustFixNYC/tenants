'use strict';

var Q = require('q'),
		config = require('./config'),
	  mongoose = require('mongoose'),
    UserSchema = require('../app/models/user.server.model'),
    AdminSchema = require('../app/models/admin.server.model'),
    IdentitySchema = require('../app/models/identity.server.model'),
    Identity = mongoose.model('Identity'),
    Admin = mongoose.model('Admin'),
    User = mongoose.model('User'),
    passport = require('passport'),
  	chalk = require('chalk'),
    prompt = require('prompt');

mongoose.Promise = require('q').Promise;

console.log('JustFix.nyc superuser account creation. Hello....');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	} else {


    var identity = new Identity({
      phone: config.superuser.phone,
      password: config.superuser.pwd,
			roles: ['admin'],
			provider: 'local'
    });
		var admin = new Admin();
		var user = new User({ kind: 'Admin' });

		Q.allSettled([identity.save(), admin.save()])
	    .spread(function (identity, admin) {
				
				// save the ObjectID references of the two documents
	      user._identity = identity.value._id;
	      user._userdata = admin.value._id;

				return user.save();
			})
			.then(function (user) {
				console.log('New superuser created for ' + config.superuser.phone);
				process.exit();
			})
			.catch(function (err) {
				console.error(chalk.red('[SAVE USER]' + err));
				process.exit(1);
			});
  }

});
