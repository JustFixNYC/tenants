'use strict';

angular.module('core').filter('trust', ['$sce', '$filter',
	function($sce, $filter) {
		var translatedText = $filter('translate');
    return function (val) {
    	return $sce.trustAsHtml(translatedText(val));
    }
}]);
