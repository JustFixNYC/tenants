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
          event.stopPropagation();
          console.log(event.target.tagName);
          if( event.target.tagName === "INPUT") {
            // alert('clicked');
            // elm[0].querySelector('input').checked = !elm[0].querySelector('input').checked;
            Users.enableSharing(function (user) {
              Authentication.user = user;
            });
          }

        });
      }
    };
}]);
