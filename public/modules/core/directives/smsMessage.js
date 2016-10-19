'use strict';

angular.module('core')
  .directive('smsMessage', ['deviceDetector', 'Authentication', 'Messages',
  function (deviceDetector, Authentication, Messages) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {


        var getIOSversion = function() {
          // if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
          // } else {
            // this shouldn't happen
            // Rollbar.error("Didn't detect iOS correctly?");
          // }
        }

        var isGtIOS7 = function() {
          if (deviceDetector.os === 'ios' && getIOSversion()[0] > 7) {
            return true;
          } else {
            return false;
          }
        };


        // ios <=7  ;
        // ios >7   &
        // android  ?


        element.on('click', function (e) {

          var href = 'sms:';
          var type = attrs.type;
          var msg = Messages.getShareMessage(type);

          if(attrs.phone && attrs.phone.length) {
            href += attrs.phone;
          }

          if(deviceDetector.os === 'ios') {
            if(isGtIOS7()) href += '&';
            else href += ';';
            href = href + 'body=' + msg;
            console.log('href', href);
            attrs.$set('href', href);
          } else if(deviceDetector.os === 'android') {
            href = href + '?body=' + msg;
            attrs.$set('href', href);
          } else {
            href = href + '?body=' + msg;
            console.log(href);
            console.log('If you were using a phone, the message would be: \n\n' + msg);
          }
        });

      }
    };

  }]);
