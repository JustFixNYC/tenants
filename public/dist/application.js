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
 		'tmh.dynamicLocale',// angular-dynamic-locale
		'angular.filter',
		'angular-clipboard'
 		/* 'ngSanitize'*/ // Santize translations -> /application.js at line ~40
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
    $locationProvider.html5Mode(true);
  }])
  // whitelisting URLs
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|sms|mailto):/);
    // enable this for speed enhancement b4 production push
    // $compileProvider.debugInfoEnabled(false);
  }])
  // .config(['$tooltipProvider', function($tooltipProvider){
  //  $tooltipProvider.setTriggers({
  //   'mouseenter': 'mouseleave',
  //   'click': 'mouseleave',
  //   'focus': 'blur',
  //   'hideonclick': 'click'
  //  });
  // }])
  // internationalization constants
  .constant('LOCALES', {
    'locales': {
        'en_US': 'English',
        'es_mx': 'Español'
    },
    'preferredLocale': 'en_US'
  })
  // async loading for templates
  .config(function ($translateProvider, $translateSanitizationProvider) {
  	// enable logging for missing IDs
    // $translateProvider.useMissingTranslationHandlerLog();

    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });

    $translateProvider.preferredLanguage('en_US');// is applied on first load
    $translateProvider.fallbackLanguage('en_US'); // fallback! for pdf and msg generation

    $translateProvider.useLocalStorage(); // saves selected language to localStorage
    // NOTE: This shit causes all sorts of issues with our UI-SREF attribute. Not recognized in any sanitizer module, and causes it to break
    $translateProvider.useSanitizeValueStrategy(null); // Normally, prevent XSS, but in this case we're only using local translations
  })
  // location of the locale settings
  .config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');
  })
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
  })
  .run(function($rootScope, $location, LocaleService) {
    // ensure that this happens on pageload
    // https://github.com/angular-ui/ui-router/issues/1307
    var setHeaderState = function(name) {
      switch(name) {
        case 'landing': case 'oldLanding':
          $rootScope.headerInner = false;
          // $rootScope.headerLightBG = true;
          $rootScope.headerLightBG = false;
          break;
        case 'manifesto':
          $rootScope.headerInner = false;
          $rootScope.headerLightBG = true;
          break;
        default:
          $rootScope.headerInner = true;
          $rootScope.headerLightBG = false;
          break;
      };
    };

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

      $rootScope.state = toState.name;

      if(toState.data && toState.data.disableBack) {
        $rootScope.showBack = false;
      } else {
        $rootScope.showBack = true;
      }

      setHeaderState(toState.name);
    });
  })
  .run(function($rootScope, $location, LocaleService, $translate) {

  	// $translate.use('en_US');

    var browserLanguage = navigator.language || navigator.userLanguage;

    var langQuery = $location.search().lang;
    var userLang = navigator.language || navigator.userLanguage;

    if(!$location.search().hasOwnProperty('lang')) { // No language selected, check if browser lang is true
      // console.log('condition 0');
    	if(LocaleService.checkIfLocaleIsValid(userLang)) {
    		LocaleService.setLocaleByName(userLang);
    	}
    	return;
  	} else if(langQuery === 'es' || langQuery === 'es-mx') { // Spanish URL slightly wrong
      // console.log('condition 1');
			// $location.search('lang', 'es_mx');
			LocaleService.setLocaleByName('es_mx');
		}else if(langQuery === 'en' || langQuery === 'en-us') { // English url slightly wrong
      // console.log('condition 2');
			// $location.search('lang', 'en_US');
			LocaleService.setLocaleByName('en_US');
		} else if(LocaleService.checkIfLocaleIsValid(langQuery)){  // account for exactly-correct urls
      // console.log('condition 3');
			LocaleService.setLocaleByName(langQuery);
		} else { 														// Totally wrong lang query, default to english
      // console.log('condition 4');
			$location.search('lang', '');
  	}
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

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('advocates');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('findhelp');

'use strict';

ApplicationConfiguration.registerModule('kyr');
'use strict';

ApplicationConfiguration.registerModule('onboarding');
'use strict';

ApplicationConfiguration.registerModule('problems');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('tutorial');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('actions').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {


		// Actions state routing
		$stateProvider
			.state('listActions', {
				url: '/take-action',
				templateUrl: 'modules/actions/views/list-actions.client.view.html',
				data: { protected: true },
				user: 'tenant'
			});

	}
]);

