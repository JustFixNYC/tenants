'use strict';

//Setting up route
angular.module('issues').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Jump to first child state
		$urlRouterProvider.when('/issues/create', '/issues/create/checklist');

		// Issues state routing
		$stateProvider.
		state('listIssues', {
			url: '/issues',
			templateUrl: 'modules/issues/views/list-issues.client.view.html'
		}).
		state('createIssue', {
			url: '/issues/create',
			templateUrl: 'modules/issues/views/create-issue.client.view.html',
			abstract: true
		}).
		state('createIssue.checklist', {
			url: '/checklist',
			title: 'Issues Checklist',
			templateUrl: 'modules/issues/partials/create-issue-checklist.client.view.html',
			data: { disableBack: true }
		}).
		state('createIssue.general', {
			url: '/general',
			title: 'General Info',
			templateUrl: 'modules/issues/partials/create-issue-general.client.view.html'
		}).
		state('createIssue.personal', {
			url: '/personal',
			title: 'Personal Information',
			templateUrl: 'modules/issues/partials/create-issue-personal.client.view.html'
		}).
		state('createIssue.contact', {
			url: '/contact',
			title: 'Who To Contact',
			templateUrl: 'modules/issues/partials/create-issue-contact.client.view.html'
		}).
		state('createIssue.review', {
			url: '/review',
			title: 'Review',
			templateUrl: 'modules/issues/partials/create-issue-review.client.view.html'
		}).
		state('updateIssues', {
			url: '/issues/update',
			templateUrl: 'modules/issues/views/update-issues.client.view.html'
		});
		// state('viewIssue', {
		// 	url: '/issues/:issueId',
		// 	templateUrl: 'modules/issues/views/view-issue.client.view.html'
		// }).
		// state('editIssue', {
		// 	url: '/issues/:issueId/edit',
		// 	templateUrl: 'modules/issues/views/edit-issue.client.view.html'
		// });
	}
]);
