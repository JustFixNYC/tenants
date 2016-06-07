'use strict';

angular.module('actions').factory('Pdf', ['$http', '$q', 'Authentication', '$filter',
  function Pdf($http, $q, Authentication, $filter) {

  	var assemble = function(landlordName, landlordAddr) {

  		// This block assembles our issues list PhantomJS
  		var assembledObject = {
  			issues: [],
  			emergency: false
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
  			'name': landlordName.length ? 'Dear ' + landlordName : 'To whom it may concern',
  			'address': landlordAddr.length ? landlordAddr : ''
	  	};

      for(var i = 0; i < user.problems.length; i++) {

      	var problemPush = angular.copy(user.problems[i]);

      	problemPush.issues.map(function(curr, idx, arr) {
      		if(curr.emergency === true) {
      			assembledObject.emergency = true;
      		}
      	});

      	assembledObject.issues.push(problemPush);
      }

      return assembledObject;

  	};

    var createComplaint = function(landlord, accessDates) {

      var deferred = $q.defer();
    	var user = Authentication.user;

      var assembledObject = assemble(landlord.name, landlord.address);

      $http({
	  		method: 'POST',
	  		// url:'http://pdf-microservice.herokuapp.com/complaint-letter',
	  		url: 'http://localhost:5000/complaint-letter',
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

  	return {
  		createComplaint : createComplaint
  	};
  }]);
