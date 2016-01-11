var app = angular.module('BlueCube.services', [])

app.service('HistoryService', function($localstorage) {
	var commands;
	var uniqueID;

	if ($localstorage.getObject('history') != undefined) {
		commands = $localstorage.getObject('history');
	} else {
		commands = [];
		$localstorage.set('history_uniqueID', 0);
	}

	uniqueID = parseInt($localstorage.get('history_uniqueID'));

	this.list = function() {
		if ($localstorage.getObject('history') != undefined) {
			commands = $localstorage.getObject('history');
		} else {
			commands = [];
		}

		return commands;
	}

	this.get = function(historyID) {
		for (i in commands) {
			if (commands[i].id == historyID) {
				return historyID[i].cmd;
			}
		}
	}

	this.add = function(command) {
		var maxHistoryItems;

		if ($localstorage.get('history_items') != undefined) {
			maxHistoryItems = parseInt($localstorage.get('history_items'));
		} else {
			maxHistoryItems = 100;
		}

		var historyItem = 	{
								id: uniqueID,
								cmd: command,
							};

		if (commands.length >= maxHistoryItems) {
			for(i = maxHistoryItems - 1; i <= commands.length; i++) {
				commands.pop();
			}
		}

		uniqueID = uniqueID + 1;
		commands.unshift(historyItem);
		$localstorage.setObject('history', commands);
		$localstorage.set('history_uniqueID', uniqueID);
	}

	this.delete = function(historyID) {
		for (i in commands) {
			if (commands[i].id == historyID) {
				commands.splice(i, 1);
			}
		}

		$localstorage.setObject('history', commands);
	}

	this.reorder = function(item, fromIndex, toIndex) {
		commands.splice(fromIndex, 1);
		commands.splice(toIndex, 0, item);
		$localstorage.setObject('history', commands);
	}
});

app.service('ColourService', function($localstorage, $defaults) {
	var uniqueID;
	var colours;

	if ($localstorage.getObject('userDefinedColours') == undefined) {
		$defaults.resetColours();
	}

	colours = $localstorage.getObject('userDefinedColours');
	uniqueID = parseInt($localstorage.get('userDefinedColours_uniqueID'));

	this.list = function() {
		if ($localstorage.getObject('userDefinedColours') == undefined) {
			$defaults.resetColours();
		}
		colours = $localstorage.getObject('userDefinedColours');

		return colours;
	}

	this.get = function(colourId) {
		for (i in colours) {
			if (colours[i].id == colourId) {
				return colours[i];
			}
		}
	}

	this.add = function(userDefinedColour) {
		var newColour =	{
							id: uniqueID,
							hex: userDefinedColour,
						};

		uniqueID = uniqueID + 1;
		colours.push(newColour);
		$localstorage.setObject('userDefinedColours', colours);
		$localstorage.set('userDefinedColours_uniqueID', uniqueID);
	}

	this.delete = function(colourId) {
		for (i in colours) {
			if (colours[i].id == colourId) {
				colours.splice(i, 1);
			}
		}

		$localstorage.setObject('userDefinedColours', colours);
	}

	this.reorder = function(item, fromIndex, toIndex) {
		colours.splice(fromIndex, 1);
		colours.splice(toIndex, 0, item);
		$localstorage.setObject('userDefinedColours', colours);
	}
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
	}

	this.get = function(id) {
		for (i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				return staticFavourites[i].cmds;
			}
		}
	}

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
	}

	this.delete = function(id) {
		for (i in staticFavourites) {
			if (staticFavourites[i].id == id) {
				staticFavourites.splice(i, 1);
			}
		}

		$localstorage.setObject('staticFavourites', staticFavourites);
	}

	this.reorder = function(item, fromIndex, toIndex) {
		staticFavourites.splice(fromIndex, 1);
		staticFavourites.splice(toIndex, 0, item);
		$localstorage.setObject('staticFavourites', staticFavourites);
	}
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
	}

	this.get = function(id) {
		for (i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				return userDefinedFunctions[i];
			}
		}
	}

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
	}

	this.delete = function(id) {
		for (i in userDefinedFunctions) {
			if (userDefinedFunctions[i].id == id) {
				userDefinedFunctions.splice(i, 1);
			}
		}

		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	}

	this.reorder = function(item, fromIndex, toIndex) {
		userDefinedFunctions.splice(fromIndex, 1);
		userDefinedFunctions.splice(toIndex, 0, item);
		$localstorage.setObject('userDefinedFunctions', userDefinedFunctions);
	}
});
