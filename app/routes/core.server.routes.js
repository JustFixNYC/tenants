'use strict';

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

  app.route('/demo').get(function (req, res) {

    var demoUser = {
      name: "Amy Moore",
      phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
      borough: "Brooklyn",
      address: "654 Park Place",
      unit: "10F",
      nycha: "no",
      password: "password"
    };

    //console.log(serialize(demoUser));
    res.redirect('/#!/issues/create/checklist?' + serialize(demoUser));
  });

};