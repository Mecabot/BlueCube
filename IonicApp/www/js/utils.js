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

		delete: function(key) {
			$window.localStorage.removeItem(key);
		},

		clear: function() {
			$window.localStorage.clear();
		}
	}
}])

.factory('$defaults', ['$localstorage', function($localstorage) {
	return {
		resetColours: function() {
			var colours = [
				{
					id: 1,
					hex: '000000',  // Black
				},
				{
					id: 2,
					hex: '0000FF',  // Blue
				},
				{
					id: 3,
					hex: '00ff00',  // Green
				},
				{
					id: 4,
					hex: 'ff4500', // Orange
				},
				{
					id: 5,
					hex: 'ff1444', // Pink
				},
				{
					id: 6,
					hex: 'ff00ff', // Purple
				},
				{
					id: 7,
					hex: 'ff0000',  // Red
				},
				{
					id: 8,
					hex: 'ffffff',  // White
				},
				{
					id: 9,
					hex: 'ffff00',  // Yellow
				}
			];

			$localstorage.setObject('userDefinedColours', colours);
			$localstorage.set('userDefinedColours_uniqueID', 10);
			$localstorage.set('selectedColour', '00d1ff');
			$localstorage.set('otherColour', 'f80ed1');
		},

		resetHistory: function() {
			$localstorage.delete('history');
			$localstorage.set('history_uniqueID', 0);
			$localstorage.set('history_items', 100);
		},

		resetStatic: function() {
			$localstorage.delete('staticFavourite');
			$localstorage.set('staticFavourites', '[{"id":0,"name":"Rainbow","cmds":[{"id":1,"cmd":"set 000 180064;"},{"id":2,"cmd":"set 001 0C0032;"},{"id":3,"cmd":"set 002 060019;"},{"id":4,"cmd":"set 003 03000C;"},{"id":5,"cmd":"set 010 380044;"},{"id":6,"cmd":"set 011 1C0022;"},{"id":7,"cmd":"set 012 0E0011;"},{"id":8,"cmd":"set 013 070008;"},{"id":9,"cmd":"set 020 580024;"},{"id":10,"cmd":"set 021 2C0012;"},{"id":11,"cmd":"set 022 160009;"},{"id":12,"cmd":"set 023 0B0004;"},{"id":13,"cmd":"set 030 780004;"},{"id":14,"cmd":"set 031 3C0002;"},{"id":15,"cmd":"set 032 1E0001;"},{"id":16,"cmd":"set 033 0F0000;"},{"id":17,"cmd":"set 130 641800;"},{"id":18,"cmd":"set 131 320C00;"},{"id":19,"cmd":"set 132 190600;"},{"id":20,"cmd":"set 133 0C0300;"},{"id":21,"cmd":"set 230 443800;"},{"id":22,"cmd":"set 231 221C00;"},{"id":23,"cmd":"set 232 110E00;"},{"id":24,"cmd":"set 233 080700;"},{"id":25,"cmd":"set 330 245800;"},{"id":26,"cmd":"set 331 122C00;"},{"id":27,"cmd":"set 332 091600;"},{"id":28,"cmd":"set 333 040B00;"},{"id":29,"cmd":"set 320 047800;"},{"id":30,"cmd":"set 321 023C00;"},{"id":31,"cmd":"set 322 011E00;"},{"id":32,"cmd":"set 323 000F00;"},{"id":33,"cmd":"set 310 006418;"},{"id":34,"cmd":"set 311 00320C;"},{"id":35,"cmd":"set 312 001906;"},{"id":36,"cmd":"set 313 000C03;"},{"id":37,"cmd":"set 300 004438;"},{"id":38,"cmd":"set 301 00221C;"},{"id":39,"cmd":"set 302 00110E;"},{"id":40,"cmd":"set 303 000807;"},{"id":41,"cmd":"set 200 002458;"},{"id":42,"cmd":"set 201 00122C;"},{"id":43,"cmd":"set 202 000916;"},{"id":44,"cmd":"set 203 00040B;"},{"id":45,"cmd":"set 100 000478;"},{"id":46,"cmd":"set 101 00023C;"},{"id":47,"cmd":"set 102 00011E;"},{"id":48,"cmd":"set 103 00000F;"},{"id":49,"cmd":"set 110 180064;"},{"id":50,"cmd":"set 111 0C0032;"},{"id":51,"cmd":"set 112 060019;"},{"id":52,"cmd":"set 113 03000C;"},{"id":53,"cmd":"set 120 780004;"},{"id":54,"cmd":"set 121 3C0002;"},{"id":55,"cmd":"set 122 1E0001;"},{"id":56,"cmd":"set 123 0F0000;"},{"id":57,"cmd":"set 220 245800;"},{"id":58,"cmd":"set 221 122C00;"},{"id":59,"cmd":"set 222 091600;"},{"id":60,"cmd":"set 223 040B00;"},{"id":61,"cmd":"set 210 004438;"},{"id":62,"cmd":"set 211 00221C;"},{"id":63,"cmd":"set 212 00110E;"},{"id":64,"cmd":"set 213 000807;"}]}]');
			$localstorage.set('staticFavourites_uniqueID', 1);
		},

		resetOthers: function() {
			$localstorage.delete('autoConnect');
			$localstorage.delete('bluetoothUUID');
			$localstorage.delete('liveAllColourChanges');
		}
	}
}])

