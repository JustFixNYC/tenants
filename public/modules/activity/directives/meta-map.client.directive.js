'use strict';

angular.module('activity').directive('metaMap', ['$rootScope', 'CartoDB', function ($rootScope, CartoDB) {
    return {
      restrict: 'E',
      template: '<div class="meta-map"></div>',
      scope: false,
      link: function postLink(scope, element, attrs) {

        var photoLat = attrs.lat;
        var photoLng = attrs.lng;

        /*** init map ***/
        var map = L.map(element[0].children[0], {
          scrollWheelZoom: false,
          zoomControl: false,
          // center: [40.6462615921222, -73.96270751953125],
          center: [photoLat, photoLng],
          zoom: 15
        });

        // L.control.attribution.addAttribution('© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>');
        L.Icon.Default.imagePath = "/modules/core/img/leaflet";

        // L.tileLayer('https://{s}.tiles.mapbox.com/v4/dan-kass.pcd8n3dl/{z}/{x}/{y}.png?access_token={token}', {
        //     attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        //     subdomains: ['a','b','c','d'],
        //     token: 'pk.eyJ1IjoiZGFuLWthc3MiLCJhIjoiY2lsZTFxemtxMGVpdnVoa3BqcjI3d3Q1cCJ9.IESJdCy8fmykXbb626NVEw'
        // }).addTo(map);

        // https://github.com/mapbox/mapbox-gl-leaflet
        var gl = L.mapboxGL({
          accessToken: 'pk.eyJ1IjoiZGFuLWthc3MiLCJhIjoiY2lsZTFxemtxMGVpdnVoa3BqcjI3d3Q1cCJ9.IESJdCy8fmykXbb626NVEw',
          style: 'mapbox://styles/dan-kass/cilljc5nu004d9vkngyozkhzb',
          attributionControl: true
        }).addTo(map);

        // map.attributionControl.removeFrom(map);
        // map.attributionControl.setPrefix('');
        // var credits = L.control.attribution().addTo(map);
        // credits.addAttribution("© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>");

        // map.on('click', function(e) {
        //     var tempLat = scope.user.lat = e.latlng.lat;
        //     var tempLng = scope.user.lng = e.latlng.lng;
        //     scope.updateCartoMap(tempLat, tempLng, scope.user.byBorough);
        //     scope.updateCartoList(tempLat, tempLng, scope.user.byBorough);
        // });

        var mainSublayer;
        var userMarker;

        /*** init carto layers ***/
        // var layerSource = {
        //   user_name: 'dan-kass',
        //   type: 'cartodb',
        //
        //   sublayers: [{
        //     sql: "SELECT * FROM nyc_cbos_locations",
        //     cartocss: "#nyc_cbos_locations{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:10;marker-fill:#F60;marker-allow-overlap:true}"
        //   }]
        // };
        //
        // cartodb.createLayer(map, layerSource)
        //   .addTo(map)
        //   .done(function(layer) {
        //     mainSublayer = layer.getSubLayer(0);
        //     scope.init();
        //     // do stuff
        //     //console.log("Layer has " + layer.getSubLayerCount() + " layer(s).");
        //   })
        //   .error(function(err) {
        //     // report error
        //     Rollbar.error("Carto Map Error", err);
        //     console.log("An error occurred: " + err);
        //   });

        userMarker = L.marker([photoLat,photoLng]);
        userMarker.addTo(map);

    }
  };
}]);
