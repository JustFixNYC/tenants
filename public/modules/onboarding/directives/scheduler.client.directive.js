'use strict';

angular.module('onboarding').directive('scheduler', ['$sce', '$location', 'Authentication', 'Users', function scheduler($sce, $location, Authentication, Users) {
  return {
    templateUrl: 'modules/onboarding/partials/scheduler.client.view.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.user = Authentication.user;

      scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      scope.hasScheduled = false;

      var currentLocation = $location.protocol() + '://' + $location.host() + (($location.port() !== 80 || $location.port() !== 443) ? ':' + $location.port() : '');


      scope.acuity = 'https://app.acuityscheduling.com/schedule.php?owner=13287615';

      if(scope.user) {
        scope.acuity += '&firstName=' + scope.user.firstName;
        scope.acuity += '&lastName=' + scope.user.lastName;
        scope.acuity += '&email=' + 'support@justfix.nyc';
        scope.acuity += '&phone=' + scope.user.phone;
        scope.acuity += '&field:2631340=' + currentLocation + '/share/' + scope.user.sharing.key;
      }


      window.addEventListener("message", function(e) {


        if(e.data && typeof e.data === 'string') {
          if (e.origin === 'https://app.acuityscheduling.com' && e.data.indexOf('sizing') > -1) {
            var height = parseInt(e.data.split(':')[1], 10);
            if(height > 0) element.find('iframe').attr('height', height + 'px');
          } else if (e.origin === 'https://sandbox.acuityinnovation.com' && e.data.indexOf('custombooking') > -1) {
            var bookingID = e.data.split(':')[1];

            // We could force update the user document post-webhook here
            // i.e. simply do Users.me();
            // (Instead we're doing it when the user leaves this view -
            //  see: line 11, public/modules/onboarding/config/onboarding.client.config.js)
            scope.hasScheduled = true;
            scope.$apply();
            console.log('scheduled', bookingID);
          }
        }




      });
    }
  };
}]);
