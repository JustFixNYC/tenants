'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'justfix';
	var applicationModuleVendorDependencies = [
		'ngResource',
		'ngAnimate',
		'ngCookies',
		'ui.router',
		'ui.bootstrap',
		'ui.select',
		'ui.utils',
		'ng.deviceDetector',
		'ngFileUpload',
		'bootstrapLightbox',
		'angularLazyImg',
		'duScroll',
		'pascalprecht.translate',	// angular-translate
 		'tmh.dynamicLocale'// angular-dynamic-locale
	];
// 'ngAnimate',  'ngTouch', , 'bootstrapLightbox' , 'angularModalService'


	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);


angular.module(ApplicationConfiguration.applicationModuleName)
  // Setting HTML5 Location Mode
  .config(['$locationProvider', function($locationProvider) {
		$locationProvider.hashPrefix('!');
  }])
  // whitelisting URLs
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|sms|mailto):/);
    // enable this for speed enhancement b4 production push
    // $compileProvider.debugInfoEnabled(false);
  }])
  // internationalization constants
  .constant('LOCALES', {
    'locales': {
        'en_US': 'English',
        'es': 'Español'
    },
    'preferredLocale': 'en_US'
  })
  // enable logging for missing IDs
  .config(["$translateProvider", function ($translateProvider) {
    $translateProvider.useMissingTranslationHandlerLog();
  }])
  // async loading for templates
  .config(["$translateProvider", function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en_US');// is applied on first load
    $translateProvider.useLocalStorage();// saves selected language to localStorage
  }])
  // location of the locale settings
  .config(["tmhDynamicLocaleProvider", function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');
  }])
  .run(function () {

    // lets make our lives easier!
    // theres probably a better place to put these...
    Array.prototype.containsByKey = Array.prototype.containsByKey || function(key) {
      var i, l = this.length;
      for (i = 0; i < l; i++) if (this[i].key == key) return true;
      return false;
    };

    Array.prototype.getByKey = Array.prototype.getByKey || function(key) {
      var i, l = this.length;
      for (i = 0; i < l; i++) if (this[i].key == key) return this[i];
      return null;
    };

    Array.prototype.removeByKey = Array.prototype.removeByKey || function(key) {
      var i, l = this.length;
      for (i = l-1; i >= 0; i--) if (this[i].key == key) this.splice(i,1);
      return;
    };
  });


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

  // Fastclick
  if (FastClick) FastClick.attach(document.body);

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('actions');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('activity');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('admin');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('findhelp');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('issues');
'use strict';

ApplicationConfiguration.registerModule('kyr');
'use strict';

ApplicationConfiguration.registerModule('onboarding');
'use strict';

ApplicationConfiguration.registerModule('problems');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('actions').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('listActions', {
				url: '/take-action',
				templateUrl: 'modules/actions/views/list-actions.client.view.html',
				data: { protected: true }
			});

	}
]);

'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$filter', 'Authentication', 'Actions', 'Activity',
  function($scope, $filter, Authentication, Actions, Activity) {
    //$scope.authentication = Authentication;
    $scope.user = Authentication.user;

    $scope.userCompletedDetails = function() {
      if($scope.user.actionFlags) {
        return $scope.user.actionFlags.indexOf('allInitial') !== -1;
      }
      else return false;
    };

    // console.log($scope.userCompletedDetails());

    $scope.list = function() {
      Actions.query(function(actions) {
        $scope.onceActions = $filter('filter')(actions, { $: 'once' }, true);
        $scope.recurringActions = $filter('filter')(actions, { $: 'recurring' }, true);
        $scope.legalActions = $filter('filter')(actions, { $: 'legal' }, true);
      });

    };

  }
]);

'use strict';

// Issues controller
angular.module('actions').controller('AddDetailsController', ['$scope', '$filter', '$modalInstance', 'newActivity', 'Problems',
  function ($scope, $filter, $modalInstance, newActivity, Problems, close) {

  $scope.newActivity = newActivity;

  $scope.issues = Problems.getUserIssuesByKey($scope.newActivity.key);

  // $scope.areas = Issues.getUserAreas().map(function (a) { return $filter('areaTitle')(a) });

  //console.log('update activity cntrl',$scope.newActivity);

  $scope.dp = {
    opened: false,
  };

  $scope.openDp = function() {

      $scope.dp.opened = !$scope.dp.opened;
      console.log('wtf');
    };


 // $scope.open

  $scope.onFileSelect = function(files) {
    console.log(files);
  };

  $scope.done = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$modalInstance', 'newActivity', 'Pdf', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $modalInstance, newActivity, Pdf, Authentication, $window) {

	  $scope.newActivity = newActivity;
		$scope.newActivity.fields = [];
		$scope.landlord = {
			name: '',
			address: ''
		};

		$scope.status = {
			loading: false,
			created: false,
			error: false
		}


	  // var user = Authentication.user;

	  $scope.createLetter = function () {
			$scope.status.loading = true;

	  	Pdf.createComplaint($scope.landlord).then(
	  		function success(data) {
					$scope.status.loading = false;
					$scope.status.created = true;
					$scope.letterUrl = data;
					$scope.newActivity.fields.push({ title: 'letterURL', value: data });
	  			console.log(data);
	  		},
	  		function failure(error) {
					$scope.status.loading = false;
					$scope.status.error = true;
	  			$scope.errorCode = error;
	  		}
	  	);




	    // $modalInstance.close($scope.newActivity);
	  };

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({ newActivity: $scope.newActivity, modalError: $scope.status.error });
		};
	}]);

'use strict';

