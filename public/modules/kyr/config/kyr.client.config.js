'use strict';

// Setting up route
angular.module('kyr').run(['$rootScope', '$state', '$window', '$location',
  function($rootScope, $state, $window, $location) {

  	// Remove footer margin
  	// Might want to move this into the the core config, if we're reusing this
  	$rootScope.$on('$stateChangeSuccess', function(){
  		$rootScope.noMargin = $state.current.noMargin;

  		// Hmm, should discuss this...
  		if($state.current.localHistory) {
  			$rootScope.showKyrBackBtn = true;
  		} else {
  			$rootScope.showKyrBackBtn = false;
  		}
  	});
  }
]);