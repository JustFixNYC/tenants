'use strict';

// Issues controller
angular.module('issues').controller('IssuesChecklistController', ['$scope', 'IssuesChecklist',
  function($scope, IssuesChecklist) {

    $scope.checklist = {};
    $scope.open = [];

    // detects if checklist is included in the update view or the onboarding form
    // used mainly to switch CTA at the bottom
    if($scope.updateView === undefined) $scope.updateView = false;

    IssuesChecklist.get().then(function (data) {
      var i = 0;
      for(var area in data[0]) {
        var items = data[0][area];
        $scope.checklist[area] = {
          'numChecked' : $scope.newIssue.issues[area] ? $scope.newIssue.issues[area].length : 0,
          'values' : items
        };
        if(!$scope.newIssue.issues[area]) $scope.newIssue.issues[area] = [];
        items.forEach(function (item) {
          if($scope.issues[area] && $scope.issues[area].indexOf(item) !== -1) {
            $scope.select(area,item);
          }
        });
        $scope.open[i++] = false;

      }
    });

    $scope.oneAtATime = true;
    $scope.status = {
      idx: -1,
      isFirstOpen: true,
      isFirstDisabled: false
    };

    $scope.select = function(area, item) {
      if(!this.isSelected(area, item)) {
        $scope.newIssue.issues[area].push(item);
        $scope.checklist[area].numChecked++;
      } else {
        var i = $scope.newIssue.issues[area].indexOf(item);
        $scope.newIssue.issues[area].splice(i, 1);
        $scope.checklist[area].numChecked--;
      }
    };
    $scope.isSelected = function(area, item) {
      if(!$scope.newIssue.issues[area]) return false; 
      return $scope.newIssue.issues[area].indexOf(item) !== -1;
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
    };

  }
]);