'use strict';

angular.module('kyr').controller('KyrDetailController', ['$scope', '$stateParams', 'kyrService', '$sce',
  function($scope, $stateParams, kyrService, $sce){
  	var queryThis = $stateParams.kyrId - 1;
  	$scope.expand = false;
  	$scope.canExpand = false;

  	kyrService.single(queryThis).then(function(data){
  		$scope.kyr = data;
  		$scope.content = $sce.trustAsHtml(data.content);
			if(data.readMore) {
				return $scope.canExpand = true;
			}
  	});
  }]);
