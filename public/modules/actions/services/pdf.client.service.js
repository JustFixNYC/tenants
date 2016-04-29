'use strict';

angular.module('actions').factory('Pdf', ['$http', '$q', 'Authentication', '$filter',
  function Pdf($http, $q, Authentication, $filter) {

  	var assemble = function(landlordName, landlordAddr) {



  		// This block assembles our issues list PhantomJS
  		var assembledObject = {
  			issues: []
  		};
  		var issuesCount = 0;

      var zip;
  		if(user.geo) {
  			zip = user.geo.zip;
  		} else {
  			zip = '';
  		}

  		// Kick off assembly of obj sent to PDF service
			assembledObject.tenantInfo = {
  			'phone': user.phone,
  			'name': user.fullName,
  			'address': user.address + ' ' + user.unit +
  								' <br> ' + user.borough +
  								' <br> New York, ' + zip
	  	};
	  	assembledObject.landlordInfo = {
  			'name': landlordName.length ? landlordName : 'To whom it may concern',
  			'address': landlordAddr.length ? landlordAddr : ''
	  	};

      for(var issue in user.issues) {
        var key = issue,
            title = $filter('areaTitle')(key),
            vals = user.issues[issue];

        if(vals.length) {
        	var tempObject = {};

        	// Here we go...
          var activityIdx = user.activity.map(function(i) { return i.key; }).indexOf(key);
          if(activityIdx !== -1) var activity = user.activity[activityIdx];

          tempObject.title = title;
          tempObject.vals = [];

          vals.forEach(function(v) {
            tempObject.vals.push({title: v.title, emergency: v.emergency});
          });

          if(activity) {
            tempObject.startDate = $filter('date')(activity.date, 'longDate');

            if(activity.description) {
            	tempObject.description = activity.description;
            }

            // @meegan - why is this here?
            activity = undefined;
          }

          assembledObject.issues.push(tempObject);

          issuesCount++;
        }
      }

      // console.log(assembledObject);

      return assembledObject;

  	};

    var createComplaint = function(landlord) {

      var deferred = $q.defer();
    	var user = Authentication.user;

      var assembledObject = assemble(landlord.name, landlord.address);

      $http({
	  		method: 'POST',
	  		// Placeholder URL, needs to be attached to a real URL w/ JustFix (Also, using goddamnedtestbucket, let's get that out of there...)
	  		url:'http://pdf-microservice.herokuapp.com/complaint-letter',
	  		data: assembledObject
	  	}).then(
	  		function successfulPdfPost(response){
	  			Authentication.user.complaintUrl = response.data;
	  			deferred.resolve(response.data);
	  		},
	  		function failedPdfPost(error) {
	  			deferred.reject(error);
	  		}
	  	);

	  	return deferred.promise;

    };


  	// var getRequest = function () {
  	// 	var user = Authentication.user;
    //
  	// 	if(user.complaintUrl !== '') {
  	// 		return user.complaintUrl;
  	// 	} else {
  	// 		postRequest();
  	// 	}
  	// };

  	return {
  		createComplaint : createComplaint
  		// getComplaint: getRequest
  	};
  }]);
