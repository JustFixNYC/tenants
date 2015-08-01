'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var issues = require('../../app/controllers/issues.server.controller');

  // Issues Routes
  app.route('/issues')
    .get(issues.list)
    .post(users.requiresLogin, issues.create);

  app.route('/issues/:issueId')
    .get(issues.read)
    .put(users.requiresLogin, issues.hasAuthorization, issues.update)
    .delete(users.requiresLogin, issues.hasAuthorization, issues.delete);

  // Finish by binding the Issue middleware
  app.param('issueId', issues.issueByID);
};