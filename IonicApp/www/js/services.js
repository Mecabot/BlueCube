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
app.service('ColourService', function($localstorage, $defaults) {
	// We require a UniqueID for each command, so this variable tracks it
	var uniqueID;

	// Array that holds each of the favourite colours that have previously been set
	var colours;

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
});

app.service('StaticFavouritesService', function($localstorage, $defaults) {
	var staticFavourites;
	var uniqueID;

	if ($localstorage.getObject('staticFavourites') == undefined) {
		$defaults.resetStatic();
	}

	staticFavourites = $localstorage.getObject('staticFavourites');
	uniqueID = parseInt($localstorage.get('staticFavourites_uniqueID'));

	this.list = function() {
		if ($localstorage.getObject('staticFavourites') == undefined) {
			$defaults.resetStatic();
		}

		staticFavourites = $localstorage.getObject('staticFavourites');

		return staticFavourites;
	};

	this.get = function(id) {
		for (var i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				return staticFavourites[i].cmds;
			}
		}
	};

	this.add = function(name, cmds) {
		var favouriteItem =	{
								id: uniqueID,
								name: name,
								cmds: cmds,
							};
		uniqueID = uniqueID + 1;
		staticFavourites.push(favouriteItem);
		$localstorage.setObject('staticFavourites', staticFavourites);
		$localstorage.set('staticFavourites_uniqueID', uniqueID);
	};

	this.delete = function(id) {
		for (var i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				staticFavourites.splice(i, 1);
			}
		}

		$localstorage.setObject('staticFavourites', staticFavourites);
	};

	this.reorder = function(item, fromIndex, toIndex) {
		staticFavourites.splice(fromIndex, 1);
		staticFavourites.splice(toIndex, 0, item);
		$localstorage.setObject('staticFavourites', staticFavourites);
	};
});

app.service('UserDefinedService', function($localstorage, $defaults) {
	var userDefinedFunctions;
	var uniqueID;

	if ($localstorage.getObject('userDefinedFunctions') == undefined) {
		$defaults.resetUserDefinedFunctions();
	}

	userDefinedFunctions = $localstorage.getObject('userDefinedFunctions');
	uniqueID = parseInt($localstorage.get('userDefinedFunctions_uniqueID'));

	this.list = function() {
		if ($localstorage.getObject('userDefinedFunctions') == undefined) {
			$defaults.resetUserDefinedFunctions();
		}

		userDefinedFunctions = $localstorage.getObject('userDefinedFunctions');

		return userDefinedFunctions;
	};

	this.get = function(id) {
		for (var i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				return userDefinedFunctions[i];
			}
		}
	};

	this.add = function(udf) {
		var userDefinedItem =	{
									id: uniqueID,
									name: udf.name,
									number: udf.number,
									colourRequired: udf.colourRequired,
									colour: udf.colour,
								};
		uniqueID = uniqueID + 1;
		userDefinedFunctions.push(userDefinedItem);
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
		$localstorage.set('userDefinedFunctions_uniqueID', uniqueID);
	};

	this.delete = function(id) {
		for (var i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				userDefinedFunctions.splice(i, 1);
			}
		}

		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	};

	this.reorder = function(item, fromIndex, toIndex) {
		userDefinedFunctions.splice(fromIndex, 1);
		userDefinedFunctions.splice(toIndex, 0, item);
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	};
});
