'use strict';

angular.module('onboarding').directive('problemIssueItem', ['$timeout', function($timeout){
  return {
    template: '',
    restrict: 'A',
    link: function(scope, element, attrs) {

      // we should just take advantage of angulars data binding here
  		scope.isSelected = function() {
        return scope.userProblem.issues.containsByKey(scope.issue.key);
  		};

  		scope.select = function() {
        if(scope.isSelected()) {
          scope.userProblem.issues.removeByKey(scope.issue.key);
        } else {
          scope.userProblem.issues.push(scope.issue);
        }
  		};

    	// Our parent's checkString, and whether to make these active
    	// if(scope.checkString) {
    	// 	if(scope.checkString.indexOf(attrs.issue) > -1){
    	// 		element.addClass('active');
    	// 	}
    	// }

			// Selection of issue
			// scope.selectIssue = function(issue){
      //
			// 	if(element.hasClass('active') === true) {
			// 		scope.removeIssue(issue);
			// 		return;
			// 	}
      //
			// 	element.addClass('active');
			// 	scope.$parent.tempIssues.push(issue);
			// };

      scope.toggleOther = function() {
        scope.addMore = true;

        scope.newOther = {
          key: '',
          emergency: false
        };

        // $timeout waits until after scope.addMore has been applied
        $timeout(function () {
          var objDiv = document.querySelector(".selecter-options");
          objDiv.scrollTop = objDiv.scrollHeight;
        });
      };

			scope.addOther = function(event) {

        // stupid javascript
        event.stopPropagation();

        // angular doesn't like duplicates...
        if(!scope.userProblem.issues.containsByKey(scope.newOther.key)) {
          // make sure we push clones, not references
          scope.issues.push(scope.newOther);
          scope.userProblem.issues.push(scope.newOther);
          scope.newOther = {
            key: '',
            emergency: false
          };
          scope.addMore = false;

          // $timeout waits until after scope.addMore has been applied
          $timeout(function () {
            var objDiv = document.querySelector(".selecter-options");
            objDiv.scrollTop = objDiv.scrollHeight;
          });
        }

				// Our parent Modal Controller could contain the other issue -- if not, we can create it here (gets passed up into the modal save controller)
	    	// scope.other = scope.other || {
				// 	key: 'other',
				// 	value: '',
	  		// 	emergency: false
	    	// };


        // A not great copy of jumpTo.js in core directives (need to target element, not $document), willing to reassess
        // var someElement = angular.element(document.getElementById('other-block'));
        // var parentModal = angular.element(document.getElementsByClassName('selection-module')[0]);
        // parentModal.scrollToElement(someElement, 0, 800);
			};

			// scope.removeIssue = function(issue) {
			// 	// UI update, then remove this issue from our temporary issues
			// 	element.removeClass('active');
			// 	scope.tempIssues.map(function(curr, idx, arr){
			// 		if(curr.key == issue.key) {
			// 			arr.splice(idx, 1);
			// 		}
			// 	});
			// };
    }
  };

}]);
