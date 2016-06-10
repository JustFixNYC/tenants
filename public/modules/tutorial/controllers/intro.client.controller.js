'use strict';

angular.module('tutorial').controller('TutorialController', ['$scope',
	function($scope) {

		// Just an easier way to handle this
		$scope.slides = [
			{
	      image: 'modules/tutorial/img/1_Gatherevidence.png',
	      text: 'The more evidence you upload, the stronger your case will be. Start with the <strong>Take Action</strong> section to add photos, file 311 complaints and send notices to your landlord.',
	      title: 'Gather Evidence'
      },
			{
	      image: 'modules/tutorial/img/2_Statusupdate.png',
	      text: 'Add a <strong>Status Update</strong> at any time from the dashboard. This will help you keep a log of any updates or communication with your landlord.',
	      title: 'Add Status Updates'
      },
			{
	      image: 'modules/tutorial/img/3_Casehistory.png',
	      text: 'Everything you do is saved in your <strong>Case History</strong>. You can print it for housing court or share it with neighbors and advocates by using the Share URL.',
	      title: 'Share Your Case History'
      },
			{
	      image: 'modules/tutorial/img/4_Knowyourrights.png',
	      text: 'It\'s important to stay informed about your rights as a tenant. Go to <strong>Know Your Rights</strong> for articles and links to get more information.',
	      title: 'Know Your Rights'
      }
		]
	}
]);