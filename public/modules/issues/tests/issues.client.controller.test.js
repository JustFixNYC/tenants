'use strict';

(function() {
	// Issues Controller Spec
	describe('Issues Controller Tests', function() {
		// Initialize global variables
		var IssuesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Issues controller.
			IssuesController = $controller('IssuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Issue object fetched from XHR', inject(function(Issues) {
			// Create sample Issue using the Issues service
			var sampleIssue = new Issues({
				name: 'New Issue'
			});

			// Create a sample Issues array that includes the new Issue
			var sampleIssues = [sampleIssue];

			// Set GET response
			$httpBackend.expectGET('issues').respond(sampleIssues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issues).toEqualData(sampleIssues);
		}));

		it('$scope.findOne() should create an array with one Issue object fetched from XHR using a issueId URL parameter', inject(function(Issues) {
			// Define a sample Issue object
			var sampleIssue = new Issues({
				name: 'New Issue'
			});

			// Set the URL parameter
			$stateParams.issueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/issues\/([0-9a-fA-F]{24})$/).respond(sampleIssue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issue).toEqualData(sampleIssue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Issues) {
			// Create a sample Issue object
			var sampleIssuePostData = new Issues({
				name: 'New Issue'
			});

			// Create a sample Issue response
			var sampleIssueResponse = new Issues({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue'
			});

			// Fixture mock form input values
			scope.name = 'New Issue';

			// Set POST response
			$httpBackend.expectPOST('issues', sampleIssuePostData).respond(sampleIssueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Issue was created
			expect($location.path()).toBe('/issues/' + sampleIssueResponse._id);
		}));

		it('$scope.update() should update a valid Issue', inject(function(Issues) {
			// Define a sample Issue put data
			var sampleIssuePutData = new Issues({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue'
			});

			// Mock Issue in scope
			scope.issue = sampleIssuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/issues\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/issues/' + sampleIssuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid issueId and remove the Issue from the scope', inject(function(Issues) {
			// Create new Issue object
			var sampleIssue = new Issues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Issues array and include the Issue
			scope.issues = [sampleIssue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/issues\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIssue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.issues.length).toBe(0);
		}));
	});
}());