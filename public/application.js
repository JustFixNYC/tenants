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
  // internationalization constants
  .constant('LOCALES', {
    'locales': {
        'en_US': 'English',
        'es': 'Español'
    },
    'preferredLocale': 'en_US'
  })
  // enable logging for missing IDs
  .config(function ($translateProvider) {
    $translateProvider.useMissingTranslationHandlerLog();
  })
  // async loading for templates
  .config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en_US');// is applied on first load
    $translateProvider.useLocalStorage();// saves selected language to localStorage
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
  .run(function($rootScope) {

    // ensure that this happens on pageload
    // https://github.com/angular-ui/ui-router/issues/1307
    var setHeaderState = function(name) {
      switch(name) {
        case 'landing':
          $rootScope.headerInner = false;
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
