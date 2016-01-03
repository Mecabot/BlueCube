angular.module('BlueCube.utils', [])

.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},

		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},

		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},

		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || null);
		},

		clear: function() {
			$window.localStorage.clear();
		}
	}
}])

.factory('$cubeAction', ['$cordovaBluetoothSerial', 'HistoryService', function($cordovaBluetoothSerial, HistoryService) {
	return {
		sendMessage: function(message, addToHistory) {
			if (addToHistory == true) {
  			HistoryService.add(message);
      }

      // It appears that the iOS bluetooth stack can only handle 20 chars at a time, anything more
      // and it doesn't actually send the message, and then disconnects.

      // As such, split the message into 20 char chunks, which the cube will put back together into
      // a single message as long as it's received within the timeout period.

      if (message.length <= 20) {
        this.write(message);
      } else {
        this.write(message.substr(0,20));
        this.write(message.substr(20));
      }
    },

    write: function(message) {
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
		}
	}
}]);
