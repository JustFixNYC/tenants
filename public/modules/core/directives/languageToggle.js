'use strict';

angular.module('core').directive('languageToggle', function (LocaleService, $window, $location) { 'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'modules/core/partials/language-toggle.client.view.html',
    controller: function ($scope) {
      $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
      $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
      $scope.visible = $scope.localesDisplayNames &&
      $scope.localesDisplayNames.length > 1;

      console.log($scope.currentLocaleDisplayName);
      console.log(LocaleService.getLocaleDisplayName());
      console.log($scope.localesDisplayNames);

      $scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
        // FYI: locale changes happens in LocaleService at /services/locale.client.service.js
      };
    }
  };
});
