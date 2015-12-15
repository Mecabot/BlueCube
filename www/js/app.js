// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'BlueCube' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('BlueCube', ['ionic', 'BlueCube.controllers', 'ngCordova', 'BlueCube.directives'])

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

.service('ColourService', function($q) {
  var uniqueID = 4;
  var colours = [
      {
        id: '1',
        name: 'Red',
        hex: 'FF0000',
      },
      {
        id: '2',
        name: 'Green',
        hex: '00FF00',
      },
      {
        id: '3',
        name: 'Blue',
        hex: '0000FF',
      }
    ];

  return {
    list: function() {
      return colours
    },
    get: function(colourId) {
      for (i in colours) {
        if (colours[i].id == colourId) {
          return colours[i];
        }
      }
    },
    save: function(userDefinedColour) {
      if (userDefinedColour.id == null) {
        // New colour
        userDefinedColour.id = uniqueID;
        uniqueID = uniqueID + 1;
        colours.push(userDefinedColour);
      } else {
        for (i in colours) {
          if (colours[i].id == userDefinedColour.id) {
            colours[i] = userDefinedColour;
          }
        }
      }
    },
    delete: function(colourId) {
      for (i in colours) {
        if (colours[i].id == colourId) {
          colours.splice(i, 1);
        }
      }
    },

  }
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
