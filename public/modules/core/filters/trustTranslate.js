'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter',
	function($sce, $filter) {
		var translatedText = $filter('translate');
    return function (val) {
    	var returnedTranslation = translatedText(val);
    	console.log(returnedTranslation);
    	return $sce.trustAsHtml(returnedTranslation);
    }
}]);
