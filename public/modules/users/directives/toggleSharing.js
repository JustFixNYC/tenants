'use strict';

angular.module('core').directive('toggleSharing', ['Users', 'Authentication',
  function(Users, Authentication) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm, attrs) {

        if(Authentication.user.sharing.enabled) {
          elm[0].querySelector('input').checked = true;
        }

        elm.bind('click', function(event) {
          if( event.target.tagName === "INPUT" ) {
            if(elm[0].querySelector('input').checked);
            Users.enableSharing(function (user) {
              console.log(user);
              Authentication.user = user;
            });
          }

        });
      }
    };
}]);
