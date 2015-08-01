'use strict';

// Configuring the Articles module
angular.module('issues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Issues', 'issues', 'dropdown', '/issues(/create)?');
		Menus.addSubMenuItem('topbar', 'issues', 'List Issues', 'issues');
		Menus.addSubMenuItem('topbar', 'issues', 'New Issue', 'issues/create');
	}

]);