angular.module('actions').controller('ContactSuperController', ['$scope', '$modalInstance', 'deviceDetector', 'Messages', 'newActivity',
  function ($scope, $modalInstance, deviceDetector, Messages, newActivity) {

    $scope.newActivity = newActivity;

    var isIOS8 = function() {
      var deviceAgent = deviceDetector.raw.userAgent.toLowerCase();
      return /(iphone|ipod|ipad).* os 8_/.test(deviceAgent);
    };

    var generateURL = function() {

      // ios ;
      // ios8 &
      // android ?

      var href = 'sms:';
      var msg = Messages.getSMSMessage();

      if($scope.superphone) href += $scope.superphone;

      if(deviceDetector.os === 'ios') {
        if(isIOS8()) href += '&';
        else href += ';';
        href = href + 'body=' + msg;
      } else if(deviceDetector.os === 'android') {
        href = href + '?body=' + msg;
      } else {
        // alert('If you were using a phone, the message would be: \n\n' + msg);
        return;
      }

      return href;
    };


  $scope.done = function (type, event) {

    var href = '';
    if(type === 'sms') href = generateURL();
    else if(type === 'tel' && $scope.superphone) href = 'tel:' + $scope.superphone;

    $modalInstance.close({ newActivity: $scope.newActivity });
    if(href.length) window.location.href = href;
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('actions').controller('DecreasedServicesController', ["$scope", "$modalInstance", "newActivity", function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.addUpdate = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('actions').controller('HpactionController', ["$scope", "$modalInstance", "newActivity", function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('actions').controller('MessageLandlordController', ['$scope','$modalInstance', 'Messages', 'newActivity',
  function ($scope, $modalInstance, Messages, newActivity) {

    $scope.newActivity = newActivity;

    $scope.email = {};
    $scope.email.content = Messages.getLandlordEmailMessage();

    $scope.done = function () {
      $scope.email.contact = $scope.email.landlord + '?subject=' + Messages.getLandlordEmailSubject();
      $scope.emailHref = 'mailto:' + encodeURI($scope.email.contact + '&body=' + $scope.email.content);
      $modalInstance.close({ newActivity: $scope.newActivity });
      window.location.href = $scope.emailHref;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

'use strict';

angular.module('actions').controller('RentalHistoryController', ['$scope','$modalInstance', 'Messages', 'newActivity',
  function ($scope, $modalInstance, Messages, newActivity) {

    $scope.newActivity = newActivity;
    $scope.emailContent = Messages.getRentalHistoryMessage();

    $scope.emailHref = 'mailto:' + encodeURI('rentinfo@nyshcr.org?subject=Request For Rental History&body=' + $scope.emailContent);

    $scope.done = function () {


      $modalInstance.close({ newActivity: $scope.newActivity });
      window.location.href = $scope.emailHref;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

'use strict';

// allow contents of tak action cards to include directives, functions, etc
// see http://stackoverflow.com/questions/20297638/call-function-inside-sce-trustashtml-string-in-angular-js

angular.module('actions').directive('compileTemplate', ["$compile", "$parse", function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            var getStringValue = function() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
}]);

'use strict';

angular.module('actions')
  .directive('statusUpdate', ['$rootScope', '$filter', '$sce', '$timeout', 'Activity', 'Actions', 'Problems',
    function ($rootScope, $filter, $sce, $timeout, Activity, Actions, Problems) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/status-update.client.view.html',
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        //$scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      }],
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.problems = Problems.getUserProblems();

        scope.status = {
          expanded: false,
          tagging: false,
          closeAlert: false,
          closeErrorAlert: true,
          formSubmitted: false,
          completed: false
        };
        //if(!scope.completed) scope.completed = false;

        scope.newActivity = {
          date: '',
          title: 'Status Update',
          key: 'statusUpdate',
          problems: [],
          photos: []
        };

        scope.expand = function(event) {
          event.preventDefault();
          scope.status.expanded = true;
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);

        }

        scope.toggleTagging = function() {
          scope.status.tagging = !scope.status.tagging;
        }

        scope.selectProblem = function(problem) {

          if(!this.isSelectedProblem(problem)) {
            scope.newActivity.problems.push(problem);
          } else {
            var i = scope.newActivity.problems.indexOf(problem);
            scope.newActivity.problems.splice(i, 1);
            // $scope.checklist[area].numChecked--;
          }
        };
        scope.isSelectedProblem = function(problem) {
          // if(!$scope.newIssue.issues[area]) return false;
          return scope.newActivity.problems.indexOf(problem) !== -1;
        };

        scope.addPhoto = function(file) {

          if(file) {
            scope.newActivity.photos.push(file);
            console.log(file);
            console.log(file.lastModifiedDate);
            if(file.lastModifiedDate) scope.newActivity.date = file.lastModifiedDate;
          }

        };

        scope.closeAlert = function() {
          scope.status.closeAlert = true;
        };

        scope.createActivity = function(isValid) {

          scope.status.formSubmitted = true;

          if(isValid) {
            $rootScope.loading = true;

            console.log('create activity pre creation', scope.newActivity);

            // [TODO] have an actual section for the 'area' field in the activity log
            // if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
            // else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

            var activity = new Activity(scope.newActivity);

            console.log('create activity post creation', scope.newActivity);

            activity.$save(function(response) {

              console.log('create activity post save', response);

              $rootScope.loading = false;
              scope.status.completed = true;
              scope.status.expanded = false;
              scope.newActivity = {
                date: '',
                title: 'Status Update',
                key: 'statusUpdate',
                problems: [],
                photos: []
              };

            }, function(errorResponse) {
              $rootScope.loading = false;
              scope.error = errorResponse.data.message;
              scope.status.closeErrorAlert = false;
            });
          }

        }; // end of create activity


      }
    };
  }]);

'use strict';

angular.module('actions')
  .directive('toDoItem', ['$rootScope', '$modal', '$sce', '$compile', '$timeout', 'Authentication', 'Activity', 'Actions',
    function ($rootScope, $modal, $sce, $compile, $timeout, Authentication, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.filterContentHTML = function() {
          return $sce.trustAsHtml($scope.action.content);
        };
        $scope.filterButtonTitleHTML = function() { return $sce.trustAsHtml($scope.action.cta.buttonTitle); };
        $scope.closeErrorAlert = true;
      }],
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        //console.log(scope);

        // console.log(scope.action);

        // used to hide the completed alert
        // scope.status = {
        //   closeAlert: false,
        //   closeErrorAlert: true,
        //   completed: false
        // };

        scope.followUpSubmitted = false;

        //scope.completed = false;
        if(!scope.action.completed) scope.action.completed = false;

        scope.newActivity = {
          startDate: '',
          title: scope.action.activityTitle,
          key: scope.action.key
        };

        if(scope.action.isFollowUp) {
          // get potential follow up startDate
          if(scope.action.startDate) {
            scope.newActivity.startDate = new Date(scope.action.startDate);
          }

          // if action has custom fields, initialize those in the newActivity object
          if(scope.action.followUp && scope.action.followUp.fields) {
            scope.newActivity.fields = [];
            angular.forEach(scope.action.followUp.fields, function(field, idx) {
              scope.newActivity.fields.push({ title: field.title });
            });
          }
        }



        var getSection = function(type) {
          switch(type) {
            case 'once':
              return scope.onceActions;
              break;
            case 'recurring':
              return scope.recurringActions;
              break;
            case 'legal':
              return scope.legalActions;
              break;
            default:
              console.error('this shouldn\'t happen!');
              return;
              break;
          }
        };

        scope.isModal = function() {
          switch(scope.action.cta.type) {
            case 'initialContent': return true;
            case 'modal': return true;
            default: return false;
          }
        };

        scope.openModal = function() {

          // ModalService.showModal({
          //   templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
          //   controller: scope.action.cta.controller,
          //   inputs: {
          //     newActivity: scope.newActivity
          //   }
          // }).then(function(modal) {

          //   console.log(modal);

          //   modal.element.modal();
          //   // modal.close.then(function(result) {
          //   //   $scope.yesNoResult = result ? "You said Yes" : "You said No";
          //   // });
          // });

          scope.newActivity.startDate = new Date();

          var modalInstance = $modal.open({
            //animation: false,
            templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
            controller: scope.action.cta.controller,
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          modalInstance.result.then(function (result) {
            scope.newActivity = result.newActivity;

            // this should check for isFollowUp (or should is be hasFollowUp)
            if(scope.action.hasFollowUp) scope.triggerFollowUp(true);
            // if(scope.action.isFollowUp && scope.action.isFollowUp) scope.triggerFollowUp();
            else if(!result.modalError) scope.createActivity(true);

          }, function () {
            // modal cancelled
          });
        };

        scope.triggerFollowUp = function(hasDoneAction, url, type) {

          if(hasDoneAction) {
            scope.newActivity.startDate = scope.action.startDate = new Date();
          }

          scope.action.$followUp({ type: 'add' });

          if(url && type === 'tel') window.location.href = url;
          else if(url && type === 'link') window.open(url, '_blank');
         };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });
        };

        scope.closeAlert = function() {
          scope.action.closeAlert = true;
          var section = getSection(scope.action.type);
          section.splice(scope.$index,1);
        };

        scope.createActivity = function(isValid) {

          if(scope.action.hasFollowUp) {
            scope.followUpSubmitted = true;
          }

          if(isValid) {

            $rootScope.loading = true;

            console.log('create activity pre creation', scope.newActivity);

            var activity = new Activity(scope.newActivity);

            console.log('create activity post creation', scope.newActivity);

            activity.$save(function(response) {

              console.log('create activity post save', response);

              Authentication.user = response;
              $rootScope.loading = false;
              scope.action.completed = true;
              scope.action.closeAlert = false;

              // load new actions
              // var idx = scope.$index;
              var newActions = Actions.query(
                {key: scope.newActivity.key},
                function() {
                  console.log('new actions', newActions);
                  newActions.forEach(function (action) {
                    var section = getSection(action.type);
                    section.push(action);
                    // scope.actions.splice(++idx, 0, action);
                  });
                });

            }, function(errorResponse) {
              $rootScope.loading = false;
              scope.error = errorResponse.data.message;
              scope.closeErrorAlert = false;
            });

          }

        }; // end of create activity


      }
    };
  }]);

'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('actions').factory('Actions', ['$resource',
  function($resource) {
    return $resource('actions', {}, {
      followUp: {
        method: 'POST',
      }
      // ,
      // removeFollowUp: {
      //   method: 'POST',
      //   url: 'actions/removeFollowUp'
      // },     
    });
  }
]);
'use strict';

angular.module('actions').factory('Messages', ['$http', '$q', '$filter', 'Authentication',
  function Issues($http, $q, $filter, Authentication) {

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

    var getSMSMessage = function(type) {

      console.log(user);
      var message;
      switch(type) {
        case 'share':
        message = 'Hello, this is ' + user.fullName + ' at ' + user.address + ', Apt. ' + user.unit + '.' +
           ' I\'m experiencing issues with my apartment and would like to get them resolved.' +
           ' The public URL for my Case History is http://justfix.nyc/public/' + user.sharing.key + '. Thank you!';
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

      var message = 'To whom it may regard, \n\n' +
        'I am requesting the following repairs in my apartment referenced below [and/or] in the public areas of the building:\n\n';

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

      message += issuesContent + '\n\n';

      var superContactIdx = user.activity.map(function(i) { return i.key; }).indexOf('contactSuper');
      if(superContactIdx !== -1) {
        message += 'I have already contacted the person responsible for making repairs on ';
        message += $filter('date')(user.activity[superContactIdx].date, 'longDate');
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
      getSMSMessage: getSMSMessage,
      getRentalHistoryMessage: getRentalHistoryMessage,
      getLandlordEmailMessage: getLandlordEmailMessage,
      getLandlordEmailSubject: getLandlordEmailSubject
    };
  }
]);

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

      for(var i = 0; i < user.problems.length; i++) {

      	var problemPush = angular.copy(user.problems[i]);

      	assembledObject.issues.push(problemPush);

        // var key = problems,
        //     title = $filter('areaTitle')(key),
        //     vals = user.issues[issue];

        // if(vals.length) {
        // 	var tempObject = {};

        // 	// Here we go...
        //   var activityIdx = user.activity.map(function(i) { return i.key; }).indexOf(key);
        //   if(activityIdx !== -1) var activity = user.activity[activityIdx];

        //   tempObject.title = title;
        //   tempObject.vals = [];

        //   vals.forEach(function(v) {
        //     tempObject.vals.push({title: v.title, emergency: v.emergency});
        //   });

        //   if(activity) {
        //     tempObject.startDate = $filter('date')(activity.date, 'longDate');

        //     if(activity.description) {
        //     	tempObject.description = activity.description;
        //     }

        //     // @meegan - why is this here?
        //     activity = undefined;
        //   }

        //   assembledObject.issues.push(tempObject);

        //   issuesCount++;
        // }
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
	  		url:'http://pdf-microservice.herokuapp.com/complaint-letter',
	  		// url: 'http://localhost:5000/complaint-letter',
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

'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('listActivity', {
				url: '/your-case',
				templateUrl: 'modules/activity/views/list-activity.client.view.html',
				data: { protected: true }
			})
			.state('showPublic', {
				url: '/public',
				templateUrl: 'modules/activity/views/list-activity-public.client.view.html',
				data: { disableBack: true }
			});

	}
]);

'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityPublicController', ['$scope', '$location', '$http', 'Activity', 'Lightbox',
  function($scope, $location, $http, Activity, Lightbox) {


    var query = $location.search();
    if(!query.key) $location.go('/');

    $scope.list = function() {
      Activity.public({ key: query.key }, function(user) {
        $scope.user = user;
        $scope.activities = $scope.user.activity;
      });
    };

    $scope.activityTemplate = function(key) {
      var template = '/modules/activity/partials/';
      switch(key) {
        case 'sendLetter':
          template += 'complaint-letter.client.view.html';
          break;
        default:
          template += 'default-activity.client.view.html';
          break;
      };
      return template;
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);

'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;

    $scope.shareCollapsed = true;

    $scope.list = function() {

      $scope.activities = Activity.query();
      // console.log($scope.activities);
    };

    $scope.activityTemplate = function(key) {
      var template = '/modules/activity/partials/';
      switch(key) {
        case 'sendLetter':
          template += 'complaint-letter.client.view.html';
          break;
        default:
          template += 'default-activity.client.view.html';
          break;
      };
      return template;
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);

'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource',
  function($resource) {

    // taken from https://gist.github.com/ghinda/8442a57f22099bdb2e34
    //var transformRequest = function(data, headersGetter) { if (data === undefined) return data;var fd = new FormData();angular.forEach(data, function(value, key) { if (value instanceof FileList) { if (value.length == 1) { fd.append(key, value[0]);} else {angular.forEach(value, function(file, index) {fd.append(key + '_' + index, file);});}} else {if (value !== null && typeof value === 'object'){fd.append(key, JSON.stringify(value)); } else {fd.append(key, value);}}});return fd;}

    var objectToFormData = function(obj, form, namespace) {

      var fd = form || new FormData();
      var formKey;

      for(var property in obj) {
        if(obj.hasOwnProperty(property)) {

          if(namespace) {
            formKey = namespace + '[' + property + ']';
          } else {
            formKey = property;
          }

          // if the property is an object, but not a File,
          // use recursivity.
          if(typeof obj[property] === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof Date)) {

            objectToFormData(obj[property], fd, formKey);

          } else {

            // if it's a string or a File object
            fd.append(formKey, obj[property]);
          }

        }
      }

      return fd;

    };

    // wrap object to formdata method,
    // to use it as a transform with angular's http.
    var formDataTransform = function(data, headersGetter) {

      // we need to set Content-Type to undefined,
      // to make the browser set it to multipart/form-data
      // and fill in the correct *boundary*.
      // setting Content-Type to multipart/form-data manually
      // will fail to fill in the boundary parameter of the request.
      //headersGetter()['Content-Type'] = undefined;

      return objectToFormData(data);

    };


    return $resource('activity', {}, {
      save: {
          method: 'POST',
          transformRequest: formDataTransform,
          headers: {
            'Content-Type': undefined
          }
      },
      public: {
        method: 'GET',
        url: '/activity/public'
      }
    });
  }
]);

'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider.
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/admin/views/admin.client.view.html',
			data: { protected: true }
		});

	}
]);

