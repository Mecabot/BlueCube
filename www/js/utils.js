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

.factory('$cubeAction', ['$cordovaBluetoothSerial', function($cordovaBluetoothSerial) {
	return {
		sendMessage: function(message) {
			console.log("Starting " + message);
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
