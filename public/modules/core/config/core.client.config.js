'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', 'Authentication',
  function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(Authentication.user && toState.name == 'home') {
        //console.log(toState.name);
        event.preventDefault();
        $state.go('listActions');
      }
    });

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