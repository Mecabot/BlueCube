var app = angular.module('BlueCube.utils', [])

// Functions to make dealing with local storage easier
app.factory('$localstorage', ['$window', function($window) {
	return {
		// set: Save a simple key value pair
		set: function(key, value) {
			$window.localStorage[key] = value;
		},

		// get: Return the value of a provided key, and if it isn't set return the provided default
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},

		// setObject: Save a complex object as a key value pair
		setObject: function(key, value) {
			// Convert the object into JSON and then save it
			$window.localStorage[key] = JSON.stringify(value);
		},

		// getObject: Return a complex object for a provided key, or null if it isn't set
		getObject: function(key) {
			// Convert the object back from JSON before returning it
			return JSON.parse($window.localStorage[key] || null);
		},

		// delete: Delete a given key and its associated value
		delete: function(key) {
			$window.localStorage.removeItem(key);
		},

		// clear: Remove all stored items
		clear: function() {
			$window.localStorage.clear();
		}
	};
}]);

// Functions to handle the default settings or provided items
app.factory('$defaults', ['$localstorage', 'colourDefaults', function($localstorage, colourDefaults) {
	return {
		// resetColours: Setup the default colours including favourite colours
		resetColours: function() {
			// Define the default favourite colours (which match the defined colours in the cub
			// library
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

			// Store the favourite colours, and the uniqueID for the next colour
			$localstorage.setObject('userDefinedColours', colours);
			$localstorage.set('userDefinedColours_uniqueID', 10);

			// Store the default selected primary and secondary colours
			$localstorage.set('selectedColour', colourDefaults.defaultColour);
			$localstorage.set('otherColour', colourDefaults.otherColour);
		},

		// resetHistory: Clear the history list
		resetHistory: function() {
			// Clear the history, and reset the uniqueID
			$localstorage.delete('history');
			$localstorage.set('history_uniqueID', 0);

			// Set the default number of history items
			$localstorage.set('history_items', 100);
		},

		// resetStatic: Setup the default static favourites
		resetStatic: function() {
			// Define the static favourites
			var staticDefaults = [
				{
					id: 0,
					name: "Rainbow",
					cmds:	[
								{"id":1,"cmd":"set 000 180064;"},
								{"id":2,"cmd":"set 001 0C0032;"},
								{"id":3,"cmd":"set 002 060019;"},
								{"id":4,"cmd":"set 003 03000C;"},
								{"id":5,"cmd":"set 010 380044;"},
								{"id":6,"cmd":"set 011 1C0022;"},
								{"id":7,"cmd":"set 012 0E0011;"},
								{"id":8,"cmd":"set 013 070008;"},
								{"id":9,"cmd":"set 020 580024;"},
								{"id":10,"cmd":"set 021 2C0012;"},
								{"id":11,"cmd":"set 022 160009;"},
								{"id":12,"cmd":"set 023 0B0004;"},
								{"id":13,"cmd":"set 030 780004;"},
								{"id":14,"cmd":"set 031 3C0002;"},
								{"id":15,"cmd":"set 032 1E0001;"},
								{"id":16,"cmd":"set 033 0F0000;"},
								{"id":17,"cmd":"set 130 641800;"},
								{"id":18,"cmd":"set 131 320C00;"},
								{"id":19,"cmd":"set 132 190600;"},
								{"id":20,"cmd":"set 133 0C0300;"},
								{"id":21,"cmd":"set 230 443800;"},
								{"id":22,"cmd":"set 231 221C00;"},
								{"id":23,"cmd":"set 232 110E00;"},
								{"id":24,"cmd":"set 233 080700;"},
								{"id":25,"cmd":"set 330 245800;"},
								{"id":26,"cmd":"set 331 122C00;"},
								{"id":27,"cmd":"set 332 091600;"},
								{"id":28,"cmd":"set 333 040B00;"},
								{"id":29,"cmd":"set 320 047800;"},
								{"id":30,"cmd":"set 321 023C00;"},
								{"id":31,"cmd":"set 322 011E00;"},
								{"id":32,"cmd":"set 323 000F00;"},
								{"id":33,"cmd":"set 310 006418;"},
								{"id":34,"cmd":"set 311 00320C;"},
								{"id":35,"cmd":"set 312 001906;"},
								{"id":36,"cmd":"set 313 000C03;"},
								{"id":37,"cmd":"set 300 004438;"},
								{"id":38,"cmd":"set 301 00221C;"},
								{"id":39,"cmd":"set 302 00110E;"},
								{"id":40,"cmd":"set 303 000807;"},
								{"id":41,"cmd":"set 200 002458;"},
								{"id":42,"cmd":"set 201 00122C;"},
								{"id":43,"cmd":"set 202 000916;"},
								{"id":44,"cmd":"set 203 00040B;"},
								{"id":45,"cmd":"set 100 000478;"},
								{"id":46,"cmd":"set 101 00023C;"},
								{"id":47,"cmd":"set 102 00011E;"},
								{"id":48,"cmd":"set 103 00000F;"},
								{"id":49,"cmd":"set 110 180064;"},
								{"id":50,"cmd":"set 111 0C0032;"},
								{"id":51,"cmd":"set 112 060019;"},
								{"id":52,"cmd":"set 113 03000C;"},
								{"id":53,"cmd":"set 120 780004;"},
								{"id":54,"cmd":"set 121 3C0002;"},
								{"id":55,"cmd":"set 122 1E0001;"},
								{"id":56,"cmd":"set 123 0F0000;"},
								{"id":57,"cmd":"set 220 245800;"},
								{"id":58,"cmd":"set 221 122C00;"},
								{"id":59,"cmd":"set 222 091600;"},
								{"id":60,"cmd":"set 223 040B00;"},
								{"id":61,"cmd":"set 210 004438;"},
								{"id":62,"cmd":"set 211 00221C;"},
								{"id":63,"cmd":"set 212 00110E;"},
								{"id":64,"cmd":"set 213 000807;"}
							]
				},
				{
					id: 1,
					name: "All Black",
					cmds:	[
								{"id":1,"cmd":"all 000000;"}
							]
				},
				{
					id: 2,
					name: "Crossed Planes",
					cmds:	[
								{"id":1,"cmd":"setplane X 2 0000ff;"},
								{"id":2,"cmd":"setplane Y 1 3DF400;"}
							]
				},
				{
					id: 3,
					name: "Filled Sphere",
					cmds:	[
								{"id":1,"cmd":"sphere 111 ff0000 00ff00;"},
								{"id":2,"cmd":"box 000 333 0000ff 2;"}
							]
				}
			];

			// Store the static favourites, and the uniqueID for the next favourite
			$localstorage.setObject('staticFavourites', staticDefaults);
			$localstorage.set('staticFavourites_uniqueID', 4);

			// The static favourites modal temporarily stores data - delete it
			$localstorage.delete('staticFavourite');
		},

		// resetUserDefinedFunctions: Setup the user defined functions
		resetUserDefinedFunctions: function() {
			// Define the user defined functions
			var udfDefaults =	[
									{
										id: 0,
										name: "ZigZag Blue",
										number: 1,
										colourRequired: true,
										colour: "0000ff",
									},
									{
										id: 1,
										name: "ZigZag Green",
										number: 1,
										colourRequired: true,
										colour: "00ff00",
									},
									{
										id: 2,
										name: "Random Pastels",
										number: 2,
										colourRequired: false,
										colour: "",
									},
									{
										id: 3,
										name: "Random Colours",
										number: 3,
										colourRequired: false,
										colour: "",
									},
									{
										id: 4,
										name: "Random Primary Colours",
										number: 4,
										colourRequired: false,
										colour: "",
									},
									{
										id: 5,
										name: "Face Sweep",
										number: 5,
										colourRequired: false,
										colour: "",
									}
								];

			// Store the user defined functions, and the uniqueID for the next function
			$localstorage.setObject('userDefinedFunctions', udfDefaults);
			$localstorage.set('userDefinedFunctions_uniqueID', 6);
		},

		// resetOthers: Delete any background settings that we set
		resetOthers: function() {
			// Delete whether to auto connect to the cube or not
			$localstorage.delete('autoConnect');

			// Delete the UUID of the last cube we connected to
			$localstorage.delete('bluetoothUUID');

			// Delete whether we send all of the colour changes, or only selected ones
			$localstorage.delete('liveAllColourChanges');
		}
	};
}]);

