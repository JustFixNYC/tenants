'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Extend $santize to accomidate for ui-sref
// NEEDED: this has to be in the angular-translate module
// https://github.com/angular/angular.js/pull/6252/files

/*var $sanitizeExtFactory = function() {
  return {

    addSafeElements: function(elements) {
      var map = makeMap(elements);
      angular.extend(blockElements, map);
      angular.extend(validElements, map);
    },

    addSafeAttributes: function(attrs) {
      angular.extend(validAttrs, makeMap(attrs));
    }
  };
};*/

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
        'es_mx': 'Español'
    },
    'preferredLocale': 'en_US'
  })
  // async loading for templates
  .config(function ($translateProvider, $translateSanitizationProvider) {
  	// enable logging for missing IDs
    $translateProvider.useMissingTranslationHandlerLog();

    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });

    $translateProvider.preferredLanguage('en_US');// is applied on first load
    $translateProvider.useLocalStorage();// saves selected language to localStorage
    // NOTE: This shit causes all sorts of issues with our UI-SREF attribute. Not recognized in any sanitizer module, and causes it to break
    $translateProvider.useSanitizeValueStrategy(null); // Prevent XSS
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
        case 'landing':
          $rootScope.headerInner = false;
          $rootScope.headerLightBG = true;
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
    // setHeaderState('landing');

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
  .run(function($rootScope, $location, LocaleService) {

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
			$location.search('lang', 'es_mx');
			LocaleService.setLocaleByName('es_mx');
		}else if(langQuery === 'en' || langQuery === 'en-us') { // English url slightly wrong
      // console.log('condition 2');
			$location.search('lang', 'en_US');
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
