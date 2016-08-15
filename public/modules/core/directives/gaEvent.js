'use strict';

angular.module('core')
  .directive('gaEvent', ['deviceDetector', '$window',
  function (deviceDetector, $window) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var a = attrs.gaEvent.split(',');
        var cat = a[0];
        var action = a[1];

        if(a.length == 3) var label = a[2];
        else var label = "";

        element.on('click', function (event) {
          // console.log(cat, action, label);
          $window.ga('send', 'event', cat, action, label);
        });


      }
    };

  }]);
