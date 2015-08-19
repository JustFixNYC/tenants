'use strict';

angular.module('actions')
  .directive('smsMessage', ['deviceDetector', 'Messages', function (deviceDetector, Messages) {  
    return {
      restrict: 'A',
      scope: {
        phone: '='
      },
      link: function (scope, element, attrs) {

        var isIOS8 = function() {
          var deviceAgent = deviceDetector.raw.userAgent.toLowerCase();
          return /(iphone|ipod|ipad).* os 8_/.test(deviceAgent);
        };

        var generateURL = function() {

          // ios ;
          // ios8 &
          // android ?

          var href = 'sms:';
          var msg = Messages.getSMSMessage();

          if(scope.phone) href += scope.phone;

          if(deviceDetector.os === 'ios') {
            if(isIOS8()) href += '&';
            else href += ';';
            href = href + 'body=' + msg;
            attrs.$set('href', href);
          } else if(deviceDetector.os === 'android') {
            href = href + '?body=' + msg;
            attrs.$set('href', href);
          } else {
            alert('If you were using a phone, the message would be: \n\n' + msg);
            return;
          }
        };

        element.bind('click', function (event) { console.log('something'); generateURL(); });
        
      }
    };

  }]);