'use strict';

angular.module('onboarding').directive('problemOtherItem', ['$timeout', '$filter', function($timeout, $filter){
  return {
    template: '',
    restrict: 'A',
    link: function(scope, element, attrs) {

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

      element.on('touchstart touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });

      scope.addMore = false;

      scope.toggleOther = function(event) {

        event.preventDefault();
        event.stopPropagation();
        scope.addMore = true;

        scope.newOther = {
          key: '',
          emergency: false
        };

        element.find('input')[0].focus();

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
        if(!scope.userProblem.issues.containsByKey(scope.newOther.key) && scope.newOther.key.length) {

          scope.newOther.key = $filter('titlecase')(scope.newOther.key);

          scope.issues.push(scope.newOther);
          scope.userProblem.issues.push(scope.newOther);

          // make sure we create a new reference
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
