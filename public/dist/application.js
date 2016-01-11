'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'justfix';
	var applicationModuleVendorDependencies = [
		'ngResource', 
		'ngCookies',
		'ui.router', 
		'ui.bootstrap', 
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
  }]);  


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

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('issues');
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
		$stateProvider.	
		state('listActions', {
			url: '/home',
			templateUrl: 'modules/actions/views/list-actions.client.view.html'
		});					

	}
]);
'use strict';

// Issues controller
angular.module('actions').controller('ActionsController', ['$scope', '$location', 'Authentication', 'Actions', 'Activity',
  function($scope, $location, Authentication, Actions, Activity) {
    $scope.authentication = Authentication;

    $scope.list = function() {
      //console.log(Actions.query());
      $scope.actions = Actions.query();
    };

  }
]);
'use strict';

angular.module('actions').controller('ComplaintLetterController', ["$scope", "$modalInstance", "newActivity", function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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
    
    $modalInstance.close($scope.newActivity);
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
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
'use strict';

angular.module('actions').controller('HpactionController', ["$scope", "$modalInstance", "newActivity", function ($scope, $modalInstance, newActivity) {

  $scope.newActivity = newActivity;

  $scope.done = function () {
    $modalInstance.close($scope.newActivity);
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
      $modalInstance.close($scope.newActivity);
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


      $modalInstance.close($scope.newActivity);
      window.location.href = $scope.emailHref;
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
'use strict';

// Issues controller
angular.module('actions').controller('UpdateActivityController', ['$scope', '$modalInstance', 'newActivity', 'Issues',
  function ($scope, $modalInstance, newActivity, Issues, close) {

  $scope.newActivity = newActivity;
  $scope.issues = Issues.getUserIssuesByKey($scope.newActivity.key);
  
  console.log('update activity cntrl',$scope.newActivity);

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
    $modalInstance.close($scope.newActivity);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
'use strict';

angular.module('actions')
  .directive('smsMessage', ['deviceDetector', 'Messages', function (deviceDetector, Messages) {  
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {

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

          if(scope.superphone) href += scope.superphone;

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
            // alert('If you were using a phone, the message would be: \n\n' + msg);
            return;
          }

          return href;
        };


        scope.$watch(scope.superphone, function() {

          console.log('y');
          generateURL();
        });

       // element.bind('click', function (event) { console.log('generate'); smsHref = generateURL();  });
        
      }
    };

  }]);
'use strict';

angular.module('actions')
  .directive('toDoItem', ['$modal', '$sce', '$timeout', 'Activity', 'Actions',
    function ($modal, $sce, $timeout, Activity, Actions) {
    return {
      restrict: 'E',
      templateUrl: 'modules/actions/partials/to-do-item.client.view.html',
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.filterContentHTML = function() { return $sce.trustAsHtml($scope.action.content); };
      }],
      link: function (scope, element, attrs) {

        // $modal has issues with ngTouch... see: https://github.com/angular-ui/bootstrap/issues/2280

        //scope.action is a $resource!
        if(!scope.action.completed) scope.action.completed = false;
        scope.newActivity = {
          date: '',
          title: scope.action.title,
          key: scope.action.key
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

          var modalInstance = $modal.open({
            //animation: false,
            templateUrl: 'modules/actions/partials/modals/' + scope.action.cta.template,
            controller: scope.action.cta.controller,
            resolve: {
              newActivity: function () { return scope.newActivity; }
            }
          });

          modalInstance.result.then(function (newActivity) {
            scope.newActivity = newActivity;
            if(scope.action.cta.type !== 'initialContent') scope.triggerFollowUp();
            else scope.createActivity();
          }, function () {
            // modal cancelled
          });
        };

        scope.triggerFollowUp = function(url, type) {

          scope.action.$followUp({ type: 'add' });

          if(url && type === 'tel') window.location.href = url;
          else if(url && type === 'link') window.open(url, '_blank');
         };

        scope.cancelFollowUp = function() {
          scope.action.$followUp({ type: 'remove' });         
        };

        scope.closeAlert = function() {
          scope.action.closeAlert = true;
          scope.actions.splice(scope.$index,1);        
        };

        scope.createActivity = function() {

          //console.log('create activity pre creation', scope.newActivity);

          var activity = new Activity(scope.newActivity);

          //console.log('create activity post creation', scope.newActivity);

          activity.$save(function(response) {

            //console.log('create activity post save', response);

            scope.action.completed = true;
            scope.action.closeAlert = false; 

            // load new actions
            var idx = scope.$index;
            var newActions = Actions.query(
              {key: scope.newActivity.key}, 
              function() {
                newActions.forEach(function (action) {
                  scope.actions.splice(++idx, 0, action);
                }); 
              });

          }, function(errorResponse) {
            scope.error = errorResponse.data.message;
            scope.closeErrorAlert = false;
          });
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

    var getSMSMessage = function() {
      var message = 'Hello, this is ' + user.fullName + ' at ' + user.address + ', Apt. ' + user.unit + '.' +
            ' I\'m experiencing issues with my apartment and would like to get them resolved.' +
            ' Please contact me as soon as possible at this phone number. Thank you!';

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

//Setting up route
angular.module('activity').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		//$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider.
		state('listActivity', {
			url: '/yourcase',
			templateUrl: 'modules/activity/views/list-activity.client.view.html'
		});

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

    $scope.list = function() {
      $scope.activities = Activity.query();
    };

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);
'use strict';

//Issues service used to communicate Issues REST endpoints
angular.module('activity').factory('Activity', ['$resource',
  function($resource) {

    // taken from http://stackoverflow.com/questions/21115771/angularjs-upload-files-using-resource-solution
    //var transformRequest = function(data, headersGetter) { if (data === undefined) return data;var fd = new FormData();angular.forEach(data, function(value, key) { if (value instanceof FileList) { if (value.length == 1) { fd.append(key, value[0]);} else {angular.forEach(value, function(file, index) {fd.append(key + '_' + index, file);});}} else {if (value !== null && typeof value === 'object'){fd.append(key, JSON.stringify(value)); } else {fd.append(key, value);}}});return fd;}

    var transformRequest = function(data, headersGetter) {
      if (data === undefined)
        return data;

      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        // console.log(key + ' ' + value);

        if (value instanceof FileList) {
          if (value.length === 1) {
            fd.append(key, value[0]);
          } else {
            angular.forEach(value, function(file, index) {
              fd.append(key + '_' + index, file);
            });
          }
        } else {
          fd.append(key, value);
        }

        // console.log('fd', fd);
      });
      // console.log('fd', fd);
      return fd;
    };

    return $resource('activity', {}, {
      save: { 
          method: 'POST', 
          transformRequest: transformRequest, 
          headers: { 
            'Content-Type': undefined
          }
      } 
    });
  }
]);
'use strict';

// Setting up route
angular.module('core').run(['$rootScope', '$state', '$window', 'Authentication',
  function($rootScope, $state, $window, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(Authentication.user && toState.name === 'home') {
        event.preventDefault();
        $state.go('listActions');
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
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('manifesto', {
			url: '/manifesto',
			templateUrl: 'modules/core/views/manifesto.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {


		// NOTE: using justfix directive instead....

		// $scope.$watch(function(Authentication) { 
		// 	console.log('auth'); return $scope.authentication; 
		// });

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.isCollapsed = false;
			//$scope.currentStateTitle = toState.title;
			//console.log(toState.title);
		});


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

angular.module('core').directive('justfixHeader', ["$document", "$window", "$timeout", "Authentication", function($document, $window, $timeout, Authentication) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      scope.authentication = Authentication;
      scope.isCollapsed = false;
      //$scope.menu = Menus.getMenu('topbar');

      scope.toggleCollapsibleMenu = function() {
        scope.isCollapsed = !scope.isCollapsed;
      };

      // Collapsing the menu after navigation
      scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        scope.isCollapsed = false;
        scope.stateName = toState.name;
      });

      // var wrapper = $document[0].getElementById('header-wrapper');
      // scope.$watch(Authentication, function () {
      //   console.log('auth');
      //   if(!Authentication.user) angular.element(wrapper).css('margin-bottom', '0'); 
      //   else angular.element(wrapper).css('margin-bottom', '15px'); 
      // });

    }
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
angular.module('issues').controller('IssuesController', ['$scope', '$location', '$http', 'Authentication', 'Users',
  function($scope, $location, $http, Authentication, Users) {
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
      console.log('string');

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

    // Create new Issue
    $scope.create = function() {

      //console.log($scope.issues);

      var newUser = {
        fullName:     $scope.newIssue.name,
        phone:        $scope.newIssue.phone,
        borough:      $scope.newIssue.borough,
        address:      $scope.newIssue.address,
        unit:         $scope.newIssue.unit,
        nycha:        $scope.newIssue.nycha, 
        issues:       $scope.newIssue.issues,
        password:     $scope.newIssue.password        
      };
      
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

angular.module('issues').filter('areaTitle', function() {
  return function(input) {

    switch(input) {
      case 'generalApt': 
        return 'Whole Apartment';
      case 'entryHallway': 
        return 'Entry/Hallway';
      case 'kitchen': 
        return 'Kitchen';
      case 'bathroom': 
        return 'Bathrooms';
      case 'diningRoom': 
        return 'Dining Room';
      case 'livingRoom': 
        return 'Living Room';
      case 'bedrooms': 
        return 'Bedrooms';
      case 'publicAreas': 
        return 'Public Areas';
      default: 
        return '';
        break;
    }
  };
});
'use strict';

angular.module('issues').factory('Issues', ['$http', '$q', 'Authentication',
  function Issues($http, $q, Authentication) {

    var checklist = 'data/checklist.json';
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
      }
    };
  }
]);
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
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
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

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$location', 'Authentication',
  function($rootScope, $scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/ssues');

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
        // And redirect to the issues page

        console.log($scope.authentication.user);
        $location.path('/home');
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

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        //console.log('user', user);

        user.$update(function(response) {
          $scope.success = true;
          Authentication.user = response;
        }, function(response) {
          $scope.error = response.data.message;
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
  }
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
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
			}
      // ,
      // getIssues: {
      //   method: 'GET'
      // }
		});
	}
]);