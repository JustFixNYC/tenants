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
 		'tmh.dynamicLocale', // angular-dynamic-locale
 		'ngSanitize' // Santize translations -> /application.js at line ~40
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
