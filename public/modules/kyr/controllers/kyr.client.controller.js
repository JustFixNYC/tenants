
'use strict';

angular.module('kyr').controller('KyrController', ['kyrService', '$scope', 'Pdf',
	function(kyrService, $scope, Pdf) {
		var emptyArray = [];
		$scope.kyrResponse;

		kyrService.fetch().then(function(data){
			$scope.kyrResponse = data;
		}, function(err) {
			console.log(err);
		});
		
	}]);