// Functions to specifically dealing with the cube
app.factory('$cubeAction', ['$cordovaBluetoothSerial', 'HistoryService', '$ionicContentBanner', function($cordovaBluetoothSerial, HistoryService, $ionicContentBanner) {
	return {
		// lookupCoords: Turns the id number of a LED [1 to 64] to its XYZ coordinates
		lookupCoords: function(id) {
			// Define the coords variable to hold the XYZ position
			var coords = "000";

			// Switch that turns the ID into a coordinate
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

			// Return the coordinate to the calling function
			return coords;
		},

		// sendMessage: Send a message to the cube
		sendMessage: function(message, addToHistory) {
			if (addToHistory == true) {
				// Add the message to the history
				HistoryService.add(message);
			}

			// Log what we are sending
			console.log("Sending: " + message);

			// It appears that the iOS bluetooth stack can only handle 20 chars at a time, anything more
			// and it doesn't actually send the message, and then disconnects.

			// As such, split the message into 20 char chunks, which the cube will put back together into
			// a single message as long as it's received within the timeout period.
			if (message.length <= 20) {
				// Message didn't need to be broken up
				this.write(message);
			} else {
				// At the cube end we don't allow more than 32 characters for a message, so spliting
				// the message into two parts is all that is required
				this.write(message.substr(0,20));
				this.write(message.substr(20));
			}
		},

		// write: Transmit the message to the cube
		write: function(message) {
			// Tracks the banner we show when there is a error sending the message
			var contentBannerInstance;

			// Check whether we are connected to the cube
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					// We are connected, so send the message
					$cordovaBluetoothSerial.write(message).then(
						function () {
							// Message was successfully sent.
							console.log(message + " sent");

							// Close the banner if it is open
							if (contentBannerInstance) {
								contentBannerInstance();
								contentBannerInstance = null;
							}
						},
						function (error) {
							// Message failed to send, so show an error message
							contentBannerInstance = $ionicContentBanner.show({
								text: ['Error communicating with cube'],
								interval: 3000,
								autoClose: 3000,
								type: 'error',
								transition: 'fade'
							});

							// Log that there was an error
							console.log("Error with " + message + " " + error);
						}
					);
				},
				function() {
					// Cube not connected, so show an error message
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
	};
}]);
