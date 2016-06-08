'use strict';

angular.module('core').controller('FooterController', ['$scope', '$window', 'Authentication',
  function($scope, $window, Authentication) {

    var links = {
      actions : {
        link: 'listActions',
        title: 'Take Action',
        icon: '/modules/core/img/sections/action.svg'
      },
      activity : {
        link: 'listActivity',
        title: 'Case History',
        icon: '/modules/core/img/sections/history.svg'
      },
      issues : {
        link: 'updateProblems',
        title: 'Issue Checklist',
        icon: '/modules/core/img/sections/issues.svg'
      },
      profile : {
        link: 'settings.profile',
        title: 'Profile',
        icon: '/modules/core/img/sections/profile.svg'
      },
      help : {
        link: 'findHelp',
        title: 'Find Help',
        icon: '/modules/core/img/sections/help.svg'
      },
      kyr : {
        link: 'kyr',
        title: 'Know Your Rights',
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
