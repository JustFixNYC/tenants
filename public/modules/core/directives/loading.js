'use strict';

angular.module('core').directive('loading', function($document) {
    return {
        restrict: 'E',
        templateUrl: 'modules/core/partials/loading.client.view.html',
        link: function (scope, elm, attrs) {

        }
    };
});
