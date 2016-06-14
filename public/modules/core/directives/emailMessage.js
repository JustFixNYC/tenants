'use strict';

angular.module('core')
  .directive('emailMessage', ['deviceDetector', 'Authentication', 'Messages',
  function (deviceDetector, Authentication, Messages) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var msg = Messages.getShareMessage("share");
        var href = 'mailto:' + encodeURI('?subject=' + Authentication.user.fullName + ' - JustFix.nyc Case History&body=' + msg);
        attrs.$set('href', href);

      }
    };

  }]);
