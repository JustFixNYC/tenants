'use strict';

angular.module('core').directive('toggleSharing', ['Users', 'Authentication',
  function(Users, Authentication) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, elm, attrs) {

        if(Authentication.user && Authentication.user.sharing.enabled) {
          elm[0].querySelector('input').checked = true;
        }

        elm.bind('touchstart click', function(event) {
          event.stopPropagation();
          event.preventDefault();

          elm[0].querySelector('input').checked = !elm[0].querySelector('input').checked;

          if(Authentication.user) {
            Users.toggleSharing(function (user) {
              Authentication.user = user;
            });
          } else if(scope.newUser) {
            scope.newUser.sharing.enabled = elm[0].querySelector('input').checked;
            scope.$apply();
          }

        });
      }
    };
}]);
