'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter', '$interpolate',
	function($sce, $filter, $interpolate) {
		var translatedText = $filter('translate');
    return function (val) {
    	return $sce.trustAsHtml(translatedText(val));
    }
}]);
