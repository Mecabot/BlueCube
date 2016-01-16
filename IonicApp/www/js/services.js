var app = angular.module('BlueCube.services', [])

// History Service that manages the history of commands
app.service('HistoryService', function($localstorage) {
	// Array that holds each of the commands that have previously been sent to the cube
	var commands;

	// We require a UniqueID for each command, so this variable tracks it
	var uniqueID;

	if ($localstorage.getObject('history') != undefined) {
		// Get the previously saved history items
		commands = $localstorage.getObject('history');
	} else {
		// There are no history items saved, so set the unique ID to 0
		commands = [];
		$localstorage.set('history_uniqueID', 0);
	}

	// Get the UniqueID that we previously saved
	uniqueID = parseInt($localstorage.get('history_uniqueID'));

	// Return a list of all history commands
	this.list = function() {
		if ($localstorage.getObject('history') != undefined) {
			// Get the previously saved history items
			commands = $localstorage.getObject('history');
		} else {
			// There are no history items saved
			commands = [];
		}

		// Returns the array of history items
		return commands;
	};

	// Get a specific history item
	this.get = function(historyID) {
		for (var i in commands) {
			if (commands[i].id == historyID) {
				// Loop through all of the history until the item matches the required one,
				// and send the specific command back to the requestor
				return historyID[i].cmd;
			}
		}
	};

	// Add an item to the history
	this.add = function(command) {
		// Track the maximum of history items we should have
		var maxHistoryItems;

		// Get the previously saved maximum number of history items, otherwise use the
		// default number.
		if ($localstorage.get('history_items') != undefined) {
			maxHistoryItems = parseInt($localstorage.get('history_items'));
		} else {
			maxHistoryItems = 100;
		}

		// Build the item to add, using the passed in command and the uniqueID we have
		var historyItem = 	{
								id: uniqueID,
								cmd: command,
							};

		// Determine if we have reached the maximum number of items we should have
		if (commands.length >= maxHistoryItems) {
			for(var i = maxHistoryItems - 1; i <= commands.length; i++) {
				// Working from the oldest to newest item in the array, remove one item from
				// the end until there are only the maximum number of items - 1 in the array
				commands.pop();
			}
		}

		// Add the new item to the beginning of the array, and save it for future use
		commands.unshift(historyItem);
		$localstorage.setObject('history', commands);

		// Increment the unique ID, and save it for future reference
		uniqueID = uniqueID + 1;
		$localstorage.set('history_uniqueID', uniqueID);
	};

	// Delete a given item from the history
	this.delete = function(historyID) {
		for (var i in commands) {
			if (commands[i].id == historyID) {
				// Loop through all of the history until the item matches the required one,
				// and then delete it
				commands.splice(i, 1);
			}
		}

		// Save the updated array of history items
		$localstorage.setObject('history', commands);
	};

	// Reorder the array of history items
	this.reorder = function(item, fromIndex, toIndex) {
		// Move the selected item from it's current location to the new location
		commands.splice(fromIndex, 1);
		commands.splice(toIndex, 0, item);

		// Save the updated array of history items
		$localstorage.setObject('history', commands);
	};
});

