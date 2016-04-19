(function() {
  'use strict';

  angular
    .module('onboarding')
    .controller('OnboardingTutorialController', OnboardingTutorialController);

  OnboardingTutorialController.$inject = ['$scope'];

  function OnboardingTutorialController($scope) {
    var vm = this;

    // Onboarding tutorial controller logic
    // ...

    init();

    function init() {
    }
  }
})();
