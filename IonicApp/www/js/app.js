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

		.state('app.shift', {
			url: '/shift',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/shift.html',
					controller: 'ShiftCtrl'
				}
			}
		})

		.state('app.set', {
			url: '/set',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/set.html',
					controller: 'SetCtrl'
				}
			}
		})

		.state('app.setplane', {
			url: '/setplane',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/setplane.html',
					controller: 'SetPlaneCtrl'
				}
			}
		})

		.state('app.copyplane', {
			url: '/copyplane',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/copyplane.html',
					controller: 'CopyPlaneCtrl'
				}
			}
		})

		.state('app.moveplane', {
			url: '/moveplane',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/moveplane.html',
					controller: 'MovePlaneCtrl'
				}
			}
		})

		.state('app.line', {
			url: '/line',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/line.html',
					controller: 'LineCtrl'
				}
			}
		})

		.state('app.box', {
			url: '/box',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/box.html',
					controller: 'BoxCtrl'
				}
			}
		})

		.state('app.sphere', {
			url: '/sphere',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/sphere.html',
					controller: 'SphereCtrl'
				}
			}
		})

		.state('app.connect', {
			url: '/connect',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/connect.html',
					controller: 'ConnectCtrl'
				}
			}
		})

		.state('app.userdefined', {
			url: '/userdefined',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/userdefined.html',
					controller: 'UserDefinedCtrl'
				}
			}
		})

		.state('app.static', {
			url: '/static',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/static.html',
					controller: 'StaticCtrl'
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

    .state('app.settings', {
     url: '/settings',
     cache: false,
     views: {
         'menuContent': {
             templateUrl: 'templates/settings.html',
             controller : 'SettingsCtrl'
         }
     }
    })

    .state('app.about', {
     url: '/about',
     cache: true,
     views: {
         'menuContent': {
             templateUrl: 'templates/about.html',
             controller : 'AboutCtrl'
         }
     }
    });

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/connect');
});
