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
