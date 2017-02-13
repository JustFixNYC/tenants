'use strict';

angular.module('onboarding')
.factory('ProblemsResource', ['$resource', 'UpdateUserInterceptor',
	function($resource, UpdateUserInterceptor) {
		return $resource('', {}, {
			updateChecklist: {
				method: 'PUT',
				url: 'api/tenants/checklist',
				interceptor: UpdateUserInterceptor
			},
			updateManagedChecklist: {
				method: 'PUT',
				url: 'api/advocates/tenants/:id/checklist'
			}
		});
	}
])
.factory('Problems', ['$http', '$q', 'Authentication',
	function($http, $q, Authentication){

		var requestLocalFile = function() {
			var deferred = $q.defer();

			$http.get('data/checklist.json').then(function(response) {
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		};

		return {
			getLocalFile: function() {
				return requestLocalFile();
			},
			getUserIssuesByKey: function(key) {
				return Authentication.user.problems.getByKey(key).issues;
			},
			getUserProblems: function() {
				var problems = [];
				for(var i = 0; i < Authentication.user.problems.length; i++) {
					problems.push(Authentication.user.problems[i].title);
				}
				return problems;
			}
		};
}]);
