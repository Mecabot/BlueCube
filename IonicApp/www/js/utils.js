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
		lookupCoords: function(id) {
		  var coords = "000";

      switch(id) {
        case 1:
          coords = "000";
          break;
        case 2:
          coords = "010";
          break;
        case 3:
          coords = "020";
          break;
        case 4:
          coords = "030";
          break;
        case 5:
          coords = "100";
          break;
        case 6:
          coords = "110";
          break;
        case 7:
          coords = "120";
          break;
        case 8:
          coords = "130";
          break;
        case 9:
          coords = "200";
          break;
        case 10:
          coords = "210";
          break;
        case 11:
          coords = "220";
          break;
        case 12:
          coords = "230";
          break;
        case 13:
          coords = "300";
          break;
        case 14:
          coords = "310";
          break;
        case 15:
          coords = "320";
          break;
        case 16:
          coords = "330";
          break;
        case 17:
          coords = "001";
          break;
        case 18:
          coords = "011";
          break;
        case 19:
          coords = "021";
          break;
        case 20:
          coords = "031";
          break;
        case 21:
          coords = "101";
          break;
        case 22:
          coords = "111";
          break;
        case 23:
          coords = "121";
          break;
        case 24:
          coords = "131";
          break;
        case 25:
          coords = "201";
          break;
        case 26:
          coords = "211";
          break;
        case 27:
          coords = "221";
          break;
        case 28:
          coords = "231";
          break;
        case 29:
          coords = "301";
          break;
        case 30:
          coords = "311";
          break;
        case 31:
          coords = "321";
          break;
        case 32:
          coords = "331";
          break;
        case 33:
          coords = "002";
          break;
        case 34:
          coords = "012";
          break;
        case 35:
          coords = "022";
          break;
        case 36:
          coords = "032";
          break;
        case 37:
          coords = "102";
          break;
        case 38:
          coords = "112";
          break;
        case 39:
          coords = "122";
          break;
        case 40:
          coords = "132";
          break;
        case 41:
          coords = "202";
          break;
        case 42:
          coords = "212";
          break;
        case 43:
          coords = "222";
          break;
        case 44:
          coords = "232";
          break;
        case 45:
          coords = "302";
          break;
        case 46:
          coords = "312";
          break;
        case 47:
          coords = "322";
          break;
        case 48:
          coords = "332";
          break;
        case 49:
          coords = "003";
          break;
        case 50:
          coords = "013";
          break;
        case 51:
          coords = "023";
          break;
        case 52:
          coords = "033";
          break;
        case 53:
          coords = "103";
          break;
        case 54:
          coords = "113";
          break;
        case 55:
          coords = "123";
          break;
        case 56:
          coords = "133";
          break;
        case 57:
          coords = "203";
          break;
        case 58:
          coords = "213";
          break;
        case 59:
          coords = "223";
          break;
        case 60:
          coords = "233";
          break;
        case 61:
          coords = "303";
          break;
        case 62:
          coords = "313";
          break;
        case 63:
          coords = "323";
          break;
        case 64:
          coords = "333";
          break;
      }

      return coords;
		},

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
