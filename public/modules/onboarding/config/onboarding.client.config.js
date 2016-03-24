(function() {
  'use strict';

  // Onboarding module config
  angular
    .module('onboarding')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Config logic
    // ...
  }
})();