'use strict';

angular.module('admin')
  .controller('AdminController', ['$scope', '$q', '$modal', 'Referrals',
    function($scope, $q, $modal, Referrals) {

      $scope.list = function() {
        $scope.referrals = Referrals.query();
      };

      $scope.newReferral = {};
      // $scope.newReferral = {
      //   name: 'Dan Kass',
      //   phone: '8459781262',
      //   email: 'romeboards@gmail.com',
      //   organization: 'Community Group'
      // };

      $scope.showCodes = function(codes) {

        var modalInstance = $modal.open({
          templateUrl: 'modules/admin/partials/show-codes.client.view.html',
          controller: ["$scope", "$modalInstance", "codes", function($scope, $modalInstance, codes) {
            $scope.codes = codes;
            $scope.close = function(result) { $modalInstance.close(); };
          }],
          resolve: {
            codes: function () { return codes; }
          }
        });
      };

      $scope.create = function() {
        var newReferral = new Referrals($scope.newReferral);
        newReferral.$save(function(success) {
          $scope.createError = false;
          $scope.message = "Success!";
          $scope.list();
        }, function(error) {
          $scope.createError = true;
          $scope.message = error.data.message;
        });
      };

      $scope.delete = function(referral) {

        referral.$delete({ id: referral._id }).then(function () { $scope.list(); });

        // var toBeDeletedPromises = [];
        //
        // var toBeDeleted = Referrals.query({ email: $scope.deleteReferralEmail }, function() {
        //   if(!toBeDeleted.length) console.log('No referrals found for that email.');
        //   for(var i = 0; i < toBeDeleted.length; i++) {
        //     toBeDeletedPromises.push(toBeDeleted[i].$delete({ id: toBeDeleted[i]._id }).$promise);
        //   }
        //   $q.all(toBeDeletedPromises).then(function () {
        //     $scope.list();
        //   });
        // });
      };

}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('admin').factory('Referrals', ['$resource',
	function($resource) {
		return $resource('referrals', {}, {
			update: {
				method: 'PUT'
			},
			validate: {
				method: 'GET',
				url: '/referrals/validate'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$window', 'Authentication',
  function($rootScope, $state, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(Authentication.user && toState.name === 'landing') {
        event.preventDefault();
        $state.go('home');
      }
      if(!Authentication.user && toState.data && toState.data.protected) {
        event.preventDefault();
        $state.go('signin');
      }

      if(toState.globalStyles) {
        $rootScope.globalStyles = toState.globalStyles;
      } else {
        $rootScope.globalStyles = '';
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);
    });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$provide',
	function($stateProvider, $urlRouterProvider, $provide) {

		$provide.decorator('accordionGroupDirective', ["$delegate", function($delegate) {
	    $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion-group.html';
	    return $delegate;
	  }]);
		$provide.decorator('accordionDirective', ["$delegate", function($delegate) {
	    $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion.html';
	    return $delegate;
	  }]);


		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
		.state('landing', {
			url: '/',
			templateUrl: 'modules/core/views/landing.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('not-found', {
			url: '/not-found',
			templateUrl: 'modules/core/views/404.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('manifesto', {
			url: '/manifesto',
			templateUrl: 'modules/core/views/manifesto.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html',
			data: {
				protected: true,
				disableBack: true
			}
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$window', 'Authentication',
  function($scope, $window, Authentication) {

      $scope.authentication = Authentication;
      $scope.window = $window;

      // Collapsing the menu after navigation
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.state = toState.name;
        $scope.left = false;
        $scope.lightBG = false;
        switch(toState.name) {
          case 'landing':
            $scope.left = true;
            break;
          case 'manifesto':
            $scope.left = true;
            $scope.lightBG = true;
            break;
          default:
            break;
        };

        $scope.showBack = true;
        if(toState.data && toState.data.disableBack) $scope.showBack = false;


      });



      // var wrapper = $document[0].getElementById('header-wrapper');
      // scope.$watch(Authentication, function () {
      //   console.log('auth');
      //   if(!Authentication.user) angular.element(wrapper).css('margin-bottom', '0');
      //   else angular.element(wrapper).css('margin-bottom', '15px');
      // });

  }
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'deviceDetector',
	function($scope, Authentication, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;

	}
]);

'use strict';


angular.module('core').controller('LandingController', ['$scope', 'Authentication', 'deviceDetector',
	function($scope, Authentication, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;
	}
]);

'use strict';

angular.module('core').directive('filesModel', function() {
  return {
    controller: ["$parse", "$element", "$attrs", "$scope", function($parse, $element, $attrs, $scope){
      var exp = $parse($attrs.filesModel);

      $element.on('change', function(){
        exp.assign($scope, this.files);
        $scope.$apply();
      });
    }]
  };
});
'use strict';

/**
 *  BEWARE dragons: https://github.com/angular-ui/bootstrap/issues/2280
 *                  https://github.com/angular-ui/bootstrap/issues/2017
 *
 */

angular.module('core')
.directive('focusOnTouch', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on('touchstart', function (e) {
        element.focus();
        e.preventDefault();
        e.stopPropagation();
      });
    }
  };
})
.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on(attr.stopEvent, function (e) {
        e.stopPropagation();
      });
    }
  };
});

'use strict';

angular.module('core').directive('fullBg', ["$window", function($window) {
    return function (scope, element, attrs) {

      function getWidth() {
        if (self.innerHeight) {
          return self.innerWidth;
        }

        if (document.documentElement && document.documentElement.clientHeight) {
          return document.documentElement.clientWidth;
        }

        if (document.body) {
          return document.body.clientWidth;
        }
      }

      $window.addEventListener('resize', function () {
        element.css('width', getWidth() + 'px');
      });
      element.css('width', getWidth() + 'px');
    };
}]);
'use strict';

