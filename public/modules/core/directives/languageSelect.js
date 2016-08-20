'use strict';

angular.module('core').directive('languageSelect', function (LocaleService, $window) { 'use strict';
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
        
        // refresh window after selecting language (see abt better solution, locked w/ single bindings currently)
        $window.location.href = $window.location.href;
      };
    }
  };
});