'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		// support mongodb >= 3.2 (default: WiredTiger engine)
		// "errmsg" : "E11000 duplicate key error collection: mean-dev.users index: email_1 dup key: { : \"test@user.com\" }"
		var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('index: ') + 7, err.errmsg.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' is already registered.';

	} catch (ex) {
		output = 'Unique field already exists';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	var message = '';

	console.log('[ERROR]', err);
	console.log('[ERROR CODE]', err.code);

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	} else if (err.errors && err.errors.length === 1) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	} else {
		message = err;
	}

	console.log('[ERROR MESSAGE]', message);
	return message;
};