.factory('$cubeAction', ['$cordovaBluetoothSerial', 'HistoryService', '$ionicContentBanner', function($cordovaBluetoothSerial, HistoryService, $ionicContentBanner) {
	return {
		lookupCoords: function(id) {
		  var coords = "000";

      switch(id) {
        case 1:
          coords = "000";
          break;
        case 2:
          coords = "100";
          break;
        case 3:
          coords = "200";
          break;
        case 4:
          coords = "300";
          break;
        case 5:
          coords = "010";
          break;
        case 6:
          coords = "110";
          break;
        case 7:
          coords = "210";
          break;
        case 8:
          coords = "310";
          break;
        case 9:
          coords = "020";
          break;
        case 10:
          coords = "120";
          break;
        case 11:
          coords = "220";
          break;
        case 12:
          coords = "320";
          break;
        case 13:
          coords = "030";
          break;
        case 14:
          coords = "130";
          break;
        case 15:
          coords = "230";
          break;
        case 16:
          coords = "330";
          break;
        case 17:
          coords = "001";
          break;
        case 18:
          coords = "101";
          break;
        case 19:
          coords = "201";
          break;
        case 20:
          coords = "301";
          break;
        case 21:
          coords = "011";
          break;
        case 22:
          coords = "111";
          break;
        case 23:
          coords = "211";
          break;
        case 24:
          coords = "311";
          break;
        case 25:
          coords = "021";
          break;
        case 26:
          coords = "121";
          break;
        case 27:
          coords = "221";
          break;
        case 28:
          coords = "321";
          break;
        case 29:
          coords = "031";
          break;
        case 30:
          coords = "131";
          break;
        case 31:
          coords = "231";
          break;
        case 32:
          coords = "331";
          break;
        case 33:
          coords = "002";
          break;
        case 34:
          coords = "102";
          break;
        case 35:
          coords = "202";
          break;
        case 36:
          coords = "302";
          break;
        case 37:
          coords = "012";
          break;
        case 38:
          coords = "112";
          break;
        case 39:
          coords = "212";
          break;
        case 40:
          coords = "312";
          break;
        case 41:
          coords = "022";
          break;
        case 42:
          coords = "122";
          break;
        case 43:
          coords = "222";
          break;
        case 44:
          coords = "322";
          break;
        case 45:
          coords = "032";
          break;
        case 46:
          coords = "132";
          break;
        case 47:
          coords = "232";
          break;
        case 48:
          coords = "332";
          break;
        case 49:
          coords = "003";
          break;
        case 50:
          coords = "103";
          break;
        case 51:
          coords = "203";
          break;
        case 52:
          coords = "303";
          break;
        case 53:
          coords = "013";
          break;
        case 54:
          coords = "113";
          break;
        case 55:
          coords = "213";
          break;
        case 56:
          coords = "313";
          break;
        case 57:
          coords = "023";
          break;
        case 58:
          coords = "123";
          break;
        case 59:
          coords = "223";
          break;
        case 60:
          coords = "323";
          break;
        case 61:
          coords = "033";
          break;
        case 62:
          coords = "133";
          break;
        case 63:
          coords = "233";
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
      console.log("Sending: " + message);

      if (message.length <= 20) {
        this.write(message);
      } else {
        this.write(message.substr(0,20));
        this.write(message.substr(20));
      }
    },

    write: function(message) {
      var contentBannerInstance;

      $cordovaBluetoothSerial.isConnected().then(
				function() {
					$cordovaBluetoothSerial.write(message).then(
						function () {
							console.log(message + " sent");
							//CLOSE content banner!!!
							if (contentBannerInstance) {
								contentBannerInstance();
								contentBannerInstance = null;
							}
						},
						function (error) {
							contentBannerInstance = $ionicContentBanner.show({
								text: ['Error communicating with cube'],
								interval: 3000,
								autoClose: 3000,
								type: 'error',
								transition: 'fade'
							});
							console.log("Error with " + message + " " + error);
						}
					);
				},
				function() {
					contentBannerInstance = $ionicContentBanner.show({
						text: ['Cube not connected'],
						interval: 3000,
						autoClose: 3000,
						type: 'error',
						transition: 'fade'
					});
				}
			);
		}
	}
}]);
