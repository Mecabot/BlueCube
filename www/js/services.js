angular.module('BlueCube.services', [])

.service('ColourService', function($q) {
	var uniqueID;
	var colours;

	if (window.localStorage.getItem("userDefinedColours") != undefined) {
		colours = JSON.parse(window.localStorage.getItem("userDefinedColours"));
		console.log('Defined');
		console.log(JSON.stringify(colours));
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

		window.localStorage['userDefinedColours'] = JSON.stringify(colours);
		window.localStorage['userDefinedColours_uniqueID'] = 10;
	}

	uniqueID = parseInt(window.localStorage.getItem("userDefinedColours_uniqueID"));

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
		window.localStorage['userDefinedColours'] = JSON.stringify(colours);
		window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
	}

	this.delete = function(colourId) {
		for (i in colours) {
			if (colours[i].id == colourId) {
				colours.splice(i, 1);
			}
		}

		window.localStorage['userDefinedColours'] = JSON.stringify(colours);
		window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
	}

	this.reorder = function(item, fromIndex, toIndex) {
		colours.splice(fromIndex, 1);
		colours.splice(toIndex, 0, item);
		window.localStorage['userDefinedColours'] = JSON.stringify(colours);
		window.localStorage['userDefinedColours_uniqueID'] = uniqueID;
	}
});
