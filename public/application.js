'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.module(ApplicationConfiguration.applicationModuleName).factory(
	'customLoader', function($q, $http) {
		return function(opts) {
			var deferred = $q.deferred;

			$http.get('/languages/locale-es_US.json')
				.then(function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject(err);
				});

			return deferred.promise;
		}
	}
);

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

    $translateProvider.translations('special', {
	    	"checklist": {
		  	"bedrooms": {
		  		"title": "Bedrooms",
		      "paint": "Peeling Paint",
		      "cracked": "Cracked Walls",
		      "mold": "Mold on Walls",
		      "water": "Water Damage",
		      "loose": "Loose Floor",
		      "windowGlass": "Window Glass Broken",
		      "windowFrame": "Window Frame Defective",
		      "door": "Door Broken",
		      "radiators": "Radiators/Risers Defective",
		      "ceilingFall": "Ceiling Falling/Fell",
		      "ceilingLeaking": "Ceiling Leaking",
		      "electricity": "Electricity defective",
		      "electricExposed": "Electric wiring exposed",
		      "outlets": "Outlets defective"
		  	},
		  	"kitchen":{
		  		"title": "Kitchen",
		  		"paint": "@:checklist.bedrooms.paint",
		      "cracked": "@:checklist.bedrooms.cracked",
		      "mold": "@:checklist.bedrooms.mold",
		      "water": "@:checklist.bedrooms.water",
		      "loose": "@:checklist.bedrooms.loose",
		      "baseboards": "Baseboards Defective",
		      "windowGlass": "@:checklist.bedrooms.windowGlass",
		      "windowFrame": "@:checklist.bedrooms.windowFrame",
		      "door": "@:checklist.bedrooms.door",
		      "radiators": "@:checklist.bedrooms.radiators",
		      "ceilingFall": "@:checklist.bedrooms.ceilingFall",
		      "ceilingLeaking": "@:checklist.bedrooms.ceilingLeaking",
		      "electricity": "@:checklist.bedrooms.electricity",
		      "electricExposed": "@:checklist.bedrooms.electricExposed",
		      "outlets": "@:checklist.bedrooms.outlets",
		      "sink": "Cracked Sink (Sink)",
		      "leakyFaucet": "Leaky Faucet (Sink)",
		      "noFaucet": "Faucets not installed (Sink)",
		      "brokenFaucet": "Faucets not working (Sink)",
		      "pipesLeaking": "Pipes Leaking (Sink)",
		      "drainBlock": "Drain Stoppage (Sink)",
		      "fridgeDefective": "Refrigerator Defective",
		      "fridgeBroken": "Refrigerator Broken",
		      "stoveDefective": "Stove Defective",
		      "stoveBroken": "Stove Broken"
		    },
		    "livingRoom": {
		    	"title": "Living Room",
		  		"paint": "@:checklist.bedrooms.paint",
		      "cracked": "@:checklist.bedrooms.cracked",
		      "mold": "@:checklist.bedrooms.mold",
		      "water": "@:checklist.bedrooms.water",
		      "loose": "@:checklist.bedrooms.loose",
		      "baseboards": "Baseboards Defective",
		      "windowGlass": "@:checklist.bedrooms.windowGlass",
		      "windowFrame": "@:checklist.bedrooms.windowFrame",
		      "door": "@:checklist.bedrooms.door",
		      "radiators": "@:checklist.bedrooms.radiators",
		      "ceilingFall": "@:checklist.bedrooms.ceilingFall",
		      "ceilingLeaking": "@:checklist.bedrooms.ceilingLeaking",
		      "electricity": "@:checklist.bedrooms.electricity",
		      "electricExposed": "@:checklist.bedrooms.electricExposed",
		      "outlets": "@:checklist.bedrooms.outlets"
		    },
		    "bathroom": {
		    	"title": "Bathroom",
		  		"paint": "@:checklist.bedrooms.paint",
		      "cracked": "@:checklist.bedrooms.cracked",
		      "mold": "@:checklist.bedrooms.mold",
		      "water": "@:checklist.bedrooms.water",
		      "loose": "@:checklist.bedrooms.loose",
		      "baseboards": "Baseboards Defective",
		      "windowGlass": "@:checklist.bedrooms.windowGlass",
		      "windowFrame": "@:checklist.bedrooms.windowFrame",
		      "door": "@:checklist.bedrooms.door",
		      "radiators": "@:checklist.bedrooms.radiators",
		      "ceilingFall": "@:checklist.bedrooms.ceilingFall",
		      "ceilingLeaking": "@:checklist.bedrooms.ceilingLeaking",
		      "electricity": "@:checklist.bedrooms.electricity",
		      "electricExposed": "@:checklist.bedrooms.electricExposed",
		      "outlets": "@:checklist.bedrooms.outlets",
		      "toiletBroken": "Toilet not working (Toilet)",
		      "toiletLeaking": "Toilet leaking (Toilet)",
		      "waterPressureToilet": "Inadequate Water pressure (Toilet)",
		      "sink": "Cracked Sink (Sink)",
		      "leakyFaucet": "Leaky Faucet (Sink)",
		      "noFaucet": "Faucets not installed (Sink)",
		      "brokenFaucet": "Faucets not working (Sink)",
		      "pipesLeaking": "Pipes Leaking (Sink)",
		      "crackedTub": "Cracked Tub (Bathtub)",
		      "leakyFaucetB": "Leaky Faucet (Bathtub)",
		      "noFaucetB": "Faucets not installed (Bathtub)",
		      "faucetsNotWorkingB": "Faucets not working (Bathtub)",
		      "pipesLeakingB": "Pipes Leaking (Bathtub)",
		      "notWorkingShower": "Not working (Shower)",
		      "WaterPressureShower": "Inadequate Water pressure (Shower)",
		      "leakyShowerHead": "Leaky shower head (Shower)",
		      "wallTiles": "Wall tiles cracked (Shower)",
		      "wallTilesMissing": "Wall tiles missing (Shower)",
		      "drainStoppage": "Drain Stoppage (Shower)"
		    },
		    "entireHome": {
		    	"title": "Entire Home",
		      "mice": "Mice",
		      "rats": "Rats",
		      "cockroaches": "Cockroaches",
		      "hotWater": "No Hot water",
		      "coldWater": "No Cold water",
		      "heat": "No heat",
		      "frontDoorDefective": "Front door defective",
		      "frontDoorBroken": "Front door broken",
		      "doorLockDefective": "Door lock defective",
		      "doorLockBroken": "Door lock broken",
		      "doorbellDefective": "Doorbell defective",
		      "doorbellBroken": "Doorbell broken",
		      "buzzerDefective": "Buzzer defective",
		      "buzzerBroken": "Buzzer broken",
		      "smoke": "No Smoke detector",
		      "smokeDefective": "Smoke detector defective",
		      "floorSags": "Floor sags",
		      "apartmentPainting": "Apartment needs painting"
		    },
		    "publicAreas": {
		    	"title": "Public Areas",
		      "paintOverdue": "Painting overdue (3 years)",
		      "peelingFlaking": "Peeling/flaking paint",
		      "heat": "@:checklist.entireHome.heat",
		      "hotWater": "@:checklist.entireHome.hotWater",
		      "waterPressure": "Inadequate water pressure",
		      "rusty": "Rusty water",
		      "electricExposed": "@:checklist.bedrooms.electricExposed",
		      "electricWeak": "Weak electrical current (lights dim)",
		      "windowGuards": "Window guards missing",
		      "smokeCO2": "Missing/broken smoke/Co2 detector",
		      "fumesSmoke": "Fumes/smoke entering apartment",
		      "ratsMice": "Rats/Mice",
		      "bug": "Bug Infestation",
		      "illegalImpartments": "Illegal apartments in basement",
		      "noReceipts": "No rent receipts given",
		      "incompleteReceipts": "Rent receipts incomplete (no date/ NYC address for landlord, etc.)",
		      "inadequateSuper": "Inadequate / no super service"
		    },
		    "landlordIssues": {
		    	"title": "Landlord Issues",
		    	"noReceipts": "@:checklist.publicAreas.noReceipts",
		      "noReciepts": "@:checklist.publicAreas.noReceipts",
		      "noLease": "No lease",
		      "falseDocuments": "False documents",
		      "illegalConstruction": "Illegal construction",
		      "repeatedMci": "Repeated MCI",
		      "overcharging": "Overcharging",
		      "holdover": "Holdover cases",
		      "useForce": "Using force or threats of force",
		      "stopInterrupt": "Stopping or interrupting essential services",
		      "stealing": "Removing possessions from unit",
		      "changeLocks": "Changing locks without supplying a new key",
		      "retaliation": "Retaliation for seeking repairs",
		      "buyout": "Constant buyout demands",
		      "falseEviction": "Threatening eviction on false claims"
		    }
		  }
		});

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
