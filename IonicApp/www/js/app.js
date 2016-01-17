document.addEventListener('deviceready', function() {
    angular.bootstrap(document, ['BlueCube']);
}, false);
/*
 *  File:		app.js
 *  Purpose:	Handles setting up the app, and all of the routing for pages (including the
 *				template and controller to use)
 *  Author:		Adam Reed (adam@secretcode.ninja)
 *  Licence:	BSD 3-Clause Licence
 */


var app = angular.module('BlueCube', ['ionic', 'BlueCube.defaults', 'BlueCube.controllers', 'ngCordova', 'BlueCube.directives', 'BlueCube.services', 'BlueCube.utils', 'pascalprecht.translate', 'ngSanitize', 'jett.ionic.content.banner']);
app.run(function($ionicPlatform) {
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
});

app.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
	// Handle the difference between Australian English and American English
	// by preparing translations for Colour and Favourite
	$translateProvider.translations('en-AU', {
		colourSpelling:		"Colour",
		favouriteSpelling:	"Favourite"
	});

	$translateProvider.translations('en-US', {
		colourSpelling:		"Color",
		favouriteSpelling:	"Favorite"
	});

	// Set the default language to Australian English
	$translateProvider.preferredLanguage("en-AU");
	$translateProvider.fallbackLanguage("en-AU");

	// Set the translator to sanitise any variables it's applied to to
	// mitigate any XSS attempts.
	$translateProvider.useSanitizeValueStrategy('sanitize');

	// Specify all of the app routing / states, including the template and
	// controller to use for each page.
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		})

		// All
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

		// Shift
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

		// Set
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

		// Next
		.state('app.next', {
			url: '/next',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/next.html',
					controller: 'NextCtrl'
				}
			}
		})

		// Set Plane
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

		// Copy Plane
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

		//Move Plane
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

		// Line
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

		// Box
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

		// Sphere
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

		// Connect
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

		// User Defined Functions
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

		// Static Favourites
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

		// History
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

		// Settings
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

		// About
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

	// If none of the above are requested, default to the connect page
	$urlRouterProvider.otherwise('/app/connect');
});
