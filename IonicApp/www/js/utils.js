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
app.factory('$defaults', ['$localstorage', 'colourDefaults', 'appDefaults', 'staticFavouritesDefaults', 'userDefinedFunctionsDefaults', function($localstorage, colourDefaults, appDefaults, staticFavouritesDefaults, userDefinedFunctionsDefaults) {
	return {
		// resetColours: Setup the default colours including favourite colours
		resetColours: function() {
			// Store the favourite colours, and the uniqueID for the next colour from the defaults
			// provided
			$localstorage.setObject('userDefinedColours', colourDefaults.favouriteColours);
			$localstorage.set('userDefinedColours_uniqueID', colourDefaults.favouriteColoursNextIndex);

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
			$localstorage.set('history_items', appDefaults.maxHistoryItems);
		},

		// resetStatic: Setup the default static favourites
		resetStatic: function() {
			// Store the static favourites, and the uniqueID for the next favourite from the defaults
			// provided
			$localstorage.setObject('staticFavourites', staticFavouritesDefaults.staticFavourites);
			$localstorage.set('staticFavourites_uniqueID', staticFavouritesDefaults.staticFavouritesNextIndex);

			// The static favourites modal temporarily stores data - delete it
			$localstorage.delete('staticFavourite');
		},

		// resetUserDefinedFunctions: Setup the user defined functions
		resetUserDefinedFunctions: function() {
			// Store the user defined functions, and the uniqueID for the next function from the defaults
			// provided
			$localstorage.setObject('userDefinedFunctions', userDefinedFunctionsDefaults.userDefinedFunctions);
			$localstorage.set('userDefinedFunctions_uniqueID', userDefinedFunctionsDefaults.userDefinedFunctionsNextIndex);
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
