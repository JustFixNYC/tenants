'use strict';

angular.module('core').directive('twitterFollow', ['$timeout', function($timeout) {
  return {
    link: function (scope, element, attr) {
      $timeout(function() {
            twttr.widgets.createFollowButton (
                'JustFixNYC',
                element[0],
                {
                  showScreenName: false,
                  showCount: false
                }
            );
      });
    }
  };
}]);
