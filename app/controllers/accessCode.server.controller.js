'use strict';

var mongoose = require('mongoose'),
    AccessCode = mongoose.model('AccessCode');

var create = function (req, res) {
	var code = req.code;

	if(code) {
		var newAccessCode = new AccessCode(code);

		newAccessCode.save(function(err, object) {
			if(err) {
				res.status(503).send(err);
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.status(503).send('Incomplete or missing access code information');
	};
};

var get = function (req, res) {
	var accessId = req.body.code;

	// Using findOne since in our save check in the model, we should ONLY be able to save a unique ID
	AccessCode.findOne({id: code}, function(err, accessCode) {
		res.body()
	})
};