angular.module('core').directive('goToTop', ["$document", function($document) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.bind("click", function () {


              // console.log('blah');
                // Maybe abstract this out in an animation service:
                // Ofcourse you can replace all this with the jQ
                // syntax you have above if you are using jQ
                function scrollToTop(element, to, duration) {
                    if (duration < 0) return;
                    var difference = to - element.scrollTop;
                    var perTick = difference / duration * 10;

                    setTimeout(function () {
                        element.scrollTop = element.scrollTop + perTick;
                        scrollToTop(element, to, duration - 10);
                    }, 10);
                }

                // then just add dependency and call it
                scrollToTop($document[0].body, 0, 200);
            });
        }
    };
}]);

'use strict';

angular.module('core').directive('inheritHeight', ['$window', '$timeout', 'deviceDetector', function($window, $timeout, deviceDetector) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {

        scope.$watch("status.loading", function(newV, oldV) {
          $timeout(function () {
            elm.css('height', elm[0].querySelector('.letter-step.ng-enter').offsetHeight + 'px');
          });
        });

      }
    };
}]);

'use strict';

angular.module('core').directive('jumpTo', ['$document', function($document) {
  return {
    controller: ["$parse", "$element", "$attrs", "$scope", function($parse, $element, $attrs, $scope) {

        var id = $attrs.jumpTo;
        var duration = 1000; //milliseconds
        var easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }; //easeInOutCubic
        var offset = 0; //pixels; adjust for floating menu, context etc

        //Scroll to #some-id with 30 px "padding"
        //Note: Use this in a directive, not with document.getElementById 
        var someElement = angular.element(document.getElementById(id));

        $element.bind('click', function(e) {
          $document.scrollToElement(someElement, offset, duration, easing);
        });
    }]
  };
}]);
'use strict';

angular.module('core').directive('languageSelect', ["LocaleService", function (LocaleService) { 'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'modules/core/partials/language-select.client.view.html',
    controller: ["$scope", function ($scope) {
      $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
      $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
      $scope.visible = $scope.localesDisplayNames &&
      $scope.localesDisplayNames.length > 1;

      $scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
      };
    }]
  };
}]);
'use strict';

angular.module('core').directive('loading', ["$document", function($document) {
    return {
        restrict: 'E',
        templateUrl: 'modules/core/partials/loading.client.view.html',
        link: function (scope, elm, attrs) {

        }
    };
}]);

'use strict';

angular.module('core').directive('phoneInput', ["$filter", "$browser", function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {

      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('tel')(value, false));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, '').slice(0,10);
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = function() {
        $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
      };

      // Formats view for initial state then unbinds itself
      var unbindAfterInit = $scope.$watch(function() {
        return ngModelCtrl.$modelValue;
      }, function(value){
        $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
        unbindAfterInit();
      });

      $element.bind('change', listener);
      $element.bind('keydown', function(event) {
        var key = event.keyCode;
        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
            return;
        }
        $browser.defer(listener); // Have to do this or changes don't get picked up properly
      });

      $element.bind('paste cut', function() {
        $browser.defer(listener);
      });
    }
  };
}]);
'use strict';

angular.module('core').directive('propagateEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on('click', function (e) {
          console.log('propagate event');
          //attr.propagate(); 
        });
      }
    };
  });
'use strict';

angular.module('core')
  .directive('smsMessage', ['deviceDetector', 'Authentication', 'Messages',
  function (deviceDetector, Authentication, Messages) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var isIOS8 = function() {
          var deviceAgent = deviceDetector.raw.userAgent.toLowerCase();
          return /(iphone|ipod|ipad).* os [8-9]_/.test(deviceAgent);
        };


        // ios ;
        // ios8 &
        // android ?

        var href = 'sms:';
        var type = attrs.type;
        var msg = Messages.getSMSMessage(type);

        href += Authentication.user.referral.phone;

        if(deviceDetector.os === 'ios') {
          if(isIOS8()) href += '&';
          else href += ';';
          href = href + 'body=' + msg;
          console.log('href', href);
          attrs.$set('href', href);
        } else if(deviceDetector.os === 'android') {
          href = href + '?body=' + msg;
          attrs.$set('href', href);
        } else {
          console.log(href);
          console.log('If you were using a phone, the message would be: \n\n' + msg);
        }



        element.on('click', function (event) {

          // var href = '';
          // if(type === 'sms') href = generateURL();

          //if(href.length) window.location.href = href;
        });
        // scope.$watch(scope.superphone, function() {
        //
        //   console.log('y');
        //   generateURL();
        // });

       // element.bind('click', function (event) { console.log('generate'); smsHref = generateURL();  });

      }
    };

  }]);

'use strict';

angular.module('core').directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });
'use strict';

angular.module('core').directive('windowHeight', ['$window', 'deviceDetector', function($window, deviceDetector) {
    return function (scope, element, attrs) {
        //var w = angular.element($window);

        function getHeight() {
          if (self.innerWidth) {
            return self.innerHeight;
          }

          if (document.documentElement && document.documentElement.clientWidth) {
            return document.documentElement.clientHeight;
          }

          if (document.body) {
            return document.body.clientHeight;
          }
        }


        if(!deviceDetector.isMobile()) {
          $window.addEventListener('resize', function () {
            element.css('height', getHeight() + 'px');
          });
        }

        if(deviceDetector.isMobile() && deviceDetector.browser === 'safari') {
          element.css('height', getHeight() + 60 + 'px');
        } else {
          element.css('height', getHeight() + 'px');
        }

    };
}]);

'use strict';

angular.module('core').filter('tel', function () {
  return function (tel) {

    if (!tel) { return ''; }
    
    var value = tel.toString().trim().replace(/^\+/, '');
    
    if (value.match(/[^0-9]/)) { return tel; }

    var country, city, number;

    switch (value.length) {
      case 1:
      case 2:
      case 3:
        city = value;
        break;
      default:
        city = value.slice(0, 3);
        number = value.slice(3);
    }

    if(number) {
      if(number.length>3) {
        number = number.slice(0, 3) + '-' + number.slice(3,7);
      }
      else {
        number = number;
      }
      return ('(' + city + ') ' + number).trim();
    }
    else {
      return '(' + city;
    }
  };
});
'use strict';

angular.module('core').filter('titlecase', function() {
    return function (input) {
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

        input = input.toLowerCase();
        return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    }
});

'use strict';

//Menu service used for managing  menus
angular.module('core').service('LocaleService', ["$translate", "LOCALES", "$rootScope", "tmhDynamicLocale", function ($translate, LOCALES, $rootScope, tmhDynamicLocale) {

  // PREPARING LOCALES INFO
  var localesObj = LOCALES.locales;

  // locales and locales display names
  var _LOCALES = Object.keys(localesObj);
  if (!_LOCALES || _LOCALES.length === 0) {
    console.error('There are no _LOCALES provided');
  }
  var _LOCALES_DISPLAY_NAMES = [];
  _LOCALES.forEach(function (locale) {
    _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
  });
  
  // STORING CURRENT LOCALE
  var currentLocale = $translate.proposedLanguage();// because of async loading
  
  // METHODS
  var checkLocaleIsValid = function (locale) {
    return _LOCALES.indexOf(locale) !== -1;
  };
  
  var setLocale = function (locale) {
    if (!checkLocaleIsValid(locale)) {
      console.error('Locale name "' + locale + '" is invalid');
      return;
    }
    currentLocale = locale;// updating current locale
  
    // asking angular-translate to load and apply proper translations
    $translate.use(locale);
  };
  
  // EVENTS
  // on successful applying translations by angular-translate
  $rootScope.$on('$translateChangeSuccess', function (event, data) {
    document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html
  
     // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
    tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
  });
  
  return {
    getLocaleDisplayName: function () {
      return localesObj[currentLocale];
    },
    setLocaleByDisplayName: function (localeDisplayName) {
      setLocale(
        _LOCALES[
          _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)// get locale index
          ]
      );
    },
    getLocalesDisplayNames: function () {
      return _LOCALES_DISPLAY_NAMES;
    }
  };
}]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('findhelp').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('findHelp', {
				url: '/find-help',
				templateUrl: 'modules/findhelp/views/find-help.client.view.html',
				data: { protected: true }
			});

	}
]);

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

'use strict';

