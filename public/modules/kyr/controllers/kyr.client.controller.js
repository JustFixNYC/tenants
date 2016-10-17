
'use strict';

angular.module('kyr').controller('KyrController', ['kyrService', '$scope', 'Pdf', '$translate',
	function(kyrService, $scope, Pdf, $translate) {
		$scope.lang = $translate.use();

		var emptyArray = [];
		$scope.kyrResponse;

		if($scope.lang === 'es_mx') {
			console.log('true');
			kyrService.fetchEs().then(function(data){
				$scope.kyrResponse = data;
			}, function(err){
				console.log(err);
			})
		} else {
			kyrService.fetch().then(function(data){
				$scope.kyrResponse = data;
			}, function(err) {
				console.log(err);
			});
		}
		
	}]);