'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$filter', 'Authentication', 'Actions', 'Activity',
  function($scope, $filter, Authentication, Actions, Activity) {
    //$scope.authentication = Authentication;
    $scope.user = Authentication.user;

    //
    // $scope.userCompletedDetailsProgress = function() {
    //
    //   var prog = 0,
    //       $scope.user.problems
    //   $scope.user.problems
    //
    //   return prog;
    // };


    $scope.userCompletedDetails = function() {
      if($scope.user.actionFlags) {
        return $scope.user.actionFlags.indexOf('allInitial') !== -1;
      }
      else return false;
    };

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

  $scope.newActivity.keyTitle = 'checklist.' + $scope.newActivity.key + '.title';

  $scope.newActivity.problems = [{ issues: JSON.parse(JSON.stringify( $scope.issues, function( key, value ) {
        if( key === "$$hashKey" || key === "_id" ) {
            return undefined;
        }

        return value;
    }))
  }];


  $scope.formSubmitted = false;

  // $scope.areas = Issues.getUserAreas().map(function (a) { return $filter('areaTitle')(a) });

  //console.log('update activity cntrl',$scope.newActivity);

  $scope.onFileSelect = function(files) {
    console.log(files);
  };

  $scope.done = function (isValid) {

    $scope.formSubmitted = true;

    if(isValid) {
      $scope.newActivity.fields.push({ title: 'modules.activity.views.listActivity.experienced', value: $filter('date')($scope.newActivity.startDate, 'longDate') });
      $modalInstance.close({ newActivity: $scope.newActivity });
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('actions').controller('ComplaintLetterController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'newActivity', 'Pdf', 'Messages', 'Authentication', '$window',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, newActivity, Pdf, Messages, Authentication, $window) {

		$scope.user = Authentication.user;
	  $scope.newActivity = newActivity;
		$scope.newActivity.fields = [];
		$scope.landlord = {
			name: '',
			address: ''
		};
		$scope.accessDates = [];
		$scope.accessDates.push('');

		$scope.status = {};
		$scope.status.created = false; // initial state
		$scope.status.state = 'landlordInfo'; // initial state
		// $scope.status.state = 'loading'; // initial state

		// landlordInfo, msgPreview,
		// loading, msgError,
		// msgSuccess, letterReview, letterSuccess

		$scope.addAccessDate = function() {
			$scope.accessDates.push('');
		};

	  // var user = Authentication.user;
		var timerCountdown = 30;
		var setCreationTimer = function() {
			$timeout(function () {
				if(!$scope.status.created) {
					$scope.status.state = 'error';
					Rollbar.warning("Request for the letter took too long to respond");
	  			$scope.errorCode = 'Request for the letter took too long to respond';
				}
			}, timerCountdown * 1000);
		};

		$scope.generatePreview = function() {
			$scope.msgPreview = Messages.getLandlordEmailMessage($scope.landlord.name, $scope.accessDates);
			$scope.status.state = 'msgPreview';
		};


	  $scope.createLetter = function() {

			$scope.status.state = 'loading';

	  	Pdf.createComplaint($scope.landlord, $scope.accessDates).then(
	  		function success(data) {
					setCreationTimer();
					$scope.status.state = 'msgSuccess';
					$scope.status.created = true;
					$scope.letterUrl = data;
					$scope.newActivity.fields.push({ title: 'letterURL', value: data });
	  		},
	  		function failure(error) {
					$scope.status.state = 'error';
					Rollbar.error("Error with letter generation");
	  			$scope.errorCode = error;
	  		}
	  	);

	  };

		$scope.sendLetter = function() {

			Rollbar.info("New Letter of Complaint!", {
				name: Authentication.user.fullName,
				phone: Authentication.user.phone,
				letterUrl: $scope.letterUrl,
				landlordName: $scope.landlord.name,
				landlordAddress: $scope.landlord.address
			});
			$scope.newActivity.fields.push({ title: 'landlordName', value: $scope.landlord.name });
			$scope.newActivity.fields.push({ title: 'landlordAddress', value: $scope.landlord.address });

			$scope.status.state = 'letterSuccess';
		};

		$scope.mailItMyself = function() {
			Rollbar.info("New Letter of Complaint! (mail on their own)", {
				name: Authentication.user.fullName,
				phone: Authentication.user.phone,
				letterUrl: $scope.letterUrl,
				landlordName: $scope.landlord.name,
				landlordAddress: $scope.landlord.address
			});
			$scope.done();
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

    $scope.formSubmitted = false;

    $scope.done = function (isValid, event) {

      $scope.formSubmitted = true;

      console.log(event);

      if(isValid && event.target.href) {
        $modalInstance.close({ newActivity: $scope.newActivity });
        window.location.href = event.target.href;
      } else {
        console.log('no href?');
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

'use strict';

angular.module('actions').controller('DecreasedServicesController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.addUpdate = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

'use strict';

angular.module('actions').controller('HpactionController', function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close({ newActivity: $scope.newActivity });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

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
// TODO: this is used all over the place, move it into /core module?

angular.module('actions').directive('compileTemplate', ['$compile', '$parse', '$sce', '$translate',
	function($compile, $parse, $sce, $translate){
    return {
        link: function(scope, element, attr){

            var parsed = $parse(attr.ngBindHtml);

            var getStringValue = function() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function(val) {
            	// Check if our translation service has failed
            	if(val.indexOf('modules') !== -1) {
            		$translate(val).then(function(newVal){
	            		element.html(newVal);
	            		$compile(element, null, -9999)(scope);
            		});
            	} else {
            		element.html(val);
	              $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            	}
          	});
        }
    }
	}
]);

'use strict';

angular.module('actions')
  .directive('statusUpdate', ['$rootScope', '$filter', '$sce', '$timeout', 'Activity', 'Actions', 'Problems',
    function ($rootScope, $filter, $sce, $timeout, Activity, Actions, Problems) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/status-update.client.view.html',
      controller: function($scope, $element, $attrs) {
        //$scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.problems = Problems.getUserProblems();

        scope.status = {
          expanded: false,
          extraExpanded: false,
          tagging: false,
          closeAlert: false,
          closeErrorAlert: true,
          formSubmitted: false,
          completed: false
        };
        //if(!scope.completed) scope.completed = false;

        if($rootScope.expandStatus) {
          scope.status.expanded = true;
          scope.status.extraExpanded = true;
          $timeout(function() { element[0].querySelector('textarea').focus(); }, 0);
        }

        if(!$rootScope.takeActionAlert) {
          scope.status.expanded = true;
          $timeout(function() { element[0].querySelector('textarea').focus(); }, 0);
        }

        scope.newActivity = {
          date: '',
          title: 'modules.activity.other.statusUpdate',
          key: 'statusUpdate',
          relatedProblems: [],
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
            scope.newActivity.relatedProblems.push(problem);
          } else {
            var i = scope.newActivity.relatedProblems.indexOf(problem);
            scope.newActivity.relatedProblems.splice(i, 1);
            // $scope.checklist[area].numChecked--;
          }
        };
        scope.isSelectedProblem = function(problem) {
          // if(!$scope.newIssue.issues[area]) return false;
          return scope.newActivity.relatedProblems.indexOf(problem) !== -1;
        };

        scope.addPhoto = function(file) {

          if(file) {
            scope.newActivity.photos.push(file);
            // console.log(file);
            // console.log(file.lastModifiedDate);
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

            console.time("statusUpdate");

            // console.log('create activity pre creation', scope.newActivity);

            // [TODO] have an actual section for the 'area' field in the activity log
            // if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
            // else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

            var activity = new Activity(scope.newActivity);

            // console.log('create activity post creation', scope.newActivity);

            activity.$save(function(response) {

              // console.log('create activity post save', response);
              console.timeEnd("statusUpdate");

              $rootScope.loading = false;
              scope.status.completed = true;
              scope.status.formSubmitted = false;
              scope.status.expanded = false;
              scope.newActivity = {
                date: '',
                title: 'modules.activity.other.statusUpdate',
                key: 'statusUpdate',
                relatedProblems: [],
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
  .directive('toDoItem', ['$rootScope', '$modal', '$sce', '$compile', '$filter', '$timeout', 'Authentication', 'Activity', 'Actions', '$translate',
    function ($rootScope, $modal, $sce, $compile, $filter, $timeout, Authentication, Activity, Actions, $translate) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: function($scope, $element, $attrs) {

      	$scope.user = Authentication.user;

        $scope.filterTitleHTML = $scope.action.title;
        $scope.filterContentHTML =  $scope.action.content;
        $scope.filterButtonTitleHTML = $scope.action.cta.buttonTitle;
        $scope.closeErrorAlert = true;
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!

        scope.followUpSubmitted = false;

        // scope.completed = false;
        // scope.action.completed = false;
        if(!scope.action.completed) scope.action.completed = false;

        scope.newActivity = {
          title: scope.action.activityTitle,
          key: scope.action.key
        };

        if(scope.action.isFollowUp) {
          // get potential follow up startDate
          if(scope.action.startDate) {
            scope.newActivity.startDate = new Date(scope.action.startDate);
          }
        }

        scope.newActivity.fields = [];
        // if action has custom fields, initialize those in the newActivity object
        if(scope.action.followUp && scope.action.followUp.fields) {
          angular.forEach(scope.action.followUp.fields, function(field, idx) {
            scope.newActivity.fields.push({ title: field.title });
          });
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

          var modalInstance = $modal.open({
            //animation: false,
            templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
            controller: scope.action.cta.controller,
            backdrop: 'static',
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          // prevent body scrolling, hack hack hack
          modalInstance.opened.then(function () {
            angular.element(document).find('html').css({"overflow": "hidden", "position": "fixed" });
          });

          modalInstance.result.then(function (result) {

            angular.element(document).find('html').css({"overflow": "auto", "position": "static" });


            scope.newActivity = result.newActivity;

            // this should check for isFollowUp (or should is be hasFollowUp)
            if(scope.action.hasFollowUp) {
              scope.triggerFollowUp(true);
            }
            // if(scope.action.isFollowUp && scope.action.isFollowUp) scope.triggerFollowUp();
            else if(!result.modalError) scope.createActivity(true, false);

          }, function () {
            // modal cancelled

            angular.element(document).find('html').css({"overflow": "auto", "position": "static" });
          });
        };

        scope.triggerFollowUp = function(hasDoneAction, url, type) {

          if(hasDoneAction) {
            scope.newActivity.startDate = scope.action.startDate = new Date();
          }

          // console.log()

          scope.action.$followUp({ type: 'add' });



          if(url && type === 'tel') window.location.href = url;
          else if(url && type === 'link') window.open(url, '_blank');
        };

        scope.completeAction = function() {
          scope.action.completed = true;
          scope.action.closeAlert = false;
        };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });
        };

        scope.closeAlert = function() {
          scope.action.closeAlert = true;
          var section = getSection(scope.action.type);
          section.splice(scope.$index,1);
        };

        var compareDates = function(start, created) {
          var startDate = new Date(start).setHours(0,0,0,0);
          var createdDate = new Date(created).setHours(0,0,0,0);
          return startDate !== createdDate;
        }

        scope.createActivity = function(isValid, addDOA) {

          if(scope.action.hasFollowUp) {
            scope.followUpSubmitted = true;
          }

          if(isValid) {



            // if(addDOA && compareDates(scope.newActivity.startDate, new Date())) {
            if(addDOA) {
              scope.newActivity.fields.unshift({ title: 'modules.actions.partials.toDoItem.occurredDate', value: $filter('date')(scope.newActivity.startDate, 'longDate') });
            }

            $rootScope.loading = true;

            console.time("toDoItem");

            // console.log('create activity pre creation', scope.newActivity);

            var activity = new Activity(scope.newActivity);

            // console.log('create activity post creation', activity);

            activity.$save(function(response) {

              // console.log('create activity post save', response);

              // Authentication.user = response;

              console.timeEnd("toDoItem");

              $rootScope.loading = false;
              scope.completeAction();

              // load new actions
              // var idx = scope.$index;
              // console.log('key', scope.newActivity.key);
              var newActions = Actions.query(
                {key: scope.newActivity.key},
                function() {
                  // console.log('new actions', newActions);
                  newActions.forEach(function (action) {
                    var section = getSection(action.type);
                    section.push(action);
                    // scope.actions.splice(++idx, 0, action);
                  });
                }
              );

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
    return $resource('api/actions', {}, {
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

'use strict';

angular.module('actions').factory('Pdf', ['$http', '$q', 'Authentication', '$filter', '$translate',
  function Pdf($http, $q, Authentication, $filter, $translate) {

    var user = Authentication.user;

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
  			'phone': $filter('tel')(user.phone),
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

      	if(user.problems[i].key === 'landlordIssues') {
      		continue;
      	}

      	var problemPush = angular.copy(user.problems[i]);

      	problemPush.title = $translate.instant(problemPush.title, undefined, undefined, 'en_US');

      	problemPush.issues.map(function(curr, idx, arr) {
      		curr.key = $translate.instant(curr.key, undefined, undefined, 'en_US');
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

      var assembledObject = assemble(landlord.name, landlord.address);
      // Hmm, handle this differently? pass into assembled object, maybe?
      assembledObject.accessDates = accessDates;

      $http({
	  		method: 'POST',
	  		url:'//pdf-microservice.herokuapp.com/complaint-letter',
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

;'use strict';

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider', 'LightboxProvider',
	function($stateProvider, $urlRouterProvider, LightboxProvider) {

		LightboxProvider.templateUrl = 'modules/activity/partials/lightbox-template.html';

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider
			.state('listActivity', {
				url: '/your-case',
				templateUrl: 'modules/activity/views/list-activity.client.view.html',
				data: { protected: true },
				user: 'tenant'
			})
			.state('showPublic', {
				url: '/share/:key',
				templateUrl: 'modules/activity/views/list-activity-public.client.view.html',
				controller: 'ActivityPublicController',
				resolve: {
					user: ['Activity', '$stateParams', function(Activity, $stateParams) {
						return Activity.public({ key: $stateParams.key }).$promise;
					}]
				}
				// ,
				// data: { disableBack: true }
			})
			.state('print', {
				url: '/print/:key',
				templateUrl: 'modules/activity/views/print.client.view.html',
				data: {disableBack: true},
				globalStyles: 'clear-nav'
			});

	}
]);

'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityPublicController', ['$scope', '$stateParams', '$state', '$http', '$filter', 'Activity', 'Lightbox', 'user',
  function($scope, $stateParams, $state, $http, $filter, Activity, Lightbox, user) {

		$scope.shareID = $stateParams.key;
    if(!$scope.shareID) $state.go('home');

    $scope.photos = [];

    $scope.user = user;
    $scope.activities = $scope.user.activity;
    $scope.activities.forEach(function (act) {
      $scope.photos = $scope.photos.concat(act.photos);
    });

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
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


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', '$filter', 'deviceDetector', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, $filter, deviceDetector, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;
    $scope.location = $location.host();

    $scope.shareCollapsed = false;

    $scope.isDesktop = deviceDetector.isDesktop();

    $scope.photos = [];

    $scope.list = function() {
      // $scope.activities = Activity.query();
      $scope.activities = $scope.authentication.user.activity;

      $scope.activities.forEach(function (act) {
        $scope.photos = $scope.photos.concat(act.photos);
      });
    };

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    // $scope.compareDates = function(start, created) {
    //   var startDate = new Date(start).setHours(0,0,0,0);
    //   var createdDate = new Date(created).setHours(0,0,0,0);
    //   return startDate !== createdDate;
    // }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);

'use strict';


angular.module('activity').controller('PrintController', ['$scope', '$rootScope', '$filter', 'Activity', 'Authentication', '$state', '$stateParams',
  function($scope, $rootScope, $filter, Activity, Authentication, $state, $stateParams) {

  	$scope.printable = false;
    // $scope.user = Authentication.user;

  	// If we need to reload view (should be fired in parent)
  	$scope.reloadView = function() {
  		$scope.printable = false;
  		$state.reload();
  	};

    $scope.list = function() {
    	var photoOrder = 0;

    	// abstract our actual data transformation into this function
    	var dataTagAndOrder = function(data) {
      	data.reverse();

      	for(var i = 0; i < data.length; i++) {
      		if(data[i].photos.length) {
      			data[i].photosExist = true;
      			for (var j = 0; j < data[i].photos.length; j++) {
      				data[i].photos[j].order = photoOrder;
      				photoOrder++;
      			}
      		}
      	}
      	return data;
    	};

      // logged in user printing from their case history page
      if(Authentication.user && !$stateParams.key) {

        // console.log('user');

        $scope.user = Authentication.user;
        $scope.activities = dataTagAndOrder($scope.user.activity);

      // all other situations
      } else if($stateParams.key) {

        // console.log('key');

        // if we have a key, we'll need to query via the 'public' method on the Activity service (diff query params)
      	Activity.public({'key': $stateParams.key}, function(data) {
      		$scope.user = data;
      		$scope.activities = dataTagAndOrder(data.activity);
      	}, function(error) {
      		console.log(error);
      	});

      } else {
        // return $scope.stopPrint = true;
        $scope.stopPrint = true;
      }


    };

    $rootScope.headerLightBG = true;

    $scope.activityTemplate = function(key) {
      return $filter('activityTemplate')(key);
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    };

    $rootScope.$on('$viewContentLoaded', function() {
    	if(!$scope.stopPrint) {
    		$scope.printable = true;
    	}
    });

	}
]);

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

'use strict';

angular.module('activity').filter('activityTemplate', function() {
  return function(input) {

    var template = '/modules/activity/partials/';
    switch(input) {
      case 'sendLetter':
        template += 'complaint-letter.client.view.html';
        break;
      case 'checklist':
        template += 'checklist.client.view.html';
        break;
      default:
        template += 'default-activity.client.view.html';
        break;
    };
    return template;

  };
});

'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource', 'UpdateUserInterceptor',
  function($resource, UpdateUserInterceptor) {

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


    return $resource('api/activity', {}, {
      save: {
        method: 'POST',
        transformRequest: formDataTransform,
        headers: {
          'Content-Type': undefined
        },
        interceptor: UpdateUserInterceptor
      },
      saveManagedByID: {
        method: 'POST',
        url: 'api/advocates/tenants/:id',
        transformRequest: formDataTransform,
        headers: {
          'Content-Type': undefined
        }
      },
      public: {
        method: 'GET',
        url: 'api/activity/public'
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
			data: { protected: true },
			user: 'admin'
		});

	}
]);

'use strict';

angular.module('admin')
  .controller('AdminController', ['$scope', '$q', '$modal', 'Passwords',
    function($scope, $q, $modal, Passwords) {


      $scope.newTempPassword = {};

      $scope.createTempPassword = function() {
        var newPassword = new Passwords($scope.newTempPassword);
        newPassword.$create(function(success) {
          $scope.tempPasswordError = false;
          $scope.tempPasswordMessage = "Success!";
        }, function(error) {
          $scope.tempPasswordError = true;
          $scope.tempPasswordMessage = error.data.message;
        });
      };

}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('admin').factory('Passwords', ['$resource',
	function($resource) {
		return $resource('api/auth/temp-password', {}, {
			create: {
				method: 'POST'
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);

'use strict';

//Setting up route
angular.module('advocates').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
    // $urlRouterProvider.when('/advocate/signup', '/advocate/signup/create');

		// Advocate state routing
		$stateProvider
			.state('advocateSignup', {
				url: '/advocate/signup',
				templateUrl: 'modules/advocates/views/signup.client.view.html',
				controller: 'AdvocateSignupController',
				abstract: true,
				data: {
					disableBack: true
				}
			})
			.state('advocateSignup.info', {
				url: '',
				templateUrl: 'modules/advocates/partials/signup-info.client.view.html',
				globalStyles: 'white-bg'
			})
			.state('advocateSignup.details', {
				url: '/create',
				templateUrl: 'modules/advocates/partials/signup-details.client.view.html'
			})
			.state('advocateSignup.referral', {
				url: '/referral',
				templateUrl: 'modules/advocates/partials/signup-referral.client.view.html'
			})
			.state('newTenantSignup', {
				url: '/advocate/tenant/new',
				templateUrl: 'modules/advocates/views/new-tenant.client.view.html',
				controller: 'NewTenantSignupController',
				abstract: true,
				user: 'advocate',
				data: {
					disableBack: true
				}
			})
			.state('newTenantSignup.problems', {
				url: '/checklist',
				templateUrl: 'modules/advocates/partials/new-tenant-problems.client.view.html'
			})
			.state('newTenantSignup.details', {
				url: '/personal',
				templateUrl: 'modules/advocates/partials/new-tenant-details.client.view.html'
			})
			.state('advocateHome', {
				url: '/advocate',
				templateUrl: 'modules/advocates/views/home.client.view.html',
				controller: 'AdvocateController',
				globalStyles: 'fluid-container',
				user: 'advocate',
				data: {
					disableBack: true
				},
				resolve: {
					tenants: ['Advocates', function(Advocates) {
						// forces resolution, see: http://www.jvandemo.com/how-to-resolve-angularjs-resources-with-ui-router/
						return Advocates.query().$promise;
					}]
				}
			})
			.state('advocateHelp', {
				url: '/advocate/information',
				templateUrl: 'modules/advocates/views/help.client.view.html',
				controller: 'AdvocateHelpController',
				user: 'advocate'
			})
			.state('manageTenant', {
				url: '/advocate/manage/:id',
				templateUrl: 'modules/advocates/views/manage-tenant.client.view.html',
				controller: 'ManageTenantController',
				user: 'advocate',
				abstract: true,
				resolve: {
					tenant: ['Advocates', '$stateParams', function(Advocates, $stateParams) {
						return Advocates.getTenantByCurrentOrId($stateParams.id);
					}]
				}
			})
			.state('manageTenant.home', {
				url: '',
				templateUrl: 'modules/advocates/partials/manage-tenant-home.client.view.html',
				controller: 'ManageTenantHomeController'
			})
			.state('manageTenant.problems', {
				url: '/problems',
				templateUrl: 'modules/advocates/partials/manage-tenant-problems.client.view.html',
				controller: 'ManageTenantProblemsController'
			});
	}
]);

'use strict';

angular.module('advocates').controller('AdvocateHelpController', ['$rootScope', '$scope', '$state', '$location', '$timeout', '$filter', 'Authentication', 'Advocates', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $timeout, $filter, Authentication, Advocates, $http, $modal) {

		$scope.user = Authentication.user;

	}]);

'use strict';

angular.module('advocates').controller('AdvocateSignupController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newAdvocateUser = {};

		/**
			*
			*   DEBUG STUFF
			*
			*/

		if(typeof DEBUG !== 'undefined' && DEBUG == true) {

			$scope.newAdvocateUser = {
				firstName: "Jane",
				lastName: "Doe",
				password: "password",
				phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
				code: "janedoe",
				email: "jane@westsidetenants.org",
				contactPhone: "8459781262",
				// contactPhoneExt: "12",
				organization: "Westside Tenants"
			};

			$scope.pw2 = "password";
		}


		$scope.userError = false;

		$scope.toReferralStep = function (isValid) {
			if(isValid) {
				$state.go('advocateSignup.referral');
			} else {
				$scope.userError = true;
			}
		};

		$scope.createAdvocate = function (isValid) {

			if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account pre save', $scope.newAdvocateUser);

			if(isValid) {

				$scope.newAdvocateUser.firstName = $filter('titlecase')($scope.newAdvocateUser.firstName);
				$scope.newAdvocateUser.lastName = $filter('titlecase')($scope.newAdvocateUser.lastName);

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/api/advocates/signup', $scope.newAdvocateUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					$scope.authentication.user = response;
					if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account post save', response);

					$state.go('advocateHome');


				}).error(function(err) {
					$rootScope.loading = false;
					// console.log(err);
        	$scope.error = err;
				});

			} else {
				$scope.userError = true;
			}


		};


	}]);

'use strict';

angular.module('advocates').controller('AdvocateController', ['$rootScope', '$scope', '$state', '$location', '$timeout', '$filter', 'Authentication', 'Advocates', '$http', '$modal', 'tenants',
	function($rootScope, $scope, $state, $location, $timeout, $filter, Authentication, Advocates, $http, $modal, tenants) {

		$scope.user = Authentication.user;
		$scope.tenants = tenants;
		$scope.bbls = {};

		$scope.currentLocation = $location.protocol() + '://' + $location.host() + (($location.port() !== 80 && $location.port() !== 443) ? ':' + $location.port() : '');

		// used for the bblsToAddress filter
		angular.forEach(tenants, function(tenant) {
			// get a title case version of the streetname from geoclient
			var streetName = tenant.geo.streetName
				.split(' ')
				.map(function(i) {
					return i.length ? i[0].toUpperCase() + i.substr(1).toLowerCase() : i;
				})
				.join(' ');
			$scope.bbls[tenant.geo.bbl] = tenant.geo.streetNum + ' ' + streetName;
		});

		$scope.view = 'individual';
		$scope.changeView = function(newView) {
			$scope.view = newView;
		};

		$scope.copyTooltipText = "Click to copy";

		$scope.copied = function() {
			$scope.copyTooltipText = "Link copied!";
		};

		$scope.mouseleave = function() {
			$timeout(function () {
				$scope.copyTooltipText = "Click to copy";
			}, 300);
		};

		$scope.viewTenant = function(tenant) {
			// Advocates.setCurrent(tenant);
			Advocates.setCurrentTenant(tenant);
			$state.go('manageTenant.home', { id: tenant._id});
		};

		$scope.openReferralModal = function() {

			var modalInstance = $modal.open({
				//animation: false,
				templateUrl: 'modules/advocates/partials/sms-referral.html',
				controller: 'SMSReferralController',
				backdrop: 'static',
				resolve: {
					// newActivity: function () { return scope.newActivity; }
				}
			});
		};

	}]);

'use strict';

angular.module('advocates').controller('ManageTenantController', [
					'$scope', '$stateParams', 'deviceDetector', 'Authentication', 'Advocates', 'tenant',
	function($scope, $stateParams, deviceDetector, Authentication, Advocates, tenant) {

		$scope.user = Authentication.user;
		$scope.device = deviceDetector;
		$scope.tenant = tenant;

		// 
		// $scope.$watch('tenant', function (tenant) {
		// 	console.log('change in root', tenant);
		// }, true);

	}])
	.controller('ManageTenantHomeController', ['$scope', '$stateParams', '$filter', 'deviceDetector', 'Advocates', 'Lightbox',
		function($scope, $stateParams, $filter, deviceDetector, Advocates, Lightbox) {



			$scope.$watch('tenant', function (tenant) {
				// console.log('change in home', tenant);
				$scope.photos = [];
				$scope.tenant.activity.forEach(function (act) {
					$scope.photos = $scope.photos.concat(act.photos);
				});
			}, true);

			$scope.isDesktop = deviceDetector.isDesktop();

			$scope.activityTemplate = function(key) {
				return $filter('activityTemplate')(key);
			};

			$scope.compareDates = function(start, created) {
				var startDate = new Date(start).setHours(0,0,0,0);
				var createdDate = new Date(created).setHours(0,0,0,0);
				return startDate !== createdDate;
			};

			$scope.openLightboxModal = function (photos, index) {
				Lightbox.openModal(photos, index);
			};


		}])
		.controller('ManageTenantProblemsController', ['$rootScope', '$scope', '$state', '$stateParams', 'Advocates', 'ProblemsResource',
			function($rootScope, $scope, $state, $stateParams, Advocates, ProblemsResource) {

				$scope.problemsAlert = false;

				$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

					// make sure this only happens once (no infinite loops)
					// AND only happens if they've actually changed anything...
					if($scope.hasChangedProblems && !toState.updated) {

					  event.preventDefault();
						toState.updated = true;
					  $rootScope.loading = true;
						$scope.problemsAlert = false;

						var tenant = new ProblemsResource($scope.tenant);
						tenant.$updateManagedChecklist({ id: $scope.tenant._id },
							function(response) {
								console.log('after', response);

								// need to use angular.extend rather than scope.tenant = response
								// this will actually update all the attributes
								// (and trigger an update in parent controllers)
								angular.extend($scope.tenant, response);

								$rootScope.dashboardSuccess = true;
								$rootScope.loading = false;
								$state.go(toState);
							}, function(err) {
								$rootScope.loading = false;
								$scope.problemsAlert = true;

							});

					// this gets called a second time with $state.go,
					// so we're just going to pass things along
					} else if(toState.updated) {
					  toState.updated = false;
					}

				});


				$scope.saveProblems = function () {

					console.log('before', $scope.tenant);

					$rootScope.loading = true;
					$scope.problemsAlert = false;

					var tenant = new ProblemsResource($scope.tenant);
					tenant.$updateManagedChecklist({ id: $scope.tenant._id },
						function(response) {
							console.log('after', response);

							// need to use angular.extend rather than scope.tenant = response
							// this will actually update all the attributes
							// (and trigger an update in parent controllers)
							angular.extend($scope.tenant, response);

							$rootScope.loading = false;
							$state.go('manageTenant.home');
						}, function(err) {
							$rootScope.loading = false;
							$scope.problemsAlert = true;

						});

				};


			}]);

'use strict';

angular.module('advocates').controller('NewTenantSignupController', ['$rootScope', '$scope', '$state', '$location', '$filter', 'Authentication', 'Advocates', '$http', '$modal',
	function($rootScope, $scope, $state, $location, $filter, Authentication, Advocates, $http, $modal) {

		$scope.authentication = Authentication;
		$scope.newTenantUser = {};
		// create newTenantUser.problems only once (handles next/prev)
		$scope.newTenantUser.problems = [];
		$scope.newTenantUser.sharing = {
			enabled: true
		};

		/**
			*
			*   DEBUG STUFF
			*
			*/

		if(typeof DEBUG !== 'undefined' && DEBUG == true) {

			$scope.newTenantUser = {
				firstName: 'Pete',
				lastName: 'Best',
				borough: 'Brooklyn',
				address: '654 Park Place',
				unit: '1RF',
				phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
				problems: [],
				sharing: {
					enabled: true
				}
			};
		}


		$scope.userError = false;


		// This only validates things client side!
		// Maybe create a separate API call for user validation?
		$scope.validateNewTenant = function (isValid) {

			if(isValid) {
				$scope.userError = false;
				$state.go('newTenantSignup.problems');
			} else {
				$scope.userError = true;
			}
		};


		$scope.createNewTenant = function (isValid) {

			if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account pre save', $scope.newTenantUser);

			if(isValid) {

				$scope.newTenantUser.firstName = $filter('titlecase')($scope.newTenantUser.firstName);
				$scope.newTenantUser.lastName = $filter('titlecase')($scope.newTenantUser.lastName);

				$scope.userError = false;
				$rootScope.loading = true;

				$http.post('/api/advocates/tenants/create', $scope.newTenantUser).success(function(response) {

					// If successful we assign the response to the global user model
					$rootScope.loading = false;
					// $scope.authentication.user = response;
					if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account post save', response);

					// $state.go('advocateHome');
					console.log(response);

					// $state.go('advocateHome');
					Advocates.setCurrentTenant(response);
					$state.go('manageTenant.problems', { id: response._id});


				}).error(function(err) {
					$rootScope.loading = false;
					// console.log(err);
        	$scope.error = err;
				});

			} else {
				$scope.userError = true;
			}
		};


	}]);

'use strict';

angular.module('actions').controller('SMSReferralController', ['$rootScope', '$scope', '$sce', '$timeout', '$modalInstance', 'Authentication', 'Advocates', '$window', '$httpParamSerializer',
	function ($rootScope, $scope, $sce, $timeout, $modalInstance, Authentication, Advocates, $window, $httpParamSerializer) {

		$scope.sms = {
			phone: '',
			userMessage: '',
      message: '',
      includeCode: true,
			spanish: false
		};

    $scope.status = {
			loading: false,
			sent: false,
			error: false
		};

    $scope.messageMaxLength = 160;

    var TEXT_MAX_LENGTH = 160;
    var SIGNUP_LINK = 'https://www.justfix.nyc/signup';
    // var originalLink = signupLink;
    var signupPrompt;

		// this is the actual text
    var updateMessage = function() {

			var qsObject = {};
			if($scope.sms.includeCode) qsObject.q = Authentication.user.code;
			if($scope.sms.spanish) qsObject.lang = 'es';

			var qs = $httpParamSerializer(qsObject);

			var signupLink = qs ? SIGNUP_LINK + '?' + qs : SIGNUP_LINK;

			if($scope.sms.spanish) {
				signupPrompt = ' Regístrate en: ' + signupLink;
			} else {
				signupPrompt = ' Sign up at: ' + signupLink;
			}

      $scope.sms.message = $scope.sms.userMessage + signupPrompt;
      $scope.length = $scope.sms.message.length;

      // represents the max amount of characters the user can enter
      $scope.messageMaxLength = TEXT_MAX_LENGTH - signupPrompt.length;
    };

		// this is the preformed user message
		var updateUserMessage = function() {

			if($scope.sms.includeCode && $scope.sms.spanish) {
				$scope.sms.userMessage = 'Comience a usar JustFix.nyc para enviar fotos e información a ' + Authentication.user.firstName + ' en ' + Authentication.user.organization + ".";
			} else if($scope.sms.includeCode && !$scope.sms.spanish) {
				$scope.sms.userMessage = "Start using JustFix.nyc to send info to " + Authentication.user.firstName + " at " + Authentication.user.organization + "!";
			} else if(!$scope.sms.includeCode && $scope.sms.spanish) {
				$scope.sms.userMessage = "Comience a usar JustFix.nyc para documentar sus problemas de vivienda!";
			} else {
				$scope.sms.userMessage = "Start using JustFix.nyc to document your issues!";
			}

		};


    $scope.$watch('sms.includeCode', function(newVal, oldVal) {
			updateUserMessage();
      updateMessage();
    });
		$scope.$watch('sms.spanish', function(newVal, oldVal) {
			updateUserMessage();
			updateMessage();
		});
		$scope.$watch('sms.userMessage', function(newVal, oldVal) {
			updateMessage();
		});

		$scope.setLangSpanish = function(yn) {
			$scope.sms.spanish = yn;
		};

		var timerCountdown = 30;
		var setCreationTimer = function() {
			$timeout(function () {
				if(!$scope.status.sent) {
					$scope.status.loading = false;
					$scope.status.error = true;
					Rollbar.warning("Request for the sms took too long to respond");
	  			$scope.errorCode = 'Request for the sms took too long to respond';
				}
			}, timerCountdown * 1000);
		};


    $scope.sendSMS = function() {

      if($scope.sms.userMessage.length > $scope.messageMaxLength) {
        $scope.lengthError = true;
      } else {
        $scope.lengthError = false;
      }

      if(!$scope.sms.phone.length) {
        $scope.phoneError = true;
      } else {
        $scope.phoneError = false;
      }

			if($scope.lengthError || $scope.phoneError) {
				// display the error messages
				// necessary to trigger a change in height
				$timeout(function () {
					$scope.elemHasChanged = true;
				});
			} else {

				$scope.status.loading = true;

				Advocates.sendReferralSMS({}, { phone: $scope.sms.phone, message: $scope.sms.message},
					function (success) {
						setCreationTimer();
						$scope.status.loading = false;
						$scope.status.sent = true;
					},
					function (error) {
						$scope.status.loading = false;
						$scope.status.error = true;
						Rollbar.error("Error with SMS referral service");
		  			$scope.errorCode = error.data.message;
					}
				);
			}

    };

	  $scope.cancel = function() {
	    $modalInstance.dismiss('cancel');
	  };

		$scope.done = function() {
			$modalInstance.close({});
		};
	}]);

'use strict';

angular.module('advocates')
  .directive('addDetails', ['$rootScope', '$filter', '$sce', '$timeout', 'Activity', 'Advocates', 'Problems',
    function ($rootScope, $filter, $sce, $timeout, Activity, Advocates, Problems) {
    return {
      restrict: 'E',
      templateUrl: 'modules/advocates/partials/add-details.client.view.html',
      scope: {
        tenant: '='
      },
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280
        // scope.action is a $resource!
        scope.problems = [];

        scope.$watch('tenant', function (tenant) {
          // console.log('add details');
          if(tenant) {
            scope.tenant = tenant;
            for(var i = 0; i < scope.tenant.problems.length; i++) {
              scope.problems.push(scope.tenant.problems[i].title);
            }
            // Advocates.currentTenant = scope.tenant;
          }
        });

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
          title: 'modules.activity.other.statusUpdate',
          key: 'statusUpdate',
          relatedProblems: [],
          photos: []
        };

        scope.expand = function(event) {
          event.preventDefault();
          scope.status.expanded = true;
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);
          // setTimeout(function() { element[0].querySelector('textarea').focus(); }, 0);

        };

        scope.toggleTagging = function() {
          scope.status.tagging = !scope.status.tagging;
        };

        scope.selectProblem = function(problem) {

          if(!this.isSelectedProblem(problem)) {
            scope.newActivity.relatedProblems.push(problem);
          } else {
            var i = scope.newActivity.relatedProblems.indexOf(problem);
            scope.newActivity.relatedProblems.splice(i, 1);
            // $scope.checklist[area].numChecked--;
          }
        };
        scope.isSelectedProblem = function(problem) {
          // if(!$scope.newIssue.issues[area]) return false;
          return scope.newActivity.relatedProblems.indexOf(problem) !== -1;
        };

        scope.addPhoto = function(file) {

          if(file) {
            scope.newActivity.photos.push(file);
            // console.log(file);
            // console.log(file.lastModifiedDate);
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

            console.time("statusUpdate");

            // console.log('create activity pre creation', scope.newActivity);

            // [TODO] have an actual section for the 'area' field in the activity log
            // if(scope.newActivity.description && scope.newActivity.area) scope.newActivity.description = scope.newActivity.area + ' - ' + scope.newActivity.description;
            // else if(scope.newActivity.area) scope.newActivity.description = scope.newActivity.area;

            var activity = new Activity(scope.newActivity);

            // console.log('create activity post creation', scope.newActivity);

            activity.$saveManagedByID({ id: scope.tenant._id }, function(response) {

              // console.log('create activity post save', response);
              console.timeEnd("statusUpdate");

              $rootScope.loading = false;
              scope.status.completed = true;
              scope.status.formSubmitted = false;
              scope.status.expanded = false;

              scope.newActivity = {
                date: '',
                title: 'modules.activity.other.statusUpdate',
                key: 'statusUpdate',
                relatedProblems: [],
                photos: []
              };

              // need to use angular.extend rather than scope.tenant = response
              // this will actually update all the attributes
              // (and trigger an update in parent controllers)
              angular.extend(scope.tenant, response);

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

angular.module('advocates').filter('toAddress', function() {
  return function(input, bbls) {
    return bbls[input];
  };
});

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('advocates')
	.factory('AdvocatesResource', ['$resource', function($resource) {
			return $resource('api/advocates', {}, {
				// update: {
				// 	method: 'PUT'
				// },
				// getTenants: {
				// 	method: 'GET',
				// 	url: '/api/advocates/tenants'
				// },
				validateNewUser: {
					method: 'GET',
					url: '/api/advocates/validate/new'
				},
				sendReferralSMS: {
					method: 'POST',
					url: '/api/advocates/referrals/sms'
				}
	      // ,
	      // getIssues: {
	      //   method: 'GET'
	      // }
			});
		}
	])
	.factory('Advocates', ['AdvocatesResource', '$q', function(AdvocatesResource, $q) {

		var _this = this;

		// _this.query = function() {
		//
		// 	var queried = $q.defer();
		//
		// 	AdvocatesResource.query(function (tenants) {
		// 		_this._tenants = tenants;
		// 		queried.resolve(tenants);
		// 	});
		//
		// 	return queried.promise;
		// };

		return {
			query: AdvocatesResource.query,
			validateNewUser: AdvocatesResource.validateNewUser,
			sendReferralSMS: AdvocatesResource.sendReferralSMS,
			setCurrentTenant: function(tenant) {
				_this._currentTenant = tenant;
			},
			getTenantByCurrentOrId: function(id) {

				var filtered = $q.defer();

				var filterTenant = function () {
					var tenant = _this._tenants.filter(function (t) {
						return t._id === id;
					});
					filtered.resolve(tenant[0]);
				};

				if(_this._currentTenant) {
					// console.log('current');
					filtered.resolve(_this._currentTenant);
				} else {
					// console.log('query');
					AdvocatesResource.query(function (tenants) {
						// console.log(tenants);
						filtered.resolve(tenants.filter(function (t) { return t._id === id; })[0]);
					});
				}

				// if(_this._currentTenant) {
				// 	console.log('current');
				// 	filtered.resolve(_this._currentTenant);
				// } else if(!_this._tenants) {
				// 	console.log('query');
				// 	_this.query().then(function () {
				// 		filterTenant();
				// 	});
				// } else {
				// 	console.log('filter');
				// 	filterTenant();
				// }

				return filtered.promise;
			}
		};

		//
		// this.
	}]);

'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$location', '$window', '$timeout', 'Authentication',
  function($rootScope, $state, $location, $window, $timeout, Authentication) {

    // preserve query string across location redirects
    $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {

      if(!$rootScope.clearQueryString) {
        if (oldUrl.indexOf('?') >= 0) {
          var queryString =  oldUrl.split('?')[1];
          newUrl = $location.$$path + '?' + queryString;
          $location.url(newUrl);
        }
      } else {
        $rootScope.clearQueryString = false;
      }

    });

    // Used mainly if a Promise on resolve gets rejected...
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      Rollbar.error(error);
      $state.go('landing');
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      // prevent different roles from going different places
      if(toState.user) {
				if(!Authentication.user) {
					// event.preventDefault();
          $location.path('/signin');
				} else if(Authentication.user.roles.indexOf(toState.user) === -1) {
					// event.preventDefault();
          $location.path('/not-found');
				}
			}

      // protected areas -- TODO: should be deprecated
      if(!Authentication.user && toState.data && toState.data.protected) {
        // event.preventDefault();
        // $state.go('signin');
        $location.path('/signin');
      }

      // expand and focus status update area
      // if($location.search().status && $location.search().status === '1') {
      if($location.search().status) {
        $rootScope.expandStatus = true;
      }

      // SMS referral
      // if($location.search().q && !$rootScope.qRedirected) {
      //   $rootScope.qRedirected = true;
      //   $location.path('/onboarding/referral');
      // }

    });

    // set global styles
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);

      if(toState.globalStyles) {
        $rootScope.globalStyles = toState.globalStyles;
      } else {
        $rootScope.globalStyles = '';
      }

      if(Authentication.user && Authentication.user.roles.indexOf('advocate') !== -1) {
        $rootScope.globalStyles += ' advocate-view';
      }

    });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$provide',
	function($stateProvider, $urlRouterProvider, $provide) {

		// $provide.decorator('accordionGroupDirective', function($delegate) {
	  //   $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion-group.html';
	  //   return $delegate;
	  // });
		// $provide.decorator('accordionDirective', function($delegate) {
	  //   $delegate[0].templateUrl = 'bootstrap-templates/accordion/accordion.html';
	  //   return $delegate;
	  // });


		// Redirect to home view when route not found
		// $urlRouterProvider.otherwise('/');
		$urlRouterProvider.otherwise('/not-found');


		// Redirect rules for when the user comes to the root domain for the app
		$urlRouterProvider.rule(function ($injector, $location) {

			var user = $injector.get('Authentication').user;

			if($location.path() === '/') {
				if(!user) {
					return '/signup';
				} else {
				  switch(user.roles[0]) {
	          case 'admin':
							return '/admin';
	          case 'advocate':
	            return '/advocate';
	          case 'tenant':
							return '/home';
	          default:
							return '/home';
	        }
				}
			}
		});

		// Home state routing
		$stateProvider
		.state('landing', {
			url: '/',
			data: {
				disableBack: true
			},
			globalStyles: 'landing white-bg'
		})
		.state('not-found', {
			url: '/not-found',
			templateUrl: 'modules/core/views/404.client.view.html',
			data: {
				disableBack: true
			}
		})
		.state('oldLanding', {
			url: '/espanol',
			templateUrl: 'modules/core/views/landing.client.view.html',
			onEnter: function(LocaleService, $state) {
				LocaleService.setLocaleByName('es_mx');
			},
			data: {
				disableBack: true
			},
			globalStyles: 'landing white-bg'
		})
		// .state('manifesto', {
		// 	url: '/manifesto',
		// 	templateUrl: 'modules/core/views/manifesto.client.view.html',
		// 	data: {
		// 		disableBack: true
		// 	}
		// })
		// .state('espanol', {
		// 	url: '/espanol',
		// 	onEnter: function(LocaleService, $state) {
		// 		LocaleService.setLocaleByName('es_mx');
		// 		$state.go('landing');
		// 	}
		// })
		.state('donate', {
			url: '/donate',
			onEnter: function($window) {
		 		$window.open('https://www.justfix.nyc/donate', '_self');
 			}
		})
		.state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html',
			data: {
				protected: true,
				disableBack: true
			},
			user: 'tenant'
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'modules/core/views/contact.client.view.html',
			data: {
			},
			globalStyles: 'white-bg'
		})
	}
]);

'use strict';


angular.module('core').controller('ContactController', ['$rootScope', '$scope', 'Authentication', 'deviceDetector',
	function($rootScope, $scope, Authentication, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;

	}
]);

'use strict';

angular.module('core').controller('FooterController', ['$scope', '$window', 'Authentication',
  function($scope, $window, Authentication) {

    $scope.authentication = Authentication;

    var links = {
      actions : {
        link: 'listActions',
        title: 'repeating.listActions',
        icon: '/modules/core/img/sections/action.svg'
      },
      activity : {
        link: 'listActivity',
        title: 'repeating.caseHistory',
        icon: '/modules/core/img/sections/history.svg'
      },
      issues : {
        link: 'updateProblems',
        title: 'repeating.issueChecklist',
        icon: '/modules/core/img/sections/issues.svg'
      },
      profile : {
        link: 'settings.profile',
        title: 'repeating.profile',
        icon: '/modules/core/img/sections/profile.svg'
      },
      help : {
        link: 'findHelp',
        title: 'repeating.findHelp',
        icon: '/modules/core/img/sections/help.svg'
      },
      kyr : {
        link: 'kyr',
        title: 'repeating.kyr',
        icon: '/modules/core/img/sections/kyr.svg'
      }
    };

    $scope.footerLinks = [];


    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      switch(toState.name) {
        case 'kyr':
          $scope.footerLinks = [ links.actions, links.help ];
          break;
        case 'kyrDetail':
        	$scope.footerLinks = [ links.actions, links.help ];
        	break;
        case 'findHelp': case 'listActions':
          $scope.footerLinks = [ links.activity, links.kyr ];
          break;
        case 'listActivity':
          $scope.footerLinks = [ links.issues, links.help ];
          break;
        case 'updateProblems':
          $scope.footerLinks = [ links.actions, links.activity ];
          break;
        default:
          $scope.footerLinks = [];
          break;
      };

    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$state', '$scope', '$window', 'Authentication',
  function($rootScope, $state, $scope, $window, Authentication) {

      $scope.authentication = Authentication;
      $scope.window = $window;

      // Collapsing the menu after navigation
      $rootScope.$on('$stateChangeSucess', function(event, toState, toParams, fromState, fromParams) {

        // moved to application.js to ensure it runs on pageload...
        // setHeaderState(toState.name);

        if(Authentication.user) {
          $rootScope.showBack = true;
          if(toState.data && toState.data.disableBack) {
            $rootScope.showBack = false;
          }
        } else {
          $rootScope.showBack = false;
        }

      });

      // console.log('state current name is:', $state.current.name);
      //
      // var setHeaderState = function(name) {
      //   switch(name) {
      //     case 'landing':
      //       console.log('case landing');
      //       $rootScope.headerLeft = true;
      //       $rootScope.headerLightBG = false;
      //       break;
      //     case 'manifesto':
      //       console.log('case manifesto');
      //       $rootScope.headerLeft = true;
      //       $rootScope.headerLightBG = true;
      //       break;
      //     default:
      //       console.log('case duh');
      //       $rootScope.headerLeft = false;
      //       $rootScope.headerLightBG = false;
      //       break;
      //   };
      // };

  }
]);

'use strict';


angular.module('core').controller('HomeController', ['$rootScope', '$scope', '$timeout', 'Authentication', 'Users', 'deviceDetector',
	function($rootScope, $scope, $timeout, Authentication, Users, deviceDetector) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.device = deviceDetector;

		// After a client finishes scheduling we force an update to the user object
		// See line 11, public/modules/onboarding/config/onboarding.client.config.js
		$scope.$watch("authentication.user", function () {
			if($scope.authentication.user.currentAcuityEventId) {
				$scope.appt = Users.getScheduledEventInfo();
			}
		});

		$rootScope.closeDashboardAlert = false;

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

angular.module('core').directive('bottomOnClick', ['$document', '$timeout', function($document, $timeout) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var parent = $attrs.bottomOnClick;
        var parentElm = document.getElementById(parent);

        $element.bind('click', function(e) {
          $timeout(function() {
            parentElm.scrollTop = parentElm.scrollHeight;
          }, 0);
        });
    }
  };
}]);

'use strict';

angular.module('core')
  .directive('emailMessage', ['deviceDetector', 'Authentication', 'Messages',
  function (deviceDetector, Authentication, Messages) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var msg = Messages.getShareMessage("share");

        var href = 'mailto:';

        if(attrs.email && attrs.email.length) {
          href += attrs.email;
        }

        href = encodeURI(href + '?subject=' + Authentication.user.fullName + ' - JustFix.nyc Case History&body=' + msg);
        attrs.$set('href', href);

      }
    };

  }]);

'use strict';

angular.module('core').directive('filesModel', function() {
  return {
    controller: function($parse, $element, $attrs, $scope){
      var exp = $parse($attrs.filesModel);

      $element.on('change', function(){
        exp.assign($scope, this.files);
        $scope.$apply();
      });
    }
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

angular.module('core').directive('fullBg', function($window) {
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
});
'use strict';

angular.module('core')
  .directive('gaEvent', ['deviceDetector', '$window',
  function (deviceDetector, $window) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

        var a = attrs.gaEvent.split(',');
        var cat = a[0];
        var action = a[1];

        if(a.length == 3) var label = a[2];
        else var label = "";

        element.on('click', function (event) {
          $window.ga('send', 'event', cat, action, label);
        });


      }
    };

  }]);

'use strict';

angular.module('core').directive('goToTop', function($document) {
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
});

'use strict';

angular.module('core').directive('imageOrient', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      // scope: {
      //   dir: "@"
      // },
      link: function (scope, element, attr) {


        attr.$observe('imageOrient', function(value) {
          if(value) {

            var width = element[0].naturalWidth || element[0].width;
            var height = element[0].naturalHeight || element[0].height;

            console.log(width, height);

            console.log(element[0]);


            value = parseInt(value, 10);

            value = 6;

            exifOrient(element[0], value, function (err, canvas) {
              if(err) {
                console.error(err);
              } else {
                console.log(canvas);
                element[0].src = canvas.toDataURL();
              }



            });
          }
          // var orient = scope.dir;

        });



      }
    };
  }]);

'use strict';

angular.module('core').directive('inheritHeight', ['$window', '$timeout', 'deviceDetector', function($window, $timeout, deviceDetector) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {

        scope.$watch("status.state", function(newV, oldV) {
          $timeout(function () {
            elm.css('height', elm[0].querySelector('.letter-step.ng-enter').offsetHeight + 'px');
          });
        });

      }
    };
}]);

'use strict';

angular.module('core').directive('inputFocusFn', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        scope.$parent[attr.inputFocusFn] = function () {
          $timeout(function () {
            element[0].focus();
          });
        };
      }
    };
  }]);

'use strict';

angular.module('core').directive('jumpTo', ['$document', function($document) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

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
    }
  };
}]);
'use strict';

angular.module('core').directive('languageSelect', function (LocaleService, $window, $location) { 'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'modules/core/partials/language-select.client.view.html',
    controller: function ($scope) {
      $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
      $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
      $scope.visible = $scope.localesDisplayNames &&
      $scope.localesDisplayNames.length > 1;

      $scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
        // FYI: locale changes happens in LocaleService at /services/locale.client.service.js
      };
    }
  };
});
'use strict';

angular.module('core').directive('languageToggle', function (LocaleService, $window, $location) { 'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'modules/core/partials/language-toggle.client.view.html',
    controller: function ($scope) {


      var getLocaleName = function() {
        $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();

        if($scope.currentLocaleDisplayName == "Español") {
          $scope.newLocaleName = "English";
        } else {
          $scope.newLocaleName = "Español";
        }

        // $scope.$apply();
      }
      getLocaleName();

      $scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
        getLocaleName();
        // FYI: locale changes happens in LocaleService at /services/locale.client.service.js
      };
    }
  };
});

'use strict';

angular.module('core').directive('loading', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'modules/core/partials/loading.client.view.html',
        link: function (scope, elm, attrs) {

        }
    };
});

'use strict';

angular.module('core')
  .directive('mobileDatePlaceholder', ['deviceDetector', function (deviceDetector) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, elm, attrs) {

        if(deviceDetector.isMobile() || deviceDetector.isTablet()) {
          elm.addClass('date-mobile');
        }

        scope.$watch(attrs.ngModel, function (v) {
          if(v) {
            elm.removeClass('date-mobile');
          }
        });



      }
    };

  }]);