angular.module('findhelp').directive('cartoMap', ['$rootScope', 'CartoDB', function ($rootScope, CartoDB) {
    return {
      restrict: 'E',
      template: '<div id="map" class="panel"></div>',
      scope: false,
      link: function postLink(scope, element, attrs) {

        /*** init map ***/
        var map = L.map('map', {
          scrollWheelZoom: false,
          // center: [40.6462615921222, -73.96270751953125],
          center: [40.7127, -73.96270751953125],
          zoom: 10
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

        map.attributionControl.removeFrom(map);
        map.attributionControl.setPrefix('');
        var credits = L.control.attribution().addTo(map);
        credits.addAttribution("© <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>");

        // map.on('click', function(e) {
        //     var tempLat = scope.user.lat = e.latlng.lat;
        //     var tempLng = scope.user.lng = e.latlng.lng;
        //     scope.updateCartoMap(tempLat, tempLng, scope.user.byBorough);
        //     scope.updateCartoList(tempLat, tempLng, scope.user.byBorough);
        // });

        var mainSublayer;
        var userMarker;

        /*** init carto layers ***/
        var layerSource = {
          user_name: 'dan-kass',
          type: 'cartodb',

          sublayers: [{
            sql: "SELECT * FROM nyc_cbos_locations",
            cartocss: "#nyc_cbos_locations{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:10;marker-fill:#F60;marker-allow-overlap:true}"
          }]
        };

        cartodb.createLayer(map, layerSource)
          .addTo(map)
          .done(function(layer) {
            mainSublayer = layer.getSubLayer(0);
            // do stuff
            //console.log("Layer has " + layer.getSubLayerCount() + " layer(s).");
          })
          .error(function(err) {
            // report error
            console.log("An error occurred: " + err);
          });

        scope.updateCartoMap = function(lat, lng, orgType) {

          //var boroughString = borough ? '' : 'NOT';
          var orgString = orgType ? 'legal' : 'community';

          var query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT loc.cartodb_id, loc.the_geom, loc.the_geom_webmercator, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, loc.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM nyc_cbos_locations AS loc, nyc_cbos_service_areas AS sa WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), sa.the_geom ) AND loc.organization = sa.organization AND loc.org_type IN ('" + orgString + "') ORDER BY dist ASC ) T LIMIT 10";

          if(userMarker) map.removeLayer(userMarker);
          userMarker = L.marker([lat,lng]);
          userMarker.addTo(map);

          mainSublayer.set({
            sql: query,
            cartocss: "#nyc_cbos_locations{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:10;marker-fill:#F60;marker-allow-overlap:true}#nyc_cbos_locations::labels{text-name:[rownum];text-face-name:'DejaVu Sans Book';text-size:20;text-label-position-tolerance:10;text-fill:#000;text-halo-fill:#FFF;text-halo-radius:2;text-dy:-10;text-allow-overlap:true;text-placement:point;text-placement-type:simple}"
          });

          CartoDB.getSQL().getBounds(query).done(function(bounds) {
            //console.log(lat,lng);
            bounds.push([lat,lng]);
            //console.log(bounds);
          //$rootScope.cartoSQL.getBounds(query).done(function(bounds) {
            map.fitBounds(bounds, { padding: [10,10] });
          });
        };

      }
    };
}]);

'use strict';

/**
 * @ngdoc service
 * @name localResourcesApp.cartoDB
 * @description
 * # cartoDB
 * Service in the localResourcesApp.
 */
angular.module('findhelp')
  .service('CartoDB', [function () {

    //var cartoUrl = "https://dan-kass.cartodb.com/api/v2/sql?q=";
    var cartoSQL = new cartodb.SQL({ user: 'dan-kass' });

    // sql.execute(query)
    //   .done(function(data) {
    //     console.log(data.rows);
    //   })
    //   .error(function(errors) {
    //     // errors contains a list of errors
    //     console.log("errors:" + errors);
    //   });

    /* public functions */
    return {
      queryByLatLng: function(lat, lng, orgType) {

        //var boroughString = borough ? '' : 'NOT';
        var orgString = orgType ? 'legal' : 'community';
        // var query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT bcl.organization, bcl.contact_information, bcl.address, bcl.services, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, bcl.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM brooklyn_cbos_locations AS bcl, brooklyn_cbos AS bc WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), bc.the_geom ) AND bc.cartodb_id = bcl.cartodb_id AND bc.service_area_type " + boroughString + " IN ('borough') ORDER BY dist ASC ) T";
        var query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT loc.organization, loc.contact_information, loc.address, loc.services, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, loc.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM nyc_cbos_locations AS loc, nyc_cbos_service_areas AS sa WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), sa.the_geom ) AND loc.organization = sa.organization AND loc.org_type IN ('" + orgString + "') ORDER BY dist ASC ) T LIMIT 10";
        //console.log(query);
        return cartoSQL.execute(query);
      },
      getSQL: function() { return cartoSQL; }
    }
}]);

'use strict';

// Configuring the Articles module
angular.module('issues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Issues', 'issues', 'dropdown', '/issues(/create)?');
		// Menus.addSubMenuItem('topbar', 'issues', 'List Issues', 'issues');
		// Menus.addSubMenuItem('topbar', 'issues', 'New Issue', 'issues/create');
	}

]);
'use strict';

//Setting up route
angular.module('issues').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider.
		state('listIssues', {
			url: '/issues',
			templateUrl: 'modules/issues/views/list-issues.client.view.html'
		}).
		state('createIssue', {
			url: '/issues/create',
			templateUrl: 'modules/issues/views/create-issue.client.view.html',
			abstract: true
		}).
		state('createIssue.accessCode', {
			url: '/access-code',
			templateUrl: 'modules/issues/partials/access-code.client.view.html',
			data: { disableBack: true }
		}).
		state('createIssue.checklist', {
			url: '/checklist',
			title: 'Issues Checklist',
			templateUrl: 'modules/issues/partials/create-issue-checklist.client.view.html'
		}).
		state('createIssue.general', {
			url: '/general',
			title: 'General Info',
			templateUrl: 'modules/issues/partials/create-issue-general.client.view.html'
		}).
		state('createIssue.personal', {
			url: '/personal',
			title: 'Personal Information',
			templateUrl: 'modules/issues/partials/create-issue-personal.client.view.html'
		}).
		state('createIssue.contact', {
			url: '/contact',
			title: 'Who To Contact',
			templateUrl: 'modules/issues/partials/create-issue-contact.client.view.html'
		}).
		state('createIssue.review', {
			url: '/review',
			title: 'Review',
			templateUrl: 'modules/issues/partials/create-issue-review.client.view.html'
		}).
		state('updateIssues', {
			url: '/issues/update',
			templateUrl: 'modules/issues/views/update-issues.client.view.html'
		});
		// state('viewIssue', {
		// 	url: '/issues/:issueId',
		// 	templateUrl: 'modules/issues/views/view-issue.client.view.html'
		// }).
		// state('editIssue', {
		// 	url: '/issues/:issueId/edit',
		// 	templateUrl: 'modules/issues/views/edit-issue.client.view.html'
		// });
	}
]);

'use strict';

// Issues controller
angular.module('issues').controller('IssuesChecklistController', ['$scope', 'Issues',
  function($scope, Issues) {

    $scope.checklist = {};
    $scope.open = [];

    // detects if checklist is included in the update view or the onboarding form
    // used mainly to switch CTA at the bottom
    if($scope.updateView === undefined) $scope.updateView = false;

    Issues.getChecklist().then(function (data) {

      var i = 0;
      for(var area in data[0]) {
        var issues = data[0][area].issues;

        // add to checklist object
        $scope.checklist[area] = {
          numChecked : $scope.newIssue.issues[area] ? $scope.newIssue.issues[area].length : 0,
          issues: issues
        };

        // initialize newIssues
        if(!$scope.newIssue.issues[area]) $scope.newIssue.issues[area] = [];

        // add issues that are already selected
        issues.forEach(function (issue) {

          // ugly ugly ugly
          if($scope.issues[area] &&
            $scope.issues[area].map(function(i) { return i.title; }).indexOf(issue.title) !== -1) {
              $scope.select(area,issue);
          }
        });

        $scope.open[i++] = false;

      }
    }, function (err) {
      console.error(err);
    });

    $scope.oneAtATime = true;
    $scope.status = {
      idx: -1,
      isFirstOpen: true,
      isFirstDisabled: false
    };

    $scope.select = function(area, issue) {

      if(!this.isSelected(area, issue)) {
        $scope.newIssue.issues[area].push(issue);
        $scope.checklist[area].numChecked++;
      } else {
        var i = $scope.newIssue.issues[area].indexOf(issue);
        $scope.newIssue.issues[area].splice(i, 1);
        $scope.checklist[area].numChecked--;
      }
    };
    $scope.isSelected = function(area, issue) {
      if(!$scope.newIssue.issues[area]) return false;
      return $scope.newIssue.issues[area].indexOf(issue) !== -1;
    };
    // $scope.prevGroup = function(idx) {
    //   $scope.open[idx] = false;
    //   $scope.open[idx-1] = true;
    // };
    // $scope.nextGroup = function(idx) {
    //   $scope.open[idx] = false;
    //   $scope.open[idx+1] = true;
    // };
    $scope.closeGroup = function(idx) {
      $scope.open[idx] = false;
      //$window.scrollTo(0, 0);
    };

  }
]);

'use strict';

