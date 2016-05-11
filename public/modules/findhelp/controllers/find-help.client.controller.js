'use strict';

angular.module('findhelp').controller('FindHelpController', ['$scope', '$window', 'Authentication', 'CartoDB',
	function ($scope, $window, Authentication, CartoDB) {

    $scope.user = Authentication.user;
		console.log($scope.user);
    // $scope.user.address = '654 park place brooklyn';
    // $scope.user.byLegal = false;
		$scope.searched = false;
    // $scope.hasLocal = true;


    // if(!$window.Geocoder) {
    //   // $log.info('ERROR: no geocoder set.');
    //   console.error('warning: no geocoder set');
    // } else {
    //   var boundsNYC = new google.maps.LatLngBounds(
    //       new google.maps.LatLng('40.496044', '-74.255735'),
    //       new google.maps.LatLng('40.915256', '-73.700272')
    //   );
    // }


    //var Geocoder = new google.maps.Geocoder();

    // $scope.searchAddr = function() {
    //   // $window.Geocoder.geocode({ 'address': $scope.user.address }, function(results, status) {
    //   $window.Geocoder.geocode({
    //     address: $scope.user.address,
    //     bounds: boundsNYC
    //   }, function(results, status) {
    //     if (status === google.maps.GeocoderStatus.OK) {
    //       $scope.user.lat = results[0].geometry.location.lat();
    //       $scope.user.lng = results[0].geometry.location.lng();
    //       $scope.error = false;
    //       $scope.user.address = results[0].formatted_address;
    //       $scope.user.borough = getUserBorough(results[0].formatted_address);
    //       $scope.update();
    //     } else {
    //       $scope.error = true;
    //       $scope.$apply();
    //       console.error('Geocode was not successful for the following reason: ' + status);
    //     }
    //   });
    // };

    $scope.toggleOrgType = function(byLegal) {
      $scope.user.byLegal = byLegal;
      $scope.update();
    };

    $scope.update = function(byLegal) {
			$scope.searched = true;
      var lat = $scope.user.geo.lat;
      var lng = $scope.user.geo.lon;
      $scope.updateCartoMap(lat, lng, byLegal);
      $scope.updateCartoList(lat, lng, byLegal);
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
