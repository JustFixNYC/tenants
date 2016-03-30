'use strict';

var mongoose = require('mongoose'),
    AccessCode = mongoose.model('AccessCode');

var save = function (req, res) {
	var code = req.body;

	if(code) {
		var newAccessCode = new AccessCode(code);

		newAccessCode.save(function(err, object) {

			if(err) {
				res.status(403).json('' + err);
			} else {
				res.json('SUCCESS!');
			}

		});
	} else {
		res.send('Incomplete or missing access code information');
	};
};

var list = function (req, res) {

	if(!req.query) req.query = {};

	// Using findOne since in our save check in the model, we should ONLY be able to save a unique ID
	AccessCode.find(req.query, function(err, accessCode) {
		res.send(accessCode);
	});
};

var remove = function(req, res) {
	var sentCode = req.body;

	if(!req.query) req.query = {code: 'DO NOT DELETE'};
	console.log(req);

	AccessCode.find(req.query).remove(function(err) {
		console.log(err);

		if(err) {
			res.send('You dun goof\'d');
			return;
		}
		res.send('Code Deleted');
	});

}
 
module.exports = {
	save: save,
	get: list,
	remove: remove
};