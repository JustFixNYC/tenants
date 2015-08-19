'use strict';

angular.module('actions')
  .directive('smsMessage', ['deviceDetector', 'Messages', function (deviceDetector, Messages) {  
    return {
      restrict: 'A',
      scope: false,
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

          if(scope.superphone) href += scope.superphone;

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
            // alert('If you were using a phone, the message would be: \n\n' + msg);
            return;
          }

          return href;
        };


        scope.$watch(scope.superphone, function() {

          console.log('y');
          generateURL();
        });

       // element.bind('click', function (event) { console.log('generate'); smsHref = generateURL();  });
        
      }
    };

  }]);