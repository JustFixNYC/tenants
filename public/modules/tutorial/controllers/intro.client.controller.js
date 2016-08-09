'use strict';

angular.module('tutorial').controller('TutorialController', ['$scope', '$sce',
	function($scope, $sce) {

		// Just an easier way to handle this
		$scope.slides = [
			{
	      image: 'modules/tutorial/img/1TakeAction.png',
	      text: $sce.trustAsHtml('The more evidence you upload, the stronger your case will be. Start with the <strong>Take Action</strong> section to add photos, file 311 complaints and send notices to your landlord.'),
	      title: 'Gather Evidence'
      },
			{
	      image: 'modules/tutorial/img/2StatusUpdate.png',
	      text: $sce.trustAsHtml('Add a <strong>Status Update</strong> at any time from the dashboard. This will help you keep a log of any updates or communication with your landlord.'),
	      title: 'Add Status Updates'
      },
			{
	      image: 'modules/tutorial/img/3CaseHistory.png',
	      text: $sce.trustAsHtml('Everything you do is saved in your <strong>Case History</strong>. You can print it for housing court or share it with neighbors and advocates by using the Share Link.'),
	      title: 'Share Your Case History'
      },
			{
	      image: 'modules/tutorial/img/4KYR.png',
	      text: $sce.trustAsHtml('It\'s important to stay informed about your rights as a tenant. Go to <strong>Know Your Rights</strong> for articles and links to get more information.'),
	      title: 'Know Your Rights'
      }
		];
	}
]);
