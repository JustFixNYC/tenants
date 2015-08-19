'use strict';

angular.module('actions').controller('ContactSuperController', ['$scope', '$modalInstance', 'deviceDetector', 'Messages', 'newActivity',
  function ($scope, $modalInstance, deviceDetector, Messages, newActivity) {

    $scope.newActivity = newActivity;

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

      if($scope.superphone) href += $scope.superphone;

      if(deviceDetector.os === 'ios') {
        if(isIOS8()) href += '&';
        else href += ';';
        href = href + 'body=' + msg;
      } else if(deviceDetector.os === 'android') {
        href = href + '?body=' + msg;
      } else {
        // alert('If you were using a phone, the message would be: \n\n' + msg);
        return;
      }

      return href;
    };


  $scope.done = function (type, event) {

    var href = '';
    if(type === 'sms') href = generateURL();
    else if(type === 'tel' && $scope.superphone) href = 'tel:' + $scope.superphone;
    
    $modalInstance.close($scope.newActivity);
    if(href.length) window.location.href = href;
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);