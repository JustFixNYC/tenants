'use strict';

angular.module('core').filter('tel', function () {
  return function (tel) {
    if (!tel) { return ''; }
    
    var value = tel.toString().trim().replace(/^\+/, '');
    
    if (value.match(/[^0-9]/)) { return tel; }

    var country, city, number;

    switch (value.length) {
      case 1:
      case 2:
      case 3:
        city = value;
        break;
      default:
        city = value.slice(0, 3);
        number = value.slice(3);
    }

    if(number) {
      if(number.length>3) {
        number = number.slice(0, 3) + '-' + number.slice(3,7);
      }
      else {
        number = number;
      }
      return ('(' + city + ') ' + number).trim();
    }
    else {
      return '(' + city;
    }
  };
});