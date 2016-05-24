(function () {
  'use strict';

  //Setting up route
  angular
    .module('kyr')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    // Kyr state routing
    $stateProvider
      .state('kyr', {
        url: '/kyr',
        templateUrl: 'modules/kyr/views/kyr.client.view.html',
        controller: 'KyrController',
        noMargin: true
      })
      .state('kyrDetail', {
      	url: '/kyr/:kyrId',
      	templateUrl: 'modules/kyr/views/kyr-detail.client.view.html',
      	controller: 'KyrDetailController',
      	noMargin: true,
				data: {
					disableBack: true
				},
				localHistory: true
      });
  }
})();
