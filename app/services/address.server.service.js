'use strict';

var _ = require('lodash'),
    Q = require('q'),
    request = require('request'),
    mongoose = require('mongoose'),
    config = require('../../config/config');


// separate the building number and street name from the address input
var parseAddressInput = function(input) {
  var input_split = input.split(' '),
        len = input_split.length,
        num = input_split[0],
        input_last = input_split.splice(1, len),
        street = input_last.join(' ');
  return {num: num, street: street};
};

// function trQuery(lat, lon) {
//   // construct the tenants rights group query
//   var query = "SELECT description, full_address, name, email, phone, website_url " +
//               "FROM nyc_tenants_rights_service_areas " +
//               "WHERE " +
//               "ST_Contains(" +
//                 "nyc_tenants_rights_service_areas.the_geom," +
//                 "ST_GeomFromText(" +
//                  "'Point(" + lon + " " + lat + ")', 4326" +
//                 ")" +
//               ");";
//   return query;
// }

var requestGeoclient = function(boro, address) {

  var geoclient = Q.defer();

  var addr = parseAddressInput(address);

  var params = {
      street: addr.street,
      houseNumber: addr.num,
      borough: boro,
      app_id: config.geoclient.id,
      app_key: config.geoclient.key
  };

  request({
      url: config.geoclient.url,
      qs:params,
      agentOptions: { rejectUnauthorized: false }   // ssl is expired...
    }, function (error, response, body) {

    if(error) {
      geoclient.reject('[GEOCLIENT ERROR - 0] ' + error);
    } else if(!error && response.statusCode === 200) {

      // check out the response
      var json = JSON.parse(body).address;

      // address not found in geoclient
      if(json.geosupportReturnCode !== '00')  {
        geoclient.reject('[GEOCLIENT ERROR - 1] ' + json.message);
      }

      // address found in geoclient
      var geo =  {
          bbl : json.bbl,
          lon : json.longitudeInternalLabel,
          lat : json.latitudeInternalLabel,
          streetNum : json.houseNumber,
          streetName : json.streetName1In,
          bCode : json.boroughCode1In,
          bUSPS : json.uspsPreferredCityName,
          zip : json.zipCode,
          cd: json.communityDistrict,
          bin : json.giBuildingIdentificationNumber1
        };

      geoclient.resolve(geo);

    } else {
      geoclient.reject('[GEOCLIENT ERROR - 2] ' + response.body);
    }

  });

  return geoclient.promise;
};

// a huge, massive thank you to clhenrick
var requestRentStabilized = function(bbl, lat, lon) {

  var stabilized = Q.defer();

  var rsCartoUrl = 'https://chenrick.cartodb.com/api/v2/sql?q=';
  var sql = 'SELECT bbl FROM map_pluto_likely_rs ' +
                'WHERE bbl = ' + bbl;
  //var sql2 = trQuery(lat, lon);

  request(rsCartoUrl + sql, function (error, response, body) {

    if(error) {
      console.log('[RS database error 1]', error);
      stabilized.reject(error);
    }

    // handle the response being HTML...
    try {
      if(JSON.parse(body).rows.length > 0) stabilized.resolve(true);
      else stabilized.resolve(false);
    } catch(e) {
      console.log('[RS database error 2]', error);
      stabilized.resolve(false);
    }

  });
  // request(rsCartoURL + sql2, function (error, response, body) {
  //   console.log(body);
  // });

  return stabilized.promise;
};

var harassmentHelp = function (zip) {
  var zips = ['10452', '10453', '11207', '11208', '11212', '11233', '10029', '10035', '11101', '11354', '11358', '10301', '10304'];
  return zips.indexOf(zip) !== -1;
};

module.exports = {
  requestGeoclient: requestGeoclient,
  requestRentStabilized: requestRentStabilized,
  harassmentHelp: harassmentHelp
};
