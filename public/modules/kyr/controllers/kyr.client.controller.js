
'use strict';

angular.module('kyr').controller('KyrController', ['kyrService', '$scope',
	function(kyrService, $scope) {
		var emptyArray = [];
		$scope.kyrResponse;

		kyrService.fetch().then(function(data){
			console.log('success!');
			console.log(data);
			$scope.kyrResponse = data;
		}, function(err) {
			console.log(err);
		});
	}]);
