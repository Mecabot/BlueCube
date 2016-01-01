angular.module('BlueCube', ['ionic', 'BlueCube.controllers', 'ngCordova', 'BlueCube.directives', 'BlueCube.services', 'BlueCube.utils'])

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

		.state('app.presets', {
			url: '/presets',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/presets.html',
					controller: 'PresetsCtrl'
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
			},
			resolve: {
				colours: function(ColourService) {
					return ColourService.list()
				}
			}
		})

		.state('app.single', {
			url: '/single',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/single.html',
					controller: 'SingleCtrl'
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
		})

		.state('app.history', {
			url: '/history',
			cache: true,
			views: {
				'menuContent': {
					templateUrl: 'templates/history.html',
					controller: 'HistoryCtrl'
				}
			}
		})

    .state('app.about', {
     url: '/about',
     cache: false,
     views: {
         'menuContent': {
             templateUrl: 'templates/about.html',
             controller : 'AboutCtrl'
         }
     }
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

    .state('app.settings', {
     url: '/settings',
     cache: false,
     views: {
         'menuContent': {
             templateUrl: 'templates/settings.html',
             controller : 'SettingsCtrl'
         }
     }
    });
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/connection');
});
