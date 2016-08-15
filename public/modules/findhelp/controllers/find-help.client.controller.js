'use strict';

angular.module('findhelp').controller('FindHelpController', ['$scope', '$window', 'Authentication', 'CartoDB', 'Hotlines',
	function ($scope, $window, Authentication, CartoDB, Hotlines) {

    $scope.user = Authentication.user;
		$scope.hotlines = [];

    $scope.update = function(type) {
      var lat = $scope.user.geo.lat;
      var lng = $scope.user.geo.lon;
      $scope.updateCartoMap(lat, lng, type);

			if(type == 'hotlines' && !$scope.hotlines.length) {
				Hotlines.getLocalFile().then(function (data) {
					$scope.resources = $scope.hotlines = data;
				}, function (err) {
					console.log("errors:" + errors);
				});
			} else if(type == 'hotlines' && $scope.hotlines.length) {
				$scope.resources = $scope.hotlines;
			} else {
				$scope.updateCartoList(lat, lng, type);
			}

    };

		$scope.init = function() {
			$scope.update('community');
		};

    $scope.updateCartoList = function(lat, lng, orgType) {
      CartoDB.queryByLatLng(lat, lng, orgType)
        .done(function (data) {

          if(data.rows.length == 0) {
            // $log.info('NO RESULTS=' + $scope.user.address);
            // orgType = false means trying for community groups
            // if(!orgType) $scope.toggleOrgType(true);
          }

          // if(!borough) $scope.hasLocal = true;
          $scope.resources = data.rows;
          // need to use $apply() because the callback is from cartodb.SQL, not $http
          $scope.$apply();

        }).error(function(errors) {
            // errors contains a list of errors
						Rollbar.error("Carto List Error", errors);
            console.log("errors:" + errors);
        });
      };

    var getUserBorough = function(addr) {
      if(/Brooklyn/i.test(addr)) return 'Brooklyn';
      if(/Queens/i.test(addr)) return 'Queens';
      if(/Manhattan/i.test(addr)) return 'Manhattan';
      if(/Bronx/i.test(addr)) return 'Bronx';
      if(/Staten Island/i.test(addr)) return 'Staten Island';
      return '';
    };



}]);
