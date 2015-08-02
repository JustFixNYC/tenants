'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	fullName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your full name']
	},
  borough: {
    type: String,
    default: ''
  },  
  address: {
    type: String,
    default: ''
  }, 
  unit: {
    type: String,
    default: ''
  }, 	
	issues: {
		type: Schema.Types.Mixed,
		default: {}
	}, 
	toDoActions: [{
		title: String,
		step: Number,
		addIf: [String],
		added: { type: Date, default: Date.now }
	}], 
	// email: {
	// 	type: String,
	// 	trim: true,
	// 	default: '',
	// 	validate: [validateLocalStrategyProperty, 'Please fill in your email'],
	// 	match: [/.+\@.+\..+/, 'Please fill a valid email address']
	// },
	phone: {
		type: String,
		unique: true,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your phone number'],
		match: [/[0-9]{7}/, 'Please fill a valid phone number']
	},	
	// username: {
	// 	type: String,
	// 	unique: 'testing error message',
	// 	required: 'Please fill in a username',
	// 	trim: true
	// },
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

// UserSchema.methods.addToDo = function(title, step, addIf) {
// 	var _this = this;

// 	//console.log(_this);
// 	_this.findById( _this._id, function(err, user) {
// 		console.log(_this);

// 		_this.toDoActions.push({
// 			title: title,
// 			step: step,
// 			addIf: addIf
// 		});

// 		_this.save(function (err) {
// 			if(err) throw new Error("something bad");
// 		})
// 	})
// };

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);