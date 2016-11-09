'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter', 'Authentication',
	function($sce, $filter, Authentication) {
		
		var user = Authentication.user;

		var translatedText = $filter('translate');
	  return function (val) {
    	var returnedTranslation = translatedText(val);

    	if(returnedTranslation.indexOf('user.borough') > -1) {
      	returnedTranslation = returnedTranslation.replace('user.borough', user.borough);
      }

    	return $sce.trustAsHtml(returnedTranslation);
    }
}]);
