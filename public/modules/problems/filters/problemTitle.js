'use strict';

angular.module('problems').filter('problemTitle', function() {
  return function(input) {

    switch(input) {
      case 'bedrooms':
        return 'Bedrooms';
      case 'kitchen':
        return 'Kitchen';
      case 'bathroom':
        return 'Bathrooms';
      case 'entireHome':
        return 'Entire Home';
      case 'livingRoom':
        return 'Living Room';
      case 'publicAreas':
        return 'Public Areas';
      case 'landlordIssues':
        return 'Landlord Issues';
      default:
        return '';
        break;
    }
  };
});
