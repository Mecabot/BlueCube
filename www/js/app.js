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
  var uniqueID;
  var colours;

   if (window.localStorage.getItem("userDefinedColours") != undefined) {
      colours = JSON.parse(window.localStorage.getItem("userDefinedColours"));
      console.log('Defined');
      console.log(JSON.stringify(colours));
    } else {
    colours = [
      {
        id: 1,
        name: 'Black',
        hex: '000000',
      },
      {
        id: 2,
        name: 'Blue',
        hex: '0000FF',
      },
      {
        id: 3,
        name: 'Green',
        hex: '00ff00',
      },
      {
        id: 4,
        name: 'Orange',
        hex: 'ff4500',
      },
      {
        id: 5,
        name: 'Pink',
        hex: 'ff1444',
      },
      {
        id: 6,
        name: 'Purple',
        hex: 'ff00ff',
      },
      {
        id: 7,
        name: 'Red',
        hex: 'ff0000',
      },
      {
        id: 8,
        name: 'White',
        hex: 'ffffff',
      },
      {
        id: 9,
        name: 'Yellow',
        hex: 'ffff00',
      }
    ];
      window.localStorage['userDefinedColours'] = JSON.stringify(colours);
      window.localStorage['userDefinedColours_uniqueID'] = 10;
  }

    uniqueID = parseInt(window.localStorage.getItem("userDefinedColours_uniqueID"));

    this.list = function() {
      return colours
    }

    this.get = function(colourId) {
      for (i in colours) {
        if (colours[i].id == colourId) {
          return colours[i];
        }
      }
    }

    this.add = function(userDefinedColour) {
        var newColour = {
                                  id: uniqueID,
                                  name: 'User1',
                                  hex: userDefinedColour,
                                };
        uniqueID = uniqueID + 1;
        colours.push(newColour);
      window.localStorage['userDefinedColours'] = JSON.stringify(colours);
      window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
    }

    this.delete = function(colourId) {
      for (i in colours) {
        if (colours[i].id == colourId) {
          colours.splice(i, 1);
        }
      }
      window.localStorage['userDefinedColours'] = JSON.stringify(colours);
      window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
    }

    this.reorder = function(item, fromIndex, toIndex) {
      colours.splice(fromIndex, 1);
      colours.splice(toIndex, 0, item);
      window.localStorage['userDefinedColours'] = JSON.stringify(colours);
      window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
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
