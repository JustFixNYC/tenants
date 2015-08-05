'use strict';

angular.module('issues').filter('areaTitle', function() {
  return function(input) {
    switch(input) {
      case 'generalApt': return 'Inside Whole Apartment';
      case 'entryHallway': return 'Entry/Hallway Inside Apartment';
      case 'kitchen': return 'Kitchen';
      case 'bathroom': return 'Bathroom';
      case 'diningRoom': return 'Dining Room';
      case 'livingRoom': return 'Living Room / Sitting Room';
      case 'bedrooms': return 'Bedrooms';
      case 'publicAreas': return 'Public Areas of Building';
      default: return '';
    }
  };
});