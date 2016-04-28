'use strict';

angular.module('kyr').controller('KyrDetailController', ['$scope', '$stateParams', 'kyrService',
  function($scope, $stateParams, kyrService){
  	var queryThis = $stateParams.kyrId - 1;
  	$scope.expand = false;
  	$scope.canExpand = false;

  	kyrService.single(queryThis).then(function(data){
  		$scope.kyr = data;
  		for(var i = 0; i < data.sections.length; i++) {
  			if(data.sections[i].readMore) {
  				return $scope.canExpand = true;
  			}
  		}
  		console.log($scope.kyr);
  	});
  }]);
