'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter',
	function($sce, $filter) {
		var translatedText = $filter('translate');
	  return function (val) {
    	var returnedTranslation = translatedText(val);
    	return $sce.trustAsHtml(returnedTranslation);
    }
}]);