// Issues controller
angular.module('issues').controller('IssuesController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Referrals',
  function($scope, $location, $http, Authentication, Users, Referrals) {
    $scope.authentication = Authentication;

    if($scope.authentication.user) {
      $scope.issues = $scope.authentication.user.issues;
    } else {
      $scope.issues = {};
    }

    $scope.newIssue = {};
    $scope.newIssue.issues = {};

    if($location.search().address) {

      var query = $location.search();
      //console.log('string');

      $scope.newIssue.name = query.name;
      $scope.newIssue.phone = query.phone;
      $scope.newIssue.address = query.address;
      $scope.newIssue.borough = query.borough;
      $scope.newIssue.unit = query.unit;
      $scope.newIssue.nycha = query.nycha;
      $scope.newIssue.password = query.password;
    }

    // $scope.newIssue.name = 'Marîa Hernandez';
    // $scope.newIssue.phone = (Math.floor(Math.random() * 9999999999) + 1111111111).toString();
    // //$scope.newIssue.phone = '1234567890';
    // $scope.newIssue.password = 'testtest';
    // $scope.newIssue.borough = 'Bronx';
    // $scope.newIssue.address = '3031 bronxwood ave';
    // $scope.newIssue.unit = '10F';

      // $scope.currentStep = 60;
      // console.log($scope.currentStep);

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.currentStateTitle = toState.title;
      // console.log(toState.name);
      // $scope.currentStep = 50;
      // console.log($scope.currentStep);
    });






    // Validate Access Code
    $scope.newUser = {};
    $scope.newUser.accessCode = 'test';


    $scope.validateCode = function() {

      var referral = new Referrals();
      referral.$validate({ code: $scope.newUser.accessCode },
        function(success) {
          if(success.referral) {
            alert('valid');
            console.log(success.referral);
          } else {
            alert('invalid');
          }
        }, function(error) {
          // error
        });

    };



    // Create new Issue
    $scope.create = function() {

      //console.log($scope.issues);

      var newUser = {
        fullName:     $scope.newIssue.name,
        firstName:    'Dan',
        lastName:     'Kass',
        phone:        '0000000000',
        borough:      $scope.newIssue.borough,
        address:      $scope.newIssue.address,
        unit:         $scope.newIssue.unit,
        nycha:        $scope.newIssue.nycha,
        issues:       $scope.newIssue.issues,
        password:     'password'
      };

      console.log(newUser);

      $http.post('/auth/signup', newUser).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $location.path('/');
      }).error(function(response) {
        console.log(response);
        $scope.error = response;
      });
    };

    $scope.update = function() {

      $scope.authentication.user.issues = $scope.newIssue.issues;
      var user = new Users($scope.authentication.user);

      user.$update(function(response) {
        Authentication.user = response;
        $scope.authentication.user = response;
        $location.path('/issues');
      }, function(response) {
        $scope.error = response.data.message;
      });

    };

    // detirmines if the user hasn't selected any issues
    $scope.hasIssues = function() {
      for(var area in $scope.issues) {
        if($scope.issues[area].length) return true;
      }
      return false;
    };

  }
]);

'use strict';

angular.module('issues').factory('Issues', ['$http', '$q', 'Authentication',
  function Issues($http, $q, Authentication) {

    var checklist = 'data/checklist_old.json';
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

    return {
      getChecklist: function() {
        return request(checklist);
      },
      getUserIssuesByKey: function(key) {
        return Authentication.user.issues[key];
      },
      getUserAreas: function() {
        var areas = [];
        angular.forEach(Authentication.user.issues, function (v, k) {
          if(v.length) { areas.push(k); }
        });
        return areas;
      }
    };
  }
]);

(function () {
  'use strict';

  //Setting up route
  angular
    .module('kyr')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Kyr state routing
    $stateProvider
      .state('kyr', {
        url: '/kyr',
        templateUrl: 'modules/kyr/views/kyr.client.view.html',
        controller: 'KyrController'
      })
      .state('kyrDetail', {
      	url: '/kyr/:kyrId',
      	templateUrl: 'modules/kyr/views/kyr-detail.client.view.html',
      	controller: 'KyrDetailController'
      });
  }
})();

'use strict';

angular.module('kyr').controller('KyrDetailController', ['$scope', '$stateParams', 'kyrService', '$sce',
  function($scope, $stateParams, kyrService, $sce){
  	var queryThis = $stateParams.kyrId - 1;
  	$scope.expand = false;
  	$scope.canExpand = false;

  	kyrService.single(queryThis).then(function(data){
  		$scope.kyr = data;
  		$scope.content = $sce.trustAsHtml(data.content);
			if(data.readMore) {
				return $scope.canExpand = true;
			}
  	});
  }]);


'use strict';

angular.module('kyr').controller('KyrController', ['kyrService', '$scope', 'Pdf',
	function(kyrService, $scope, Pdf) {
		var emptyArray = [];
		$scope.kyrResponse;

		kyrService.fetch().then(function(data){
			$scope.kyrResponse = data;
		}, function(err) {
			console.log(err);
		});
		
	}]);


'use strict';

angular.module('kyr').filter('newlines', ['$sce', function($sce){

  return function(text) {
    var treatedText = text.replace(/\\n/g, '<br/>');
    return $sce.trustAsHtml(treatedText);
  }
}]);

'use strict';

angular.module('kyr').factory('kyrService', ['$resource', '$http', '$q',
	function($resource, $http, $q) {

		// Get all
		// Should be able to bring this over as a Query All from mongoDB at a later state
		this.fetch = function () {
			var deferred = $q.defer();
			$http.get('/data/kyr-new.json').then(function(data){
				var finalData = data.data;
				deferred.resolve(finalData);
			}, function(err) {
				console.log(err);
				deferred.reject(err);
			});
			return deferred.promise;
		};

		// Query single kyr
		this.single = function(id) {
			var deferred = $q.defer();
			$http.get('/data/kyr-new.json').then(function(data){

				// Get correct Know Your Rights
				var finalKyr = data.data[id];
				
				// get our next-previous
				var length = data.data.length;

				if(id === length - 1) {
					finalKyr.next = false;
				} else {
					finalKyr.next = id + 2;
				}

				if(id <= 0) {
					finalKyr.prev = false;
				} else {
					console.log('prev?');
					finalKyr.prev = id;
				}

				if(finalKyr !== undefined) {
					deferred.resolve(finalKyr);
				} else {
					deferred.reject('This KYR does not exist');
				}
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		return this;

	}]);

'use strict';

angular.module('onboarding').run(['$rootScope', '$state', 'Authentication', '$window', function($rootScope, $state, Authentication, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if(!Authentication.user && toState.onboarding && !$rootScope.validated && toState.name !== 'onboarding.accessCode') {
			event.preventDefault();
			$state.go('onboarding.accessCode');
		}
	});

}]);

'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    // Jump to first child state
    $urlRouterProvider.when('/onboarding', '/onboarding/referral');

  	// Onboarding state routing
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
        controller: 'OnboardingController',
        abstract: true,
        data: {
          disableBack: true
        }
      })
      .state('onboarding.accessCode', {
        url: '/referral',
        templateUrl: 'modules/onboarding/partials/onboarding-code.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg'
      })
      .state('onboarding.success', {
        url: '/success',
        templateUrl: 'modules/onboarding/partials/onboarding-success.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg'
      })
      .state('onboarding.problems', {
        url: '/checklist',
        templateUrl: 'modules/onboarding/partials/onboarding-problems.client.view.html',
        onboarding: true
      })
      .state('onboarding.details', {
        url: '/personal',
        templateUrl: 'modules/onboarding/partials/onboarding-details.client.view.html',
        onboarding: true
      })
      .state('onboarding.tutorial', {
        url: '/tutorial',
        templateUrl: 'modules/onboarding/partials/onboarding-tutorial.client.view.html',
        onboarding: true
      });

}]);

'use strict';

angular.module('onboarding').controller('OnboardingController', ['$rootScope', '$scope', '$location', 'Authentication', 'Referrals', '$http', '$modal',
	function($rootScope, $scope, $location, Authentication, Referrals, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newUser = {};
		// create newUser.problems only once (handles next/prev)
		$scope.newUser.problems = [];



		$scope.newUser = {
			borough: 'Brooklyn',
			address: '654 Park Place',
			unit: '1RF',
			phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
			problems: []
		};

	  $scope.accessCode = {
			value: 'bigappsnight',
			valid: false
		};

	  $scope.validateCode = function() {
			// handles back button
			if(!$scope.accessCode.valueEntered || $scope.accessCode.valueEntered !== $scope.accessCode.value) {

				var referral = new Referrals();
		    referral.$validate({ code: $scope.accessCode.value },
		      function(success) {
		        if(success.referral) {
		          $scope.accessCode.valid = $rootScope.validated = true;
		          $scope.accessCode.valueEntered = $scope.accessCode.value;
		          $scope.newUser.referral = success.referral;
							$scope.newUser.referral.code = $scope.accessCode.value;
							$location.path('/onboarding/success');
							$scope.codeError = false;
							$scope.codeWrong = false;
		        } else {
		         	$scope.codeError = false;
		         	$scope.codeWrong = true;
		        }
		      }, function(error) {
						$scope.codeErrorMessage = error.data.message;
		        $scope.codeError = true;
		        $scope.codeWrong = false;
		      });

			// account for canceled entry
			// could probably just use 'else' here but why take chances?
			} else if ($scope.accessCode.valueEntered == $scope.accessCode.value) {
				$scope.accessCode.valid = true;
				$location.path('/onboarding/success');
				$scope.codeError = false;
				$scope.codeWrong = false;
			}
	  };

		$scope.cancelAccessCode = function() {
			// $scope.accessCode.value = '';
			$scope.accessCode.valid = false;
			$location.path('/onboarding/referral');
		};

	  // SIGNUP
		$scope.additionalInfo = function() {
			// Open modal
			var modalInstance = $modal.open({
				animation: 'true',
				templateUrl: 'modules/onboarding/partials/additional-info.client.view.html'
			});
		};

		$scope.userError = false;

		$scope.createAndNext = function (isValid) {

			console.log('create account pre save', $scope.newUser);

			if(isValid) {

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/auth/signup', $scope.newUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					$scope.authentication.user = response;
					console.log('create account post save', response);
					$location.path('/onboarding/tutorial');

				}).error(function(err) {
					$rootScope.loading = false;
        	$scope.error = err;
				});

			} else {
				$scope.userError = true;
			}

		};


	}]);

