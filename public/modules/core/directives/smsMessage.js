'use strict';

angular.module('core')
  .directive('smsMessage', ['deviceDetector', 'Authentication', 'Messages',
  function (deviceDetector, Authentication, Messages) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var isIOS8 = function() {
          var deviceAgent = deviceDetector.raw.userAgent.toLowerCase();
          return /(iphone|ipod|ipad).* os [8-9]_/.test(deviceAgent);
        };


        // ios ;
        // ios8 &
        // android ?


        element.on('click', function (e) {

          var href = 'sms:';
          var type = attrs.type;
          var msg = Messages.getShareMessage(type);

          if(attrs.phone && attrs.phone.length) {
            href += attrs.phone;
          }

          if(deviceDetector.os === 'ios') {
            if(isIOS8()) href += '&';
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