// Colour Service that manages the favourites colours list
app.service('ColourService', function($localstorage, $defaults, colourDefaults) {
	// We require a UniqueID for each command, so this variable tracks it
	var uniqueID;

	// Array that holds each of the favourite colours that have previously been set
	var colours;

	var selectedColour = $localstorage.get('selectedColour', colourDefaults.defaultColour);
	var otherColour = $localstorage.get('otherColour', colourDefaults.otherColour);

	if ($localstorage.getObject('userDefinedColours') == undefined) {
		// No previously defined colours exist, so call our reset function to set the default
		// favourites
		$defaults.resetColours();
	}

	// Get the saved colour favourites and unique id
	colours = $localstorage.getObject('userDefinedColours');
	uniqueID = parseInt($localstorage.get('userDefinedColours_uniqueID'));

	// Return a list of all favourite colours
	this.list = function() {
		if ($localstorage.getObject('userDefinedColours') == undefined) {
			// No previously defined colours exist, so call our reset function to set
			// the default favourites
			$defaults.resetColours();
		}

		// Get the previously saved colour favourites
		colours = $localstorage.getObject('userDefinedColours');

		// Return the array of colours
		return colours;
	};

	// Get a specific favourite colour
	this.get = function(colourId) {
		for (var i in colours) {
			if (colours[i].id == colourId) {
				// Loop through all of the favourite colours until the item matches the
				// required one, and send it back to the requestor
				return colours[i];
			}
		}
	};

	// Add an selected colour to the favourites
	this.add = function(userDefinedColour) {
		// Build the item to add, using the passed in colour and the uniqueID we have
		var newColour =	{
							id: uniqueID,
							hex: userDefinedColour,
						};

		// Add the new colour to the array of favourites, and save it for future use
		colours.push(newColour);
		$localstorage.setObject('userDefinedColours', colours);

		// Increment the unique ID, and save it for future reference
		uniqueID = uniqueID + 1;
		$localstorage.set('userDefinedColours_uniqueID', uniqueID);
	};

	// Delete a given colour from the favourites
	this.delete = function(colourId) {
		for (var i in colours) {
			if (colours[i].id == colourId) {
				// Loop through all of the colour favourites until the item matches the
				// required one, and then delete it
				colours.splice(i, 1);
			}
		}

		// Save the updated array of colour favourites
		$localstorage.setObject('userDefinedColours', colours);
	};

	// Reorder the array of colours
	this.reorder = function(item, fromIndex, toIndex) {
		// Move the selected item from it's current location to the new location
		commands.splice(fromIndex, 1);
		commands.splice(toIndex, 0, item);

		// Save the updated array of colour favourites
		$localstorage.setObject('userDefinedColours', colours);
	};

	this.getSelectedColour = function() {
		return selectedColour;
	};

	this.getOtherSelectedColour = function() {
		return otherColour;
	};

	this.setSelectedColour = function(colour, selectedFromFavourites) {
		if (!selectedFromFavourites) {
			$localstorage.set('selectedColour', colour);
		}

		selectedColour = colour;
	};

	this.setOtherSelectedColour = function(colour, selectedFromFavourites) {
		if (!selectedFromFavourites) {
			$localstorage.set('otherColour', colour);
		}

		otherColour = colour;
	};

});

// Static Favourites Service that manages the static favourites list, and the commands that it
// represents
app.service('StaticFavouritesService', function($localstorage, $defaults) {
	// Array that holds each of the static favourites that have been set
	var staticFavourites;

	// We require a UniqueID for each command, so this variable tracks it
	var uniqueID;

	if ($localstorage.getObject('staticFavourites') == undefined) {
		// No previously defined static favourites exist, so call our reset function to set
		// the default favourites
		$defaults.resetStatic();
	}

	// Get the saved static favourites and unique id
	staticFavourites = $localstorage.getObject('staticFavourites');
	uniqueID = parseInt($localstorage.get('staticFavourites_uniqueID'));

	// Return a list of all static favourites
	this.list = function() {
		if ($localstorage.getObject('staticFavourites') == undefined) {
			// No previously defined static favourites exist, so call our reset function to set
			// the default favourites
			$defaults.resetStatic();
		}

		// Get the saved static favourites
		staticFavourites = $localstorage.getObject('staticFavourites');

		// Return the array of static favourites
		return staticFavourites;
	};

	// Get a specific static favourite
	this.get = function(id) {
		for (var i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				return staticFavourites[i].cmds;
			}
		}
	};

	// Add a static favourite to the array of
	this.add = function(name, cmds) {
		// Build the item to add, using the passed in name, commands and the uniqueID we have
		var favouriteItem =	{
								id: uniqueID,
								name: name,
								cmds: cmds,
							};

		// Add the new static favourite to the array of static favourites, and save it for
		// future use
		staticFavourites.push(favouriteItem);
		$localstorage.setObject('staticFavourites', staticFavourites);

		// Increment the unique ID, and save it for future reference
		uniqueID = uniqueID + 1;
		$localstorage.set('staticFavourites_uniqueID', uniqueID);
	};

	// Delete a given static favourite from the static favourites
	this.delete = function(id) {
		for (var i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				// Loop through all of the static favourites until the item matches the
				// required one, and then delete it
				staticFavourites.splice(i, 1);
			}
		}

		// Save the updated array of static favourites
		$localstorage.setObject('staticFavourites', staticFavourites);
	};

	// Reorder the array of static favourites
	this.reorder = function(item, fromIndex, toIndex) {
		// Move the selected item from it's current location to the new location
		staticFavourites.splice(fromIndex, 1);
		staticFavourites.splice(toIndex, 0, item);

		// Save the updated array of static favourites
		$localstorage.setObject('staticFavourites', staticFavourites);
	};
});

