'use strict';

angular.module('issues').filter('areaTitle', function() {
  return function(input) {

    switch(input) {
      case 'generalApt': 
        return 'Whole Apartment';
      case 'entryHallway': 
        return 'Entry/Hallway';
      case 'kitchen': 
        return 'Kitchen';
      case 'bathroom': 
        return 'Bathrooms';
      case 'diningRoom': 
        return 'Dining Room';
      case 'livingRoom': 
        return 'Living Room';
      case 'bedrooms': 
        return 'Bedrooms';
      case 'publicAreas': 
        return 'Public Areas';
      default: return input;
    }
  };
});