angular.module('onboarding')
  .directive('pwCheck', [function () {
    return {
    	require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = attrs.pwCheck;
        elem.on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===document.getElementById(firstPassword).value;
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }]); 
'use strict';

angular.module('onboarding').directive('selectionList', function selectionList(/*Example: $state, $window */) {
  return {
    templateUrl: 'modules/onboarding/partials/selection-list.client.view.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
    	var aTags = element.find('a');
    	var wrappedTags = [];

    	var activateThis = function() {
    		this.on('click', function(e) {
    			var thisWrapped = angular.element(this);
	    		for (var i = 0; i < wrappedTags.length; i++) {
	    			wrappedTags[i].removeClass('active');
	    		}
	  			thisWrapped.addClass('active');
	  			scope.process = this.getAttribute('process');
	  			console.log(scope);
    		});
    	};

    	for (var i = 0; i < aTags.length; i++) {
    		var elm = angular.element(aTags[i]);
    		activateThis.call(elm);
    		wrappedTags.push(elm);
    	}
    }
  };
});

'use strict';

angular.module('onboarding').factory('AccessCodeService', ['$resource', function($resource) {

	return $resource('access-code', {}, {
		save: {
			method: 'POST'
		},
		get: {
			method: 'GET'
		},
		delete: {
			method: 'DELETE'
		}
	});

}]);

'use strict';

angular.module('onboarding').factory('UserListingService', ['$resource', function($resource) {
  // Public API
  return $resource('users/list');
}]);

'use strict';

// Setting up route
angular.module('problems').run(['$rootScope', '$state', '$window', 'Authentication',
  function($rootScope, $state, $window, Authentication) {

  }
]);

'use strict';

//Setting up route
angular.module('problems').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Issues state routing
		$stateProvider.
		state('updateProblems', {
			url: '/checklist',
			templateUrl: 'modules/problems/views/update-problems.client.view.html'
		});

	}
]);

'use strict';

angular.module('problems').controller('ModalProblemController', ['$scope', 'Problems', '$modalInstance', 'issues', 'userProblem',
	function($scope, problems, $modalInstance, issues, userProblem) {

		$scope.issues = issues;
		$scope.userProblem = userProblem;

		// only use this in case of "cancel"
		var userIssuesClone = $scope.userProblem.issues.slice(0);

		// $scope.checkString = '';
		// $scope.tempIssues = [];
		// $scope.other = undefined;

		// Active mapper/other issue tracker
		// for (var i = 0; i < userProblem.issues.length; i++) {
		// 	// Temp issues is a new copy of our user Problems -- we can't use the actual user Problem, because it could be directly from our user's object
		// 	$scope.tempIssues.push(userProblem.issues[i]);
		// 	// Check string handles our active state on init, so when we call our problem-issue-item directive (line 10)
		// 	$scope.checkString += userProblem.issues[i].key;
		//
		// 	// If issues exists for this problem, create it in the scope and we'll reference it in the problem-issue-directive (line 33)
		// 	if(userProblem.issues[i].key == 'other') {
		// 		$scope.other = $scope.tempIssues[i];
		// 		$scope.tempIssues.splice(i, 1);
		// 	}
		// }

		// we should just take advantage of angulars data binding here
		$scope.isSelected = function(issue) {
			return $scope.userProblem.issues.containsByKey(issue.key);
		};

		$scope.select = function(issue) {
			if($scope.isSelected(issue)) {
				$scope.userProblem.issues.removeByKey(issue.key);
			} else {
				$scope.userProblem.issues.push(issue);
			}
		};


		$scope.save = function(event) {
			// did we end up making our other issue -- if it's not created in the above loop or the parent directive, then this doesn't get fired
			// if($scope.other) {
			// 	$scope.tempIssues.push($scope.other);
			// }
			// console.log()
			// Pass our temporary copy w/ updates back up our modal function at problem-checklist directive (line 93)
			// $modalInstance.close($scope.tempIssues);

			// console.log($scope);
			if($scope.newOther && $scope.newOther.key.length) {
				$scope.addOther(event);
			}

			$modalInstance.close();
		}
		$scope.cancel = function() {
			$scope.userProblem.issues = userIssuesClone;
			$modalInstance.close();
		}

	}])

'use strict';

angular.module('problems').controller('ProblemsController', ['$scope', '$state', 'Authentication', 'Users', 'Problems',
	function($scope, $state, Authentication, Users, Problems) {

		// should probably check for unsaved changes...

		$scope.updateSuccess = false;
		$scope.updateFail = false;

		$scope.updateProblems = function() {
			var user = new Users(Authentication.user);

			// Meegan -- WHAT HAVE I TOLD YOU ABOUT COPY PASTING. Repeating block, bring this into onboarding
			user.firstName = user.fullName.split(' ')[0];
			user.lastName = user.fullName.split(' ')[1];

			user.$update(function(response) {
				Authentication.user = response;
				$scope.updateSuccess = true;
				$scope.updateFail = false;
			}, function(response) {
				$scope.updateSuccess = false;
				$scope.updateFail = true;
				$scope.error = response.data.message;
			});
		};

	}])

'use strict';

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems', '$modal',
  function(Authentication, Problems, $modal) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: false,
      link: function postLink(scope, element, attrs) {

          // displaying the state for problems can be handled by something like
          // ourUser.problems[problem].length
					// var problemsActiveString = '';

					// problemAssembler, if we don't have the problem set we just clear it out here
					var newProblem = function(problem) {

						var newProb = {};

						newProb.startDate = new Date();
				    newProb.createdDate = new Date();
				   	newProb.key = problem.key;
				    newProb.title = problem.title;
				    newProb.icon = problem.icon;
				    newProb.description = '';
				    newProb.issues = [];
				    newProb.photos = [];
				    newProb.relatedActivities = [];

				    return newProb;
					};


          // this is a reference to whichever user we're working with, i.e.
          // scope.newUser or Authentication.user
          // scope.ourUser;

          // user exists
          if(!Authentication.user) {
            // This needs to be tested to see if it actually... works...
            scope.ourUser = scope.newUser;
          } else {
            scope.ourUser = Authentication.user;
          }

          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;
            // Set state if problems exist (NOT ACTIVE ON BOARDING)

            // you can just use the length of ourUser.problems (see above)
            // scope.problems.map(function(curr, idx, arr){
            // 	if(problemsActiveString.indexOf(curr.key) > -1){
            // 		curr.active = true;
            // 	}
            // });

            // initialize numChecked
            scope.ourUser.problems.forEach(function (userProb) {

              var prob = scope.problems.getByKey(userProb.key);

              prob.numChecked = userProb.issues.length;

              userProb.issues.forEach(function (i) {
                if(!prob.issues.containsByKey(i.key)) {
                  prob.issues.push(i);
                }
              });
            });


          });


          // // inherit newUser.problems or user.problems
          // if(attrs.onboarding === 'true') {
          // 	// Needs to not reset if landing on this page
          // 	var ourUserProblems = scope.newUser.problems = [];
          // } else {
          // 	// This needs to be tested to see if it actually... works...
          // 	var ourUserProblems = Authentication.user.problems;
          // 	for(var i = 0; i < ourUserProblems.length; i++){
          // 		problemsActiveString += ourUserProblems[i].key;
          // 	}
          // }




          // just referring to this as scope.ourUser.problems
          // var ourUserProblems = scope.ourUser.problems;

          // modal opening/closing
          // passing scopes
					scope.open = function(problem) {

						scope.currentProblem = problem;

            // this will get ourUsers problems, or create a new skeleton
            // ourUserCurrentProblem is another reference to this object,
            // so changing it will change ourUser.problems[problem.key]
            // this would be sooo much easier if we were using ES6
            if(!scope.ourUser.problems.containsByKey(problem.key)) {
              scope.ourUser.problems.push(newProblem(problem));
            }

            var ourUserCurrentProblem = scope.ourUser.problems.getByKey(problem.key);

						// // check if user has already filled out the CURRENT problem, set it, and remove it from ALL problems
						// ourUserProblems.map(function(curr, idx, arr){
						// 	if(curr.key == problem.key) {
						// 		ourUserCurrentProblem = curr;
						// 		arr.splice(idx, 1);
						// 	}
						// });
            //
						// // If the user didn't set the CURRENT problem, build new one
						// if(!ourUserCurrentProblem) {
						// 	ourUserCurrentProblem = newProblem(problem);
						// }
						// console.log(ourUserCurrentProblem);

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
              backdrop: 'static',
				      resolve: {
				      	// All issues straight from the json fetch
				      	issues: function() {
				      		return scope.currentProblem.issues;
				      	},
				      	// Our user's CURRENT problem, if we found one above
				      	userProblem: function() {
				      		return ourUserCurrentProblem;
				      	}
				      }
				    });

				   	modalInstance.result.then(function(){

              scope.currentProblem.numChecked = ourUserCurrentProblem.issues.length;

              // check if the modal was closed and no issues were selectedIssues
              // if so, remove from ourUser.problems
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }

              // lectedIssues){
              // f we got updates as set by the modal controller, our CURRENT problem should be updated accordingly
              // serCurrentProblem.issues = selectedIssues;
              // e pass the CURRENT problem into ALL problems -- no duplates, as we either created this issue brand new or deleted it from the original object
              // e.ourUser.problems.push(ourUserCurrentProblem);
              //
              // X active state handle
              //   // see above comments about state
              //   // ectedIssues.length == 0) {
              //   // .currentProblem.active = false;
              //   //  {
              //   // .currentProblem.active = true;
              //   //
              // e {
              // emember when we removed the original problem? This should attach it back into our object
              // urUserCurrentProblem.issues.length > 0) {
              // pe.ourUser.problems.push(ourUserCurrentProblem);
              //
              // rn;
              //

              // Reset current and global user
              // ourUserCurrentProblem = undefined;
				   	});

					};




      }
    };
}]);

