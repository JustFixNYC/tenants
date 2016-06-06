'use strict';

angular.module('activity').filter('activityTemplate', function() {
  return function(input) {

    var template = '/modules/activity/partials/';
    switch(input) {
      case 'sendLetter':
        template += 'complaint-letter.client.view.html';
        break;
      case 'checklist':
        template += 'checklist.client.view.html';
        break;
      default:
        template += 'default-activity.client.view.html';
        break;
    };
    return template;

  };
});
