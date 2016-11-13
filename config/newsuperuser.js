var config = require('./config'),
	  mongoose = require('mongoose'),
    UserSchema = require('../app/models/user.server.model'),
    User = mongoose.model('User'),
    passport = require('passport'),
  	chalk = require('chalk'),
    prompt = require('prompt');

console.log('JustFix.nyc superuser account creation. Hello....');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	} else {


    var user = new User({
      firstName: "Just",
      lastName: "Fix",
			address: "654 Park Place",
			borough: "Brooklyn",
			provider: "local",
      phone: config.superuser.phone,
      password: config.superuser.pwd
    });

    user.roles.push('admin');
    user.provider = 'local';

    user.save(function(err) {
        if(err) {
          console.error(chalk.red('[SAVE USER]' + err));
          process.exit(1);
        } else {
          console.log(user.fullName + ' successfully made admin');
          process.exit();
        }
    });

  }

});
