angular.module('onboarding')
  .directive('pwCheck', [function () {
    return {
    	require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = attrs.pwCheck;
        elem.on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===document.getElementById(firstPassword).value;
            ctrl.$setValidity('pwmatch', v);
            console.log(v);
          });
        });
      }
    }
  }]); 