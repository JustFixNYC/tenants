'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter', 'Authentication',
	function($sce, $filter, Authentication) {

		var user = Authentication.user;

		var translatedText = $filter('translate');
	  return function (val) {
    	var returnedTranslation = translatedText(val);
    	return $sce.trustAsHtml(returnedTranslation);
    }
}]);
