'use strict';

angular.module('core').directive('toggleSharing', [
  function() {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm, attrs) {

        scope.check = function() {

          elm[0].querySelector('input').checked = !elm[0].querySelector('input').checked;
        };

      }
    };
}]);
