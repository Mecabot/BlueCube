angular.module('BlueCube', ['ionic', 'BlueCube.controllers', 'ngCordova', 'BlueCube.directives', 'BlueCube.services'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		})

		.state('app.connection', {
			url: '/connection',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/connection.html',
					controller: 'ConnectionCtrl'
				}
			}
		})

		.state('app.all', {
			url: '/all',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/all.html',
					controller: 'AllCtrl'
				}
			}
		})

		.state('app.colour', {
			url: '/colour',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/colour.html',
					controller: 'ColourCtrl'
				}
			},
			resolve: {
				colours: function(ColourService) {
					return ColourService.list()
				}
			}
		})

		.state('app.device', {
			url: '/device',
			cache: true,
			views: {
				'menuContent': {
					templateUrl: 'templates/device.html',
					controller: 'DeviceCtrl'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/connection');
});