// User Defined Service that manages the user defined functions list
app.service('UserDefinedService', function($localstorage, $defaults) {
	// Array that holds each of user defined functions that have been set
	var userDefinedFunctions;

	// We require a UniqueID for each command, so this variable tracks it
	var uniqueID;

	if ($localstorage.getObject('userDefinedFunctions') == undefined) {
		// No previously defined user defined functions exist, so call our reset function to set
		// the default user defined functions
		$defaults.resetUserDefinedFunctions();
	}

	// Get the saved user defined functions and unique id
	userDefinedFunctions = $localstorage.getObject('userDefinedFunctions');
	uniqueID = parseInt($localstorage.get('userDefinedFunctions_uniqueID'));

	// Return a list of all user defined functions
	this.list = function() {
		if ($localstorage.getObject('userDefinedFunctions') == undefined) {
			// No previously defined user defined functions exist, so call our reset function to set
			// the default user defined functions
			$defaults.resetUserDefinedFunctions();
		}

		// Get the saved user defined functions
		userDefinedFunctions = $localstorage.getObject('userDefinedFunctions');

		// Return the array of user defined functions
		return userDefinedFunctions;
	};

	// Get a specific user defined function
	this.get = function(id) {
		for (var i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				return userDefinedFunctions[i];
			}
		}
	};

	// Add an selected user defined function to the array of user defined functions
	this.add = function(udf) {
		// Build the item to add, using the passed in user defined function object properties
		// and the uniqueID we have
		var userDefinedItem =	{
									id: uniqueID,
									name: udf.name,
									number: udf.number,
									colourRequired: udf.colourRequired,
									colour: udf.colour,
								};

		// Add the new user defined function to the array of user defined functions, and save it for
		// future use
		userDefinedFunctions.push(userDefinedItem);
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);

		// Increment the unique ID, and save it for future reference
		uniqueID = uniqueID + 1;
		$localstorage.set('userDefinedFunctions_uniqueID', uniqueID);
	};

	// Delete a given user defined function from the user defined functions
	this.delete = function(id) {
		for (var i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				// Loop through all of the user defined functions until the item matches the
				// required one, and then delete it
				userDefinedFunctions.splice(i, 1);
			}
		}

		// Save the updated array of user defined functions
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	};

	// Reorder the array of user defined functions
	this.reorder = function(item, fromIndex, toIndex) {
		// Move the selected item from it's current location to the new location
		userDefinedFunctions.splice(fromIndex, 1);
		userDefinedFunctions.splice(toIndex, 0, item);

		// Save the updated array of user defined functions
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	};
});

// Modal Service that handles the creation, display, and removal of modal windows
// - based on code from https://codepen.io/calendee/pen/DJgkc.
app.service('ModalService', function($ionicModal, $rootScope) {
	// Initialisation function for the modal, that setups the modal and the associated functions
	var init = function(template, $scope) {
		// Use an Angular promise for this function
		var promise;

		// Either use the provided scope or create a new scope for the modal
		$scope = $scope || $rootScope.$new();

		// Setup the modal popup
		promise = 	$ionicModal.fromTemplateUrl(template, {
						scope: $scope,
						animation: 'slide-in-up'
					}).then(function(modal) {
						$scope.modal = modal;
						return modal;
					});

		$scope.openModal = function() {
			// Open the modal window
			$scope.modal.show();
		};

		$scope.closeModal = function() {
			// Close the modal window
			$scope.modal.hide();
		};

		$scope.$on('$destroy', function() {
			// Remove the modal from the scope, avoiding a memory leak
			$scope.modal.remove();
		});

		// Return the promise
		return promise;
	};

	// Expose the init function to the rest of the app
	return {
		init: init
	};
});
