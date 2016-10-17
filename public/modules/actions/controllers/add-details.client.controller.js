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
