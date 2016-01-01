angular.module('BlueCube.services', [])

.service('HistoryService', function($localstorage) {
  var commands;

  if ($localstorage.getObject('history') != undefined) {
		commands = $localstorage.getObject('history');
	} else {
		commands = [];
	}

	this.list = function() {
		return commands;
	}

	this.get = function(position) {
		return commands[position];
	}

	this.add = function(command) {
    if (commands.length >= 10) {
      commands.pop();
    }
		commands.unshift(command);
		$localstorage.setObject('history', commands);
	}

	this.delete = function(position) {
		commands.splice(position, 1);
		$localstorage.setObject('history', commands);
	}

	this.reorder = function(item, fromIndex, toIndex) {
		commands.splice(fromIndex, 1);
		commands.splice(toIndex, 0, item);
		$localstorage.setObject('history', commands);
	}
})

.service('ColourService', function($localstorage) {
	var uniqueID;
	var colours;

	if ($localstorage.getObject('userDefinedColours') != undefined) {
		colours = $localstorage.getObject('userDefinedColours');
	} else {
		colours = [
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
	}

	uniqueID = parseInt($localstorage.get('userDefinedColours_uniqueID'));

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
