var init = require('./init')(),
    config = require('./config'),
	  mongoose = require('mongoose'),
    UserSchema = require('../app/models/user.server.model'),
    User = mongoose.model('User'),
    passport = require('passport'),
  	chalk = require('chalk'),
    prompt = require('prompt');

console.log('JustFix.nyc superuser account creation. Hello....');

var promptSchema = {
  properties: {
    phone: {
      description: 'Enter the account phone number',
      required: true
    },
    password: {
      description: 'Enter the account password',
      hidden: true
    }
  }
};

prompt.start();

prompt.get(promptSchema, function (err, result) {
  var phone = result.phone;
  var password = result.password;

  // Bootstrap db connection
  var db = mongoose.connect(config.db, function(err) {
  	if (err) {
  		console.error(chalk.red('Could not connect to MongoDB!'));
  		console.log(chalk.red(err));
  	} else {

      User.findOne({ phone: phone },
        function(err, user) {
          if (err) {
            console.error(chalk.red('[FIND USER]' + err));
            process.exit(1);
          } else if (!user) {
            console.error(chalk.red('[FIND USER] No user object...'));
            process.exit(1);
          } else if (user.roles.indexOf('admin') != -1) {
            console.error(chalk.red('[SAVE USER] User ' + user.fullName + ' is already an admin'));
            process.exit(1);
          } else if (!user.authenticate(password)) {
            console.error(chalk.red('[SAVE USER] Incorrect password, you fool.'));
            process.exit(1);
          } else {
            // mongoose is going to rehash the password once you update the model
            // see app/models/user.server.model.js line 132
            // this is weird but necessary
            user.password = password;

            user.roles.push('admin');
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
    }

  });


});
