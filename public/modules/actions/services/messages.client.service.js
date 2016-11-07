'use strict';

angular.module('actions').factory('Messages', ['$http', '$q', '$filter', '$location', 'Authentication', '$translate', 'LocaleService',
  function Issues($http, $q, $filter, $location, Authentication, $translate, LocaleService) {

    var user = Authentication.user;
    var request = function(url) {
      var deferred = $q.defer();

      $http.get(url).
        then(function(response) {
          deferred.resolve(response.data);
        }, function(err) {
          deferred.reject();
        });

      return deferred.promise;
    };

    var language = function() {
    	var deferred = $q.defer;
    	$http.get('languages/locale-en_US.json')
	    	.then(function(res){
	    		deferred.resolve(res);	
	    	}, function(err) {
	    		deferred.reject();
	    	});

	    	return deferred.promise;
    };

    var getShareMessage = function(type) {

      var message;
      switch(type) {
        case 'share':
        message = 'Hello, this is ' + user.fullName + ' at ' + user.address + ', Apt. ' + user.unit + '.' +
           ' I\'m experiencing issues with my apartment and would like to get them resolved.' +
           ' A link to my Case History can be found at http://' + $location.host() + '/share/' + user.sharing.key + '. Thank you!';
        break;
        default:
          message = 'Hello, this is ' + user.fullName + ' at ' + user.address + ', Apt. ' + user.unit + '.' +
             ' I\'m experiencing issues with my apartment and would like to get them resolved.' +
             ' Please contact me as soon as possible at this phone number. Thank you!';
          break;
      };

      return message;
    };

    var getRentalHistoryMessage = function() {
      var message = 'Hello,\n\nI, ' + user.fullName + ', ' +
            'am currently residing at ' + user.address + ',' +
            ' Apt. ' + user.unit + ' in ' + user.borough + ', NY ' +
            ' and would like to request the rental history for this apartment. Any information you can provide me would be greatly appreciated.\n\n' +
            'Thank you, \n\n' + user.fullName;
      return message;
    };

    var getLandlordEmailMessage = function() {

    	console.log($translate.getAvailableLanguageKeys());

      var message = 'To whom it may regard, \n\n' +
        'I am requesting the following repairs in my apartment referenced below [and/or] in the public areas of the building:\n\n';

      var problemsContent = '';

      for(var i = 0; i < user.problems.length; i++) { 

        var prob = user.problems[i];

        problemsContent += $translate.instant(prob.title, undefined, undefined, 'en_US') + ':\n';
        for(var j = 0; j < prob.issues.length; j++) {
          problemsContent += ' - ' + $translate.instant(prob.issues[j].key, undefined, undefined, 'en_US');
          if(prob.issues[j].emergency) problemsContent += ' (FIX IMMEDIATELY)';
          problemsContent += '\n';
        }
        problemsContent += '\n';

      }
      message += problemsContent + '\n\n';

      var superContactIdx = user.activity.map(function(i) { return i.key; }).indexOf('contactSuper');
      if(superContactIdx !== -1) {
        message += 'I have already contacted the person responsible for making repairs on ';
        message += $filter('date')(user.activity[superContactIdx].createdDate, 'longDate');
        message += ', but the issue has not been resolved. ';
      }

      message += 'In the meantime, I have recorded photo and written evidence of the violations. ' +
                 'Please contact me as soon as possible to arrange a time to have these repairs made by replying directly to this email or calling the phone number provided below.';

      message += '\n\n\nRegards,\n' +
                  user.fullName + '\n' +
                  user.address + '\n' +
                  'Apt. ' + user.unit + '\n' +
                  user.borough + ', NY ' + '\n' +
                  $filter('tel')(user.phone);

      return message;

    };

    var getLandlordEmailSubject = function() {
      return 'Formal notice of repairs needed at ' + user.address + ' Unit ' + user.unit;
    }

    return {
      getShareMessage: getShareMessage,
      getRentalHistoryMessage: getRentalHistoryMessage,
      getLandlordEmailMessage: getLandlordEmailMessage,
      getLandlordEmailSubject: getLandlordEmailSubject
    };
  }
]);