'use strict';

angular.module('core').directive('phoneInput', function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {

      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('tel')(value, false));
        
        // Not sure if this is the best solution...
        if(value.length < 10 || value.search(/[^a-z]/g)) {
        	ngModelCtrl.$setValidity('', false); 
        } else {
        	ngModelCtrl.$setValidity('', true); 
        }
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
});
'use strict';

angular.module('core')
  .directive('printButton', ['deviceDetector', '$window', '$timeout', '$rootScope',
  function (deviceDetector, $window, $timeout, $rootScope) {
    return {
      restrict: 'A',
      scope: {
        userId: '='
      },
      link: function (scope, element, attrs) {
      	var printPg;

      	// Set up our button state as soon as we init
        if(!deviceDetector.isDesktop()) {
          element.css("display", "none");
        } else {
          element.addClass("print-button");
          element.addClass('disabled');
        }

        // Helper function for checking if printPg is loaded
        var checkLoaded = function(){
	        // need to access scope INSIDE the iframe, so we can trust angular to tell us when we're fully loaded instead of parent JS
        	var printView = printPg.contentWindow.angular.element(printPg.contentWindow.document.querySelector('#print-view'));

        	// Smol bug: sometimes, printView returns an empty instance, so we need to check to make sure angular is inited correctly
        	if(!printView.scope()) {
        		return $timeout(function(){
        			// Recusive functions FTW
	        		checkLoaded();
        		}, 500);
        	}
        	var printableLoaded = printView.scope().printable;

        	// Check if the content is actually loaded (dependent on child controller, in /activity/controllers/print.controller)
        	if(!printableLoaded) {
        		return $timeout(function(){
	        		checkLoaded();
        		}, 500);
        	} else {

        		// If we are loaded, let this button be free!
	        	element.removeClass('disabled');

		        element.on('click', function (event) {
					    window.frames['print-frame'].print();
		        });

        	}
        };

        var iframe = document.getElementById('print-frame');
        var queryKey = '';
        if(scope.userId) {
        	queryKey = scope.userId;
        }

        if (iframe) {
        	// If we're returning here, reload iFrame and begin checking when loaded
        	printPg = iframe;
        	printPg.src = '/print/' + queryKey;
        	printPg.contentWindow.location.reload(); // just reload w/ new SRC
        } else {
        	// init new print instance
	        printPg = document.createElement('iframe');
	        printPg.src = '/print/' + queryKey;
	        printPg.width = 700;
	        printPg.height = 0;
	        printPg.setAttribute('id', 'print-frame');
	        printPg.name = 'print-frame';
	        document.body.appendChild(printPg);
        }

        // Listen for when iFrame is loaded if the first time (safety measure so we KNOW the following will init printView var correctly)
        printPg.onload = function() {
	        checkLoaded();
        };


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


        var getIOSversion = function() {
          // if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
          // } else {
            // this shouldn't happen
            // Rollbar.error("Didn't detect iOS correctly?");
          // }
        }

        var isGtIOS7 = function() {
          if (deviceDetector.os === 'ios' && getIOSversion()[0] > 7) {
            return true;
          } else {
            return false;
          }
        };


        // ios <=7  ;
        // ios >7   &
        // android  ?


        element.on('click', function (e) {

          var href = 'sms:';
          var type = attrs.type;
          var msg = Messages.getShareMessage(type);

          if(attrs.phone && attrs.phone.length) {
            href += attrs.phone;
          }

          if(deviceDetector.os === 'ios') {
            if(isGtIOS7()) href += '&';
            else href += ';';
            href = href + 'body=' + msg;
            console.log('href', href);
            attrs.$set('href', href);
          } else if(deviceDetector.os === 'android') {
            href = href + '?body=' + msg;
            attrs.$set('href', href);
          } else {
            href = href + '?body=' + msg;
            console.log(href);
            console.log('If you were using a phone, the message would be: \n\n' + msg);
          }
        });

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

angular.module('core').directive('twitterFollow', ['$timeout', function($timeout) {
  return {
    link: function (scope, element, attr) {
      $timeout(function() {
            twttr.widgets.createFollowButton (
                'JustFixNYC',
                element[0],
                {
                  showScreenName: false,
                  showCount: false
                }
            );
      });
    }
  };
}]);

'use strict';

angular.module('core').directive('variableHeight', ['$document', '$timeout', function($document, $timeout) {
  return {
    controller: function($parse, $element, $attrs, $scope) {

        var parent = $attrs.variableHeight;
        var parentElm = document.getElementById(parent);

        $scope.$watch(function() {
          angular.element(parentElm).css('height', $element[0].offsetHeight + 'px');
        });

        $scope.$parent.$watch("elemHasChanged", function (newVal, oldVal) {
          if(newVal) {
            angular.element(parentElm).css('height', $element[0].offsetHeight + 'px');
          }
        });


        // $scope.$watch(function () {
        //     return $element[0].offsetHeight;
        //   }, function (newVal, oldVal) {
        //     console.log(newVal, oldVal);
        //   });
    }
  };
}]);

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

angular.module('core').filter('firstname', function() {
    return function (input) {
    	if(input) {
	      return input.split(' ')[0];    		
    	}
    	else {
    		return input;
    	}
    }
});

'use strict';

angular.module('core').filter('tel', function () {
  return function (tel) {

    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');

    // handle extensions
    if(value.charAt(10) === ',') {
      var ext = value.split(',')[1];
      value = value.split(',')[0];
    }

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

      var phone = '(' + city + ') ' + number;

      if(ext) return (phone  + ' ext. ' + ext).trim();
      else return (phone).trim();

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

angular.module('core').filter('trustAs', ['$sce',
    function($sce) {
        return function (input, type) {
            if (typeof input === "string") {
                return $sce.trustAs(type || 'html', input);
            }
            // console.log("trustAs filter. Error. input isn't a string");
            return "";
        };
    }
]);

'use strict';

angular.module('core').filter('trustTranslate', ['$sce', '$filter', 'Authentication',
	function($sce, $filter, Authentication) {
		
		var user = Authentication.user;

		var translatedText = $filter('translate');
	  return function (val) {
    	var returnedTranslation = translatedText(val);

    	if(returnedTranslation.indexOf('user.borough') > -1) {
      	returnedTranslation = returnedTranslation.replace('user.borough', user.borough);
      }

    	return $sce.trustAsHtml(returnedTranslation);
    }
}]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('LocaleService', function ($translate, LOCALES, $rootScope, tmhDynamicLocale, $location) {

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
    // document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html
    // $location.search('lang', $translate.use());
  
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
    setLocaleByName: function(localeName) {
    	setLocale(localeName);
    },
    checkIfLocaleIsValid: function(locale) {
    	return checkLocaleIsValid(locale);
    },
    getLocalesDisplayNames: function () {
      return _LOCALES_DISPLAY_NAMES;
    }
  };
});
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
				data: { protected: true },
				user: 'tenant'
			});

	}
]);

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

        var cartoMapOptions = {
          https: true
        };

        cartodb.createLayer(map, layerSource, cartoMapOptions)
          .addTo(map)
          .done(function(layer) {
            mainSublayer = layer.getSubLayer(0);
            scope.init();
            // do stuff
            //console.log("Layer has " + layer.getSubLayerCount() + " layer(s).");
          })
          .error(function(err) {
            // report error
            Rollbar.error("Carto Map Error", err);
            console.log("An error occurred: " + err);
          });

        scope.updateCartoMap = function(lat, lng, type) {

          var query, cartocss;

          if(type == 'legal' || type == 'community') {
            query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT loc.cartodb_id, loc.the_geom, loc.the_geom_webmercator, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, loc.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM nyc_cbos_locations AS loc, nyc_cbos_service_areas AS sa WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), sa.the_geom ) AND loc.organization = sa.organization AND loc.org_type IN ('" + type + "') ORDER BY dist ASC ) T LIMIT 5";
            cartocss = "#nyc_cbos_locations{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:10;marker-fill:#F60;marker-allow-overlap:true}#nyc_cbos_locations::labels{text-name:[rownum];text-face-name:'DejaVu Sans Book';text-size:20;text-label-position-tolerance:10;text-fill:#000;text-halo-fill:#FFF;text-halo-radius:2;text-dy:-10;text-allow-overlap:true;text-placement:point;text-placement-type:simple}";
          } else {
            query = "SELECT * FROM nyc_cbos_locations";
            cartocss = "#nyc_cbos_locations{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:10;marker-fill:#F60;marker-allow-overlap:true}";
          }

          if(userMarker) map.removeLayer(userMarker);
          userMarker = L.marker([lat,lng]);
          userMarker.addTo(map);

          mainSublayer.set({
            sql: query,
            cartocss: cartocss
          });

          CartoDB.getSQL().getBounds(query).done(function(bounds) {
            bounds.push([lat,lng]);
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
      queryByLatLng: function(lat, lng, type) {
        // var query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT bcl.organization, bcl.contact_information, bcl.address, bcl.services, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, bcl.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM brooklyn_cbos_locations AS bcl, brooklyn_cbos AS bc WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), bc.the_geom ) AND bc.cartodb_id = bcl.cartodb_id AND bc.service_area_type " + boroughString + " IN ('borough') ORDER BY dist ASC ) T";
        var query = "SELECT *, row_number() OVER (ORDER BY dist) as rownum FROM ( SELECT loc.organization, loc.contact_information, loc.address, loc.services, round( (ST_Distance( ST_GeomFromText('Point(" + lng + " " + lat + ")', 4326)::geography, loc.the_geom::geography ) / 1609)::numeric, 1 ) AS dist FROM nyc_cbos_locations AS loc, nyc_cbos_service_areas AS sa WHERE ST_Intersects( ST_GeomFromText( 'Point(" + lng + " " + lat + ")', 4326 ), sa.the_geom ) AND loc.organization = sa.organization AND loc.org_type IN ('" + type + "') ORDER BY dist ASC ) T LIMIT 5";
        //console.log(query);
        return cartoSQL.execute(query);
      },
      getSQL: function() { return cartoSQL; }
    }
}]);

