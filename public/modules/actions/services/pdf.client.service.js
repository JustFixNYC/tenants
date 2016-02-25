'use strict';

angular.module('actions').factory('Pdf', ['$http', '$q', 'Authentication', '$filter',
  function Pdf($http, $q, Authentication, $filter) {

  	// SPLIT THIS OUT OMG
  	var postRequest = function (dataObj) {
  		var deferred = $q.defer();
    	var user = Authentication.user;

  		// This block assembles our issues list
  		var issuesContent = '';
      for(var issue in user.issues) {
        var key = issue,
            title = $filter('areaTitle')(key),
            vals = user.issues[issue];

        if(vals.length) {

          var activityIdx = user.activity.map(function(i) { return i.key; }).indexOf(key);
          if(activityIdx !== -1) var activity = user.activity[activityIdx];

          issuesContent += title + ':\n';
          vals.forEach(function(v) {
            issuesContent += ' - ' + v.title;
            if(v.emergency) issuesContent += ' (FIX IMMEDIATELY)';
            issuesContent += '\n';
          });

          issuesContent += '\n   First Appeared: ';
          if(activity) {
            issuesContent += $filter('date')(activity.date, 'longDate');             
            issuesContent += '\n   Additional Information:';            
            issuesContent += '\n   ' + activity.description;
            issuesContent += '\n';  
            activity = undefined;                    
          } else {
            issuesContent += '\n   Additional Information:';            
          }

          issuesContent += '\n';
        }
      }

  		var assembledObject = {
  			tenantInfo: {
	  			'phone': user.phone,
	  			'name': user.fullName,
	  			'address': user.address + 
	  								'\n' + user.borough +
	  								'\n New York  ' + '11205' // This needs to be replaced, talk to dan ASAP
	  		},
	  		landlordInfo : {
	  			'name': 'Sir/Madam',
	  			'Address': '600 Main St \n Brooklyn, NY  11235'
	  		},
	  		issuesList: issuesContent

  		};

  		console.log(assembledObject);

	  	$http({
	  		method: 'POST',
	  		url:'http://localhost:8080/complaint-letter',
	  		data: assembledObject
	  	}).then(
	  		function successfulPdfPost(response){
	  			deferred.resolve(response.data);
	  		},
	  		function failedPdfPost(error) {
	  			deferred.reject(error);
	  		}
	  	);

	  	return deferred.promise;
  	};

  	return {
  		postComplaint: postRequest
  	};
  }]);