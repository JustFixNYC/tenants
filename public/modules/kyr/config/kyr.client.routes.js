(function () {
  'use strict';

  //Setting up route
  angular
    .module('kyr')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Kyr state routing
    $stateProvider
      .state('kyr', {
        url: '/kyr',
        templateUrl: 'modules/kyr/views/kyr.client.view.html',
        controller: 'KyrController'
      })
      .state('kyrDetail', {
      	url: '/kyr/:kyrId',
      	templateUrl: 'modules/kyr/views/kyr-detail.client.view.html',
      	controller: 'KyrDetailController'
      });
  }
})();
