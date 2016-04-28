
'use strict';

angular.module('kyr').filter('newlines', ['$sce', function($sce){

  return function(text) {
    var treatedText = text.replace(/\\n/g, '<br/>');
    return $sce.trustAsHtml(treatedText);
  }
}]);
