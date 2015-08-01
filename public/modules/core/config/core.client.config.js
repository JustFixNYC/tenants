'use strict';

// Setting up route
angular.module('core').run(['$rootScope',
  function($rootScope) {
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //   console.log('state change start', toState);
    // });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      // $rootScope.currentStateName = toState.name;
      // switch($rootScope.currentStateName) {
      //   case 'createIssue.general':
      //     $rootScope.currentStateTitle = 'General Info';
      //     break;   
      //   case 'createIssue.location':
      //     $rootScope.currentStateTitle = 'Your location';
      //     break; 
      //   case 'createIssue.contact':
      //     $rootScope.currentStateTitle = 'Contact';
      //     break;            
      // }

    });   

  }
]);