'use strict';

angular.module('onboarding').factory('Hotlines', ['$http', '$q',
	function($http, $q){

		var requestLocalFile = function() {
			var deferred = $q.defer();

			$http.get('data/hotlines.json').then(function(response) {
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		};

		return {
			getLocalFile: function() {
				return requestLocalFile();
			}
		};



	}]);

'use strict';

// Setting up route
angular.module('kyr').run(['$rootScope', '$state', '$window', '$location',
  function($rootScope, $state, $window, $location) {

  	// Remove footer margin
  	// Might want to move this into the the core config, if we're reusing this
  	$rootScope.$on('$stateChangeSuccess', function(){
  		$rootScope.noMargin = $state.current.noMargin;

  		// Hmm, should discuss this...
  		if($state.current.localHistory) {
  			$rootScope.showKyrBackBtn = true;
  		} else {
  			$rootScope.showKyrBackBtn = false;
  		}
  	});
  }
]);
(function () {
  'use strict';

  //Setting up route
  angular
    .module('kyr')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    // Kyr state routing


    // [TODO] eventually we won't need noMargin
    $stateProvider
      .state('kyr', {
        url: '/kyr',
        templateUrl: 'modules/kyr/views/kyr.client.view.html',
        controller: 'KyrController',
        noMargin: true,
        user: 'tenant'
      })
      .state('kyrDetail', {
      	url: '/kyr/:kyrId',
      	templateUrl: 'modules/kyr/views/kyr-detail.client.view.html',
      	controller: 'KyrDetailController',
      	noMargin: true,
				data: {
					disableBack: true
				},
				localHistory: true,
        globalStyles: 'white-bg',
        user: 'tenant'
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

angular.module('kyr').controller('KyrController', ['kyrService', '$scope', 'Pdf', '$translate',
	function(kyrService, $scope, Pdf, $translate) {
		$scope.lang = $translate.use();

		var emptyArray = [];
		$scope.kyrResponse;

		if($scope.lang === 'es_mx') {
			console.log('true');
			kyrService.fetchEs().then(function(data){
				$scope.kyrResponse = data;
			}, function(err){
				console.log(err);
			})
		} else {
			kyrService.fetch().then(function(data){
				$scope.kyrResponse = data;
			}, function(err) {
				console.log(err);
			});
		}
		
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
			$http.get('/data/kyr.json').then(function(data){
				var finalData = data.data;
				deferred.resolve(finalData);
			}, function(err) {
				console.log(err);
				deferred.reject(err);
			});
			return deferred.promise;
		};

		this.fetchEs = function() {
			var deferred = $q.defer();
			$http.get('/data/kyr_es.json').then(function(data){
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
			$http.get('/data/kyr.json').then(function(data){

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

// TODO: discuss putting all 'run' methods together
angular.module('onboarding').run(['$rootScope', '$location', 'Authentication', 'Users', '$window', function($rootScope, $location, Authentication, Users, $window) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {


		if(toState.onboarding && Authentication.user) {
			$location.path('/');
		}

		// Force an update to the user object if an appt has been scheduled
		// If not, this is harmless
		if(fromState.name === 'onboarding.scheduleNew') {
			Users.me();
		}

		if(toState.name === 'onboarding.referral' && !$location.search().q) {
			$location.path('/');
		}



	});

}]);

'use strict';

//Setting up route
angular.module('onboarding').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    // Jump to first child state
    $urlRouterProvider.when('/signup', '/onboarding/get-started');

    // Disabling access codes
    // $urlRouterProvider.when('/onboarding', '/onboarding/checklist');

  	// Onboarding state routing
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        templateUrl: 'modules/onboarding/views/onboarding.client.view.html',
        controller: 'OnboardingController',
        abstract: true,
        resolve: {
          advocateData: ['$location', '$rootScope', '$q', 'Advocates', function($location, $rootScope, $q, Advocates) {

            // this is ONLY for the advocate code included in the query string
            var deferred = $q.defer();



            if(!$location.search().q) {
              // this should be typical
              deferred.resolve({});
            } else {

              Advocates.validateNewUser({ code: $location.search().q },
                function(success) {
                  // ensure that only valid adv codes are sent to the referral page
                  if(success.advocate) {
                    deferred.resolve(success);
                  } else {
                    $rootScope.clearQueryString = true;
                    $location.search('q', null);
                    deferred.reject('Not a valid advocate code.');
                  }

                },
                function(error) {
                  $rootScope.clearQueryString = true;
                  $location.search('q', null);
                  deferred.reject(error);
                });
            }

            return deferred.promise;
          }]
        }
      })
      .state('onboarding.orientation', {
        url: '/get-started',
        templateUrl: 'modules/onboarding/partials/onboarding-orientation.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg',
        data: {
          disableBack: true
        }
      })
      // .state('onboarding.accessCode', {
      //   url: '/referral',
      //   templateUrl: 'modules/onboarding/partials/onboarding-orientation.client.view.html',
      //   onboarding: true,
      //   globalStyles: 'white-bg'
      // })
      .state('onboarding.success', {
        url: '/success',
        templateUrl: 'modules/onboarding/partials/onboarding-success.client.view.html',
        onboarding: true,
        globalStyles: 'white-bg',
        data: {
          disableBack: true
        }
      })
      .state('onboarding.problems', {
        url: '/checklist',
        templateUrl: 'modules/onboarding/partials/onboarding-problems.client.view.html',
        onboarding: true,
      })
      .state('onboarding.details', {
        url: '/personal',
        templateUrl: 'modules/onboarding/partials/onboarding-details.client.view.html',
        onboarding: true
      })
      .state('onboarding.schedulePrompt', {
        url: '/consultation',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule-prompt.client.view.html',
        data: {
          disableBack: true
        }
      })
      .state('onboarding.scheduleNew', {
        url: '/consultation/new',
        templateUrl: 'modules/onboarding/partials/onboarding-schedule.client.view.html'
      })
      .state('onboarding.referral', {
        url: '/referral',
        templateUrl: 'modules/onboarding/partials/onboarding-referral.client.view.html',
        onboarding: true,
        data: {
          disableBack: true
        }
      });

}]);

'use strict';

angular.module('onboarding').controller('OnboardingController', ['$rootScope', '$scope', '$location', '$timeout', '$filter', 'Users', 'Authentication', 'Advocates', '$http', '$modal', 'advocateData',
	function($rootScope, $scope, $location, $timeout, $filter, Users, Authentication, Advocates, $http, $modal, advocateData) {

		$scope.authentication = Authentication;
		$scope.newUser = {};
		// create newUser.problems only once (handles next/prev)
		$scope.newUser.problems = [];
		$scope.newUser.sharing = {
			enabled: false
		};

		$scope.accessCode = {
		  valid: false
		};


		/**
			*
			*   DEBUG STUFF
			*
			*/

		if(typeof DEBUG !== 'undefined' && DEBUG == true) {

			$scope.newUser = {
				firstName: 'Dan',
				lastName: "Stevenson",
				password: "password",
				borough: 'Brooklyn',
				address: '654 Park Place',
				unit: '1RF',
				phone: (Math.floor(Math.random() * 9999999999) + 1111111111).toString(),
				problems: [],
				sharing: {
					enabled: false
				}
			};

			$scope.accessCode = {
				// value: 'test5',
				value: '',
				valid: false
			};

		}


		/**
			*
			*   ORIENTATION / ADVOCATE CODE
			*
			*/

		$scope.hasAdvocateCode = false;

		$scope.openAdvocateCodeForm = function($event) {
			$scope.hasAdvocateCode = true;
			$scope.focusOnCodeEntry();
		};

		$scope.closeAdvocateCodeForm = function($event) {
			$event.stopPropagation();
			$event.preventDefault();
			$scope.hasAdvocateCode = false;
		};

		var onAdvocateSuccess = function(advocateData) {
			$scope.accessCode.valid = $rootScope.validated = true;
			$scope.accessCode.valueEntered = $scope.accessCode.value;
			$scope.newUser.advocate = advocateData.advocate;
			$scope.newUser.advocateRole = advocateData.advocateRole;
			$scope.referral = advocateData.referral;
			$scope.newUser.sharing.enabled = true;
		};

		// if advocate data has been passed from the ui-router resolve
		// angular.equals(x,{}) will tell you if its an empty object or not
		if(!angular.equals(advocateData, {})) {
			onAdvocateSuccess(advocateData);
		}

	  $scope.validateCode = function() {
			// handles back button
			if(!$scope.accessCode.valueEntered || $scope.accessCode.valueEntered !== $scope.accessCode.value) {

				Advocates.validateNewUser({ code: $scope.accessCode.value },
		      function(success) {
		        if(success.advocate) {
							onAdvocateSuccess(success);
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
			$location.path('/onboarding/get-started');
		};


		/**
			*
			*   SIGNUP
			*
			*/

		$scope.additionalInfo = function() {
			// Open modal
			var modalInstance = $modal.open({
				animation: 'true',
				templateUrl: 'modules/onboarding/partials/additional-info.client.view.html'
			});
		};

		$scope.userError = false;
		$scope.loaded = false;

		$scope.createAndNext = function (isValid) {

			if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account pre save', $scope.newUser);

			if(isValid) {

				$scope.newUser.firstName = $filter('titlecase')($scope.newUser.firstName);
				$scope.newUser.lastName = $filter('titlecase')($scope.newUser.lastName);
				$scope.newUser.address = $filter('titlecase')($scope.newUser.address);

				$scope.userError = false;
				$scope.error = undefined;
				$rootScope.loading = true;

				$http.post('/api/tenants/signup', $scope.newUser).success(function(response) {

					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					if(typeof DEBUG !== 'undefined' && DEBUG == true) console.log('create account post save', response);
					$rootScope.loading = false;
					$rootScope.takeActionAlert = true;

					// Advocate code user
					if($rootScope.validated) {
						$location.path('/home');
					} else {
						$location.path('/onboarding/consultation');
					}



				}).error(function(err) {

						// just gives a little fake load time, helps with user perception
						// users will just repeatedly try with the same errors
						$timeout(function () {
							$rootScope.loading = false;
		        	$scope.error = err;
						}, 1000);
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

angular.module('onboarding').directive('scheduler', ['$sce', '$location', 'Authentication', 'Users', function scheduler($sce, $location, Authentication, Users) {
  return {
    templateUrl: 'modules/onboarding/partials/scheduler.client.view.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.user = Authentication.user;

      scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      scope.hasScheduled = false;

      var currentLocation = $location.protocol() + '://' + $location.host() + (($location.port() !== 80 && $location.port() !== 443) ? ':' + $location.port() : '');


      scope.acuity = 'https://app.acuityscheduling.com/schedule.php?owner=13287615';

      if(scope.user) {
        scope.acuity += '&firstName=' + scope.user.firstName;
        scope.acuity += '&lastName=' + scope.user.lastName;
        scope.acuity += '&email=' + 'support@justfix.nyc';
        scope.acuity += '&phone=' + scope.user.phone;
        scope.acuity += '&field:2631340=' + currentLocation + '/share/' + scope.user.sharing.key;
      }


      window.addEventListener("message", function(e) {


        if(e.data && typeof e.data === 'string') {
          if (e.origin === 'https://app.acuityscheduling.com' && e.data.indexOf('sizing') > -1) {
            var height = parseInt(e.data.split(':')[1], 10);
            if(height > 0) element.find('iframe').attr('height', height + 'px');
          } else if (e.origin === 'https://sandbox.acuityinnovation.com' && e.data.indexOf('custombooking') > -1) {
            var bookingID = e.data.split(':')[1];

            // We could force update the user document post-webhook here
            // i.e. simply do Users.me();
            // (Instead we're doing it when the user leaves this view -
            //  see: line 11, public/modules/onboarding/config/onboarding.client.config.js)
            scope.hasScheduled = true;
            scope.$apply();
            console.log('scheduled', bookingID);
          }
        }




      });
    }
  };
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

// Setting up route
angular.module('problems').run(['$rootScope', '$state', '$window', 'Authentication', 'Users', 'Problems',
  function($rootScope, $state, $window, Authentication, Users, Problems) {


    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //
  	// });


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
			templateUrl: 'modules/problems/views/update-problems.client.view.html',
			user: 'tenant'
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
			if($scope.newOther && $scope.newOther.key.length) {
				$scope.addOther(event);
			}

			$modalInstance.close();
		}
		$scope.cancel = function() {
			$scope.userProblem.issues = userIssuesClone;
			$modalInstance.dismiss();
		}

	}])

'use strict';

angular.module('problems').controller('ProblemsController', ['$rootScope', '$scope', '$state', 'Authentication', 'Users', 'ProblemsResource', 'Problems',
	function($rootScope, $scope, $state, Authentication, Users, ProblemsResource, Problems) {

		$scope.user = Authentication.user;

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

			// make sure this only happens once (no infinite loops)
			// AND only happens if they've actually changed anything...
			if($scope.hasChangedProblems && !toState.updated) {

			  event.preventDefault();
				toState.updated = true;
			  $rootScope.loading = true;

			  var user = new ProblemsResource(Authentication.user);
				user.$updateChecklist(function(response) {

			    $rootScope.loading = false;
					$rootScope.dashboardSuccess = true;
			    $state.go(toState);

				}, function(response) {

			    $rootScope.loading = false;
					$rootScope.dashboardError = true;
					$state.go(toState);

				});

			// this gets called a second time with $state.go,
			// so we're just going to pass things along
			} else if(toState.updated) {
			  toState.updated = false;
			}

		});


	}])

'use strict';

angular.module('onboarding').directive('problemsChecklist', ['Authentication', 'Problems', '$modal',
  function(Authentication, Problems, $modal, $translate) {
    return {
      templateUrl: '/modules/problems/partials/problems-list.client.view.html',
      restrict: 'E',
      scope: {
        ourUser: '='
      },
      link: function postLink(scope, element, attrs) {

					// problemAssembler, if we don't have the problem set we just clear it out here
					var newProblem = function(problem) {

						var newProb = {};

				   	newProb.key = problem.key;
				    newProb.title = problem.title;
				    newProb.icon = problem.icon;
				    newProb.issues = [];
				    newProb.photos = [];

				    return newProb;
					};

          // this is a reference to whichever user we're working with, i.e.
          // scope.newUser or Authentication.user
          // scope.ourUser;

          // // user exists
          // if(!Authentication.user) {
          //   // This needs to be tested to see if it actually... works...
          //   scope.ourUser = scope.newUser;
          // } else {
          //   scope.ourUser = Authentication.user;
          // }

          // get problems from service
          Problems.getLocalFile().then(function (data) {
            scope.problems = data;

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

          scope.$parent.hasChangedProblems = false;

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
            var numIssuesOnModalOpen = ourUserCurrentProblem.issues.length;

						// Open modal
						var modalInstance = $modal.open({
				      animation: 'true',
				      templateUrl: 'modules/problems/partials/problem-modal.client.view.html',
				      controller: 'ModalProblemController',
				      size: 'md',
              scope: scope,
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

				   	modalInstance.result.then(function() {

              // in order to display on the grid icons
              scope.currentProblem.numChecked = ourUserCurrentProblem.issues.length;

              // check if anything has changed...
              if(numIssuesOnModalOpen != ourUserCurrentProblem.issues.length) {
                scope.$parent.hasChangedProblems = true;
              }

              // check if the modal was closed and no issues were selectedIssues
              // if so, remove from ourUser.problems
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }

            // modal was cancelled/dismissed
				   	}, function () {

              // this means a newProblem was created (see line 77)
              // but never actually used
              if(ourUserCurrentProblem.issues.length == 0) {
                scope.ourUser.problems.removeByKey(ourUserCurrentProblem.key);
              }
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

angular.module('onboarding')
.factory('ProblemsResource', ['$resource', 'UpdateUserInterceptor',
	function($resource, UpdateUserInterceptor) {
		return $resource('', {}, {
			updateChecklist: {
				method: 'PUT',
				url: 'api/tenants/checklist',
				interceptor: UpdateUserInterceptor
			},
			updateManagedChecklist: {
				method: 'PUT',
				url: 'api/advocates/tenants/:id/checklist'
			}
		});
	}
])
.factory('Problems', ['$http', '$q', 'Authentication',
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

//Setting up route
angular.module('tutorial').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Tutorial state routing

		$urlRouterProvider.when('/tutorial', '/tutorial/intro');



		$stateProvider
		.state('tutorial', {
      url: '/tutorial',
			templateUrl: 'modules/tutorial/views/tutorial.client.view.html',
      abstract: true,
      data: {
        disableBack: true
      }
    })
		.state('tutorial.intro', {
			url: '/intro',
			templateUrl: 'modules/tutorial/partials/intro.client.view.html'
		})
		.state('tutorial.main', {
			url: '/main',
			templateUrl: 'modules/tutorial/partials/tutorial.client.view.html',
			globalStyles: 'no-header-spacing white-bg'
		});
	}
]);
'use strict';

angular.module('tutorial').controller('TutorialController', ['$scope', '$sce', '$translate',
	function($scope, $sce, $translate) {

		var lang = $translate.use();
		var cdnUrl = 'https://degy28l8twq8c.cloudfront.net/tutorial/';

		// Just an easier way to handle this
		$scope.slides = [
			{
	      image: cdnUrl + 'TakeAction-' + lang + '.png',
	      text: $sce.trustAsHtml('The more evidence you upload, the stronger your case will be. Start with the <strong>Take Action</strong> section to add photos, file 311 complaints and send notices to your landlord.'),
	      title: 'Gather Evidence'
      },
			{
	      image: cdnUrl + 'StatusUpdate-' + lang + '.png',
	      text: $sce.trustAsHtml('Add a <strong>Status Update</strong> at any time from the dashboard. This will help you keep a log of any updates or communication with your landlord.'),
	      title: 'Add Status Updates'
      },
			{
	      image: cdnUrl + 'CaseHistory-' + lang + '.png',
	      text: $sce.trustAsHtml('Everything you do is saved in your <strong>Case History</strong>. You can print it for housing court or share it with neighbors and advocates by using the Share Link.'),
	      title: 'Share Your Case History'
      },
			{
	      image: cdnUrl + 'KYR-' + lang + '.png',
	      text: $sce.trustAsHtml('It\'s important to stay informed about your rights as a tenant. Go to <strong>Know Your Rights</strong> for articles and links to get more information.'),
	      title: 'Know Your Rights'
      }
		];
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users')
	.config(['$httpProvider', function($httpProvider) {
			// Set the httpProvider "not authorized" interceptor
			$httpProvider.interceptors.push(['$rootScope', '$q', '$location', '$injector', 'Authentication',
				function($rootScope, $q, $location, $injector, Authentication) {
					return {
						responseError: function(rejection) {

							switch (rejection.status) {
								case 401:

									// Deauthenticate the global user
									Authentication.user = null;

									console.log('not logged in');

									// Redirect to signin page
									$injector.get('$state').transitionTo('signin');
									break;
								case 403:
									console.log('unauthorized or not found');
									$injector.get('$state').transitionTo('not-found');
									break;
							}

							return $q.reject(rejection);
						}
					};
				}
			]);
		}
	])
	.run(['$rootScope', '$state', '$location', '$window', 'Authentication', function($rootScope, $state, $location, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			// If user is signed in then redirect back home
			if (toState.name === 'signin' && Authentication.user) {
				$location.path('/');
			}

		});
	}]);

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

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$state', '$location', '$timeout', 'Authentication',
  function($rootScope, $scope, $http, $state, $location, $timeout, Authentication) {
    $scope.authentication = Authentication;

    $scope.signin = function() {
      $scope.error = undefined;
      $rootScope.loading = true;
      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

        $rootScope.loading = false;

        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        switch(response.roles[0]) {
          case "admin":
            $state.go('admin');
            break;
          case "advocate":
            $state.go('advocateHome');
            break;
          case "tenant":
            $state.go('home');
            break;
          default:
            $state.go('home');
            break;
        }


      }).error(function(response) {

        $timeout(function () {
          $rootScope.loading = false;
          $scope.error = response.message;
        }, 1000);
      });
    };

    $scope.forgotPassword = {};
    $scope.pwError = false;
    $scope.pwSuccess = false;
    $scope.requestPassword = function() {
      if(!$scope.forgotPassword.phone) {
        $scope.pwError = true;
        $scope.pwSuccess = false;
      } else {
        $scope.pwError = false;
        $scope.pwSuccess = true;

        Rollbar.info("Forgot Password", { phone: $scope.forgotPassword.phone });
      }

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

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
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

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/api/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$state', '$filter', 'Users', 'Authentication', '$rootScope',
  function($scope, $http, $location, $state, $filter, Users, Authentication, $rootScope) {

    $scope.passwordVerified = false;
    $scope.successfulUpdate = false;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.user = Authentication.user;

      console.log($scope.user);

      if(fromState.name === 'settings.profile') {
      	$scope.successfulUpdate = false;
      }
    });

    // If user is not signed in then redirect back home
    // if (!$scope.user) $location.path('/');

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

      $http.delete('api/users/accounts', {
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
    	$http.get('api/auth/signout')
    		.then(function(success) {
    			// $location.path('/');
    		}, function(err) {
    			console.log(err);
    		});
    }

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        if(isValid) {

				$scope.userError = false;
				$rootScope.loading = true;

				user.$update(function(response) {

					// If successful we assign the response to the global user model

					$rootScope.loading = false;
					$scope.user = Authentication.user;

					$state.go('settings.profile');
	    		$scope.passwordVerified = false;
	    		$scope.successfulUpdate = true;


				}, function(err) {
					$rootScope.loading = false;
					console.log(err);
        	$scope.error = err;
				});

				} else {
					$scope.userError = true;
				}
			}
    };


    // Update a user phone
    $scope.updateUserPhone = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        if(isValid) {

				$scope.userError = false;
				$rootScope.loading = true;

				user.$updatePhone(function(response) {

					// If successful we assign the response to the global user model

					$rootScope.loading = false;
					$scope.user = Authentication.user;

					$state.go('settings.profile');
	    		$scope.passwordVerified = false;
	    		$scope.successfulUpdate = true;


				}, function(err) {
					$rootScope.loading = false;
					console.log(err);
        	$scope.error = err;
				});

				} else {
					$scope.userError = true;
				}
			}
    };


    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('api/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
				$state.go('settings.profile');
      }).error(function(response) {
        $scope.error = response.message;
      });
      return
    };

    // Maaaaaybe change this name -- gets kinda confusing w/ totally separate yet similarly named function above
    $scope.verifyPassword = function(password) {

    	$http.post('api/users/verify-password', {"password": password}).success(function(response){
    		$scope.passwordVerified = true;
    		// TODO: Verify this is ONLY for phone reset
    		$scope.user.phone = '';
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
      scope: false,
      link: function (scope, elm, attrs) {

        if(Authentication.user && Authentication.user.sharing.enabled) {
          elm[0].querySelector('input').checked = true;
        }

        if(scope.$parent.newUser) {
          scope.$watch('$parent.newUser', function (newUser) {
            if(newUser.sharing.enabled) elm[0].querySelector('input').checked = true;
            else elm[0].querySelector('input').checked = false;
          });
        }

        elm.bind('touchstart click', function(event) {
          event.stopPropagation();
          event.preventDefault();

          elm[0].querySelector('input').checked = !elm[0].querySelector('input').checked;

          if(Authentication.user) {
            Users.toggleSharing(function (user) {
              Authentication.user = user;
            });
          } else if(scope.newUser) {
            scope.newUser.sharing.enabled = elm[0].querySelector('input').checked;
            scope.$apply();
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
angular.module('users').factory('UpdateUserInterceptor', ['Authentication',
	function (Authentication) {
    //Code
    return {
        response: function(res) {
					Authentication.user = res.resource;
					return res;
        }
		};
	}
]);

angular.module('users').factory('Users', ['$resource', 'UpdateUserInterceptor',
	function($resource, UpdateUserInterceptor) {
		return $resource('api/users', {}, {
			me: {
				url: 'api/users/me',
				interceptor: UpdateUserInterceptor
			},
			update: {
				method: 'PUT',
				interceptor: UpdateUserInterceptor
			},
			updatePhone: {
				method: 'PUT',
				url: 'api/users/phone',
				interceptor: UpdateUserInterceptor
			},
			toggleSharing: {
				method: 'GET',
				url: 'api/tenants/public'
			},
			getScheduledEventInfo: {
				method: 'GET',
				url: 'api/acuity'
			}
		});
	}
]);
