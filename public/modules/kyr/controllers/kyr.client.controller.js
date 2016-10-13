
'use strict';

angular.module('kyr').controller('KyrController', ['kyrService', '$scope', 'Pdf', '$translate',
	function(kyrService, $scope, Pdf, $translate) {
		$scope.lang = $translate.use();

		console.log($scope.lang);

		var emptyArray = [];
		$scope.kyrResponse;

		kyrService.fetch().then(function(data){
			$scope.kyrResponse = data;
		}, function(err) {
			console.log(err);
		});
		
	}]);
