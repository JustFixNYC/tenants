'use strict';

angular.module('core').controller('FooterController', ['$scope', '$window', 'Authentication',
  function($scope, $window, Authentication) {

    $scope.authentication = Authentication;

    var links = {
      actions : {
        link: 'listActions',
        title: 'repeating.listActions',
        icon: '/modules/core/img/sections/action.svg'
      },
      activity : {
        link: 'listActivity',
        title: 'repeating.caseHistory',
        icon: '/modules/core/img/sections/history.svg'
      },
      issues : {
        link: 'updateProblems',
        title: 'repeating.issueChecklist',
        icon: '/modules/core/img/sections/issues.svg'
      },
      profile : {
        link: 'settings.profile',
        title: 'repeating.profile',
        icon: '/modules/core/img/sections/profile.svg'
      },
      help : {
        link: 'findHelp',
        title: 'repeating.findHelp',
        icon: '/modules/core/img/sections/help.svg'
      },
      kyr : {
        link: 'kyr',
        title: 'repeating.kyr',
        icon: '/modules/core/img/sections/kyr.svg'
      }
    };

    $scope.footerLinks = [];


    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      switch(toState.name) {
        case 'kyr':
          $scope.footerLinks = [ links.actions, links.help ];
          break;
        case 'kyrDetail':
        	$scope.footerLinks = [ links.actions, links.help ];
        	break;
        case 'findHelp': case 'listActions':
          $scope.footerLinks = [ links.activity, links.kyr ];
          break;
        case 'listActivity':
          $scope.footerLinks = [ links.issues, links.help ];
          break;
        case 'updateProblems':
          $scope.footerLinks = [ links.actions, links.activity ];
          break;
        default:
          $scope.footerLinks = [];
          break;
      };

    });
  }
]);
