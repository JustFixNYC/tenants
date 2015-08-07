'use strict';

angular.module('issues').filter('areaTitle', function() {
  return function(input) {

    switch(input) {
      case 'generalApt': 
      case 'generalAptContent': 
        return 'Inside Whole Apartment';
      case 'entryHallway': 
      case 'entryHallwayContent': 
        return 'Entry/Hallway Inside Apartment';
      case 'kitchen': 
      case 'kitchenContent': 
        return 'Kitchen';
      case 'bathroom': 
      case 'bathroomContent': 
        return 'Bathroom';
      case 'diningRoom': 
      case 'diningRoomContent': 
        return 'Dining Room';
      case 'livingRoom': 
      case 'livingRoomContent': 
        return 'Living Room / Sitting Room';
      case 'bedrooms': 
      case 'bedroomsContent': 
        return 'Bedrooms';
      case 'publicAreas': 
      case 'publicAreasContent': 
        return 'Public Areas of Building';
      default: return '';
    }
  };
});