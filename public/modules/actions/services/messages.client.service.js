'use strict';

angular.module('actions').factory('Messages', ['$http', '$q', '$filter', '$timeout', '$location', 'Authentication', '$translate', 'LocaleService',
  function Issues($http, $q, $filter, $timeout, $location, Authentication, $translate, LocaleService) {

    var user = Authentication.user;

    var getShareMessage = function(type) {

      var message;
      switch(type) {
        case 'share':
          message = 'Hello, this is ' + user.fullName + ' at ' + user.address + ', Apt. ' + user.unit + '.' +
             ' I\'m experiencing issues with my apartment and would like to get them resolved.' +
             ' A link to my Case History can be found at https://' + $location.host() + '/share/' + user.sharing.key + '. Thank you!';
          break;
        case 'friendShare':
          message = 'I am using JustFix.nyc to take action on my housing issues! Click here to sign up: https://justfix.nyc/signup';
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

    var getLandlordEmailMessage = function(landlordName, accessDates) {

    	// console.log($translate.getAvailableLanguageKeys());
      var message = '';

      if(landlordName.length) {
        message += 'Dear ' + landlordName + ',\n\n';
      } else {
        message += 'To whom it may regard,\n\n';
      }

      message += 'I am requesting the following repairs in my apartment referenced below [and/or] in the public areas of the building:\n\n';

      var problemsContent = '';

      for(var i = 0; i < user.problems.length; i++) {

        var prob = user.problems[i];
        if (prob.key === 'landlordIssues') {
        	continue;
        }

        problemsContent += $translate.instant(prob.title, undefined, undefined, 'en_US') + ':\n';
        for(var j = 0; j < prob.issues.length; j++) {
          var issue = $translate.instant(prob.issues[j].key, undefined, undefined, 'en_US');
          problemsContent += ' - ' + issue;
          if(prob.issues[j].emergency) problemsContent += ' (FIX IMMEDIATELY)';
          problemsContent += '\n';
        }
        problemsContent += '\n';

      }
      message += problemsContent;

      // first value starts as an empty string, so lets check if its a Date
      // might break for non HTML5 input type=Date browsers?
      if(accessDates.length && accessDates[0] instanceof Date) {

        message += 'Access Dates\n';
        message += 'Below are some access dates provided for when repairs can be made. Please contact (using the information provided below) in order to make arrangements. Anyone coming to perform repairs should arrive no later than 12pm during the provided dates.\n\n';

        for(var k = 0; k < accessDates.length; k++) {
          message += '- ' + $filter('date')(accessDates[k], 'longDate') + '\n';
        }

        message += '\n';
      }

      // var superContactIdx = user.activity.map(function(i) { return i.key; }).indexOf('contactSuper');
      // if(superContactIdx !== -1) {
      //   message += 'I have already contacted the person responsible for making repairs on ';
      //   message += $filter('date')(user.activity[superContactIdx].createdDate, 'longDate');
      //   message += ', but the issue has not been resolved. ';
      // }

      message += 'I have already contacted the person responsible for making repairs on on several occasions, but the issue has not been resolved. In the meantime, I have recorded evidence of the violation[s] should legal action be necessary. ' +
        'If these repairs are not made immediately I will have no choice but to use my legal remedies to get the repairs done.\n\n' +
        'Pursuant to NYC Admin Code § 27-2115 an order of civil penalties for all existing violations for which the time to correct has expired is as follows:\n\n' +
      	'"C" violation:\n' +
      	'$50 per day per violation (if 1-5 units)\n' +
      	'$50-$150 one-time penalty per violation plus $125 per day (5 or more units)\n\n' +
      	'“B” Violation:\n' +
      	'$25-$100 one-time penalty per violation plus $10 per day\n\n' +
      	'“A” Violation:\n' +
      	'$10-$50 one-time penalty per violation\n\n' +
      	'Please be advised that NYC Admin Code § 27-2115 provides a civil penalty ' +
      	'where a person willfully makes a false certification of correction of a violation per violation falsely certified.\n\n' +
      	'Please contact me as soon as possible to arrange a time to have these repairs made at the number provided below.';

      message += '\n\nRegards,\n' +
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