'use strict';

angular.module('onboarding').directive('problemOtherItem', ['$timeout', '$filter', function($timeout, $filter){
  return {
    template: '',
    restrict: 'A',
    link: function(scope, element, attrs) {

    	// Our parent's checkString, and whether to make these active
    	// if(scope.checkString) {
    	// 	if(scope.checkString.indexOf(attrs.issue) > -1){
    	// 		element.addClass('active');
    	// 	}
    	// }

			// Selection of issue
			// scope.selectIssue = function(issue){
      //
			// 	if(element.hasClass('active') === true) {
			// 		scope.removeIssue(issue);
			// 		return;
			// 	}
      //
			// 	element.addClass('active');
			// 	scope.$parent.tempIssues.push(issue);
			// };

      element.on('touchstart touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });

      scope.addMore = false;

      scope.toggleOther = function(event) {

        event.preventDefault();
        event.stopPropagation();
        scope.addMore = true;

        scope.newOther = {
          key: '',
          emergency: false
        };

        element.find('input')[0].focus();

        // $timeout waits until after scope.addMore has been applied
        $timeout(function () {
          var objDiv = document.querySelector(".selecter-options");
          objDiv.scrollTop = objDiv.scrollHeight;
        });
      };

			scope.addOther = function(event) {

        // stupid javascript
        event.stopPropagation();

        // angular doesn't like duplicates...
        if(!scope.userProblem.issues.containsByKey(scope.newOther.key) && scope.newOther.key.length) {

          scope.newOther.key = $filter('titlecase')(scope.newOther.key);

          scope.issues.push(scope.newOther);
          scope.userProblem.issues.push(scope.newOther);

          // make sure we create a new reference
          scope.newOther = {
            key: '',
            emergency: false
          };
          scope.addMore = false;

          // $timeout waits until after scope.addMore has been applied
          $timeout(function () {
            var objDiv = document.querySelector(".selecter-options");
            objDiv.scrollTop = objDiv.scrollHeight;
          });
        }

				// Our parent Modal Controller could contain the other issue -- if not, we can create it here (gets passed up into the modal save controller)
	    	// scope.other = scope.other || {
				// 	key: 'other',
				// 	value: '',
	  		// 	emergency: false
	    	// };


        // A not great copy of jumpTo.js in core directives (need to target element, not $document), willing to reassess
        // var someElement = angular.element(document.getElementById('other-block'));
        // var parentModal = angular.element(document.getElementsByClassName('selection-module')[0]);
        // parentModal.scrollToElement(someElement, 0, 800);
			};

			// scope.removeIssue = function(issue) {
			// 	// UI update, then remove this issue from our temporary issues
			// 	element.removeClass('active');
			// 	scope.tempIssues.map(function(curr, idx, arr){
			// 		if(curr.key == issue.key) {
			// 			arr.splice(idx, 1);
			// 		}
			// 	});
			// };
    }
  };

}]);

'use strict';

angular.module('problems').filter('problemTitle', function() {
  return function(input) {

    switch(input) {
      case 'bedrooms':
        return 'Bedrooms';
      case 'kitchen':
        return 'Kitchen';
      case 'bathroom':
        return 'Bathrooms';
      case 'entireHome':
        return 'Entire Home';
      case 'livingRoom':
        return 'Living Room';
      case 'publicAreas':
        return 'Public Areas';
      case 'landlordIssues':
        return 'Landlord Issues';
      default:
        return '';
        break;
    }
  };
});

'use strict';

angular.module('onboarding').factory('Problems', ['$http', '$q', 'Authentication',
	function($http, $q, Authentication){

		var requestLocalFile = function() {
			var deferred = $q.defer();

			$http.get('data/checklist.json').then(function(response) {
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		};

		return {
			getLocalFile: function() {
				return requestLocalFile();
			},
			getUserIssuesByKey: function(key) {
				return Authentication.user.problems.getByKey(key).issues;
			},
			getUserProblems: function() {
				var problems = [];
				for(var i = 0; i < Authentication.user.problems.length; i++) {
					problems.push(Authentication.user.problems[i].title);
				}
				return problems;
			}
		};



	}]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$rootScope', '$q', '$location', 'Authentication',
			function($rootScope, $q, $location, Authentication) {
				return {
					responseError: function(rejection) {

						switch (rejection.status) {
							case 401:

								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								$location.path('not-found');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Users state routing
    // Jump to first child state
    $urlRouterProvider.when('/settings', '/settings/profile');

		$stateProvider
      .state('settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'modules/users/views/settings/settings.client.view.html',
        abstract: true
      })
   		.state('settings.profile', {
   			url: '/profile',
				templateUrl: 'modules/users/views/settings/landing.client.view.html',
				settings: true
   		})
   		.state('settings.edit', {
				url: '/edit',
				templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
				settings: true
   		})
   		.state('settings.password', {
				url: '/password',
				templateUrl: 'modules/users/views/settings/change-password.client.view.html',
				settings: true
   		})
   		.state('settings.phone', {
   			url:'/phone',
				templateUrl: 'modules/users/views/settings/edit-phone.client.view.html',
				settings: true
   		});

		// This should be a separate router block -- it deals w/ abstract and nonleanear flows
		$stateProvider.
			state('signin', {
				url: '/signin',
				templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			}).
			state('forgot', {
				url: '/password/forgot',
				templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
			}).
			state('reset-invalid', {
				url: '/password/reset/invalid',
				templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
			}).
			state('reset-success', {
				url: '/password/reset/success',
				templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
			}).
			state('reset', {
				url: '/password/reset/:token',
				templateUrl: 'modules/users/views/password/reset-password.client.view.html'
			});
			
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$state', 'Authentication',
  function($rootScope, $scope, $http, $state, Authentication) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $state.go('home');

    // signup moved to issues module...
    // $scope.signup = function() {
    //   $http.post('/auth/signup', $scope.credentials).success(function(response) {
    //     // If successful we assign the response to the global user model
    //     $scope.authentication.user = response;
    //     // And redirect to the index page
    //     $location.path('/');
    //   }).error(function(response) {
    //     $scope.error = response.message;
    //   });
    // };

    $scope.signin = function() {
      $http.post('/auth/signin', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // console.log($scope.authentication.user);
        $state.go('home');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			console.log($scope.credentials);
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			console.log($stateParams);

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$filter', 'Users', 'Authentication',
  function($scope, $http, $location, $filter, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.passwordVerified = false;
    
    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');

    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function(provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function(provider) {
      $scope.success = $scope.error = null;

      $http.delete('/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signOut = function() {
    	$http.get('/auth/signout')
    		.then(function(success) {
    			$location.path('/');
    		}, function(err) {
    			console.log(err);
    		});
    }

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        console.log('user', user);
        // This is a horrendus patch and needs to be fixed in onboarding
        user.firstName = user.fullName.split(' ')[0];
        user.lastName = user.fullName.split(' ')[1];

        user.$update(function(response) {
        	console.log(response);
          $scope.success = true;
          Authentication.user = response;
        }, function(response) {
        	console.log(response);
          $scope.error = response.data.message.message;
          // TODO: run the stack up to why this error is so nested
          if(response.data.message.errors)  {
          	if(response.data.message.errors.phone) {
          		$scope.errorPhone = response.data.message.errors.phone.message;
          	}
          }
        });
      } else {
        $scope.submitted = true;
      }
    };

    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.verifyPassword = function(password) {

    	$http.post('/users/verify-password', {"password": password}).success(function(response){
    		$scope.passwordVerified = true;
    	}).error(function(err) {
    		$scope.passwordError = true;
    		$scope.errorMessage = err.message; 
    	});
    }
  }
]);
'use strict';

angular.module('core').directive('toggleSharing', ['Users', 'Authentication',
  function(Users, Authentication) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm, attrs) {

        if(Authentication.user.sharing.enabled) {
          elm[0].querySelector('input').checked = true;
        }

        elm.bind('click', function(event) {
          event.stopPropagation();
          console.log(event.target.tagName);
          if( event.target.tagName === "INPUT") {
            // alert('clicked');
            // elm[0].querySelector('input').checked = !elm[0].querySelector('input').checked;
            Users.enableSharing(function (user) {
              Authentication.user = user;
            });
          }

        });
      }
    };
}]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function($resource) {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			},
			enableSharing: {
				method: 'GET',
				url: '/users/public'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);
