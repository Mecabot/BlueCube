/*
 *  File:		defaults.js
 *  Purpose:	Default values, settings and initial values for the app
 *  Author:		Adam Reed (adam@secretcode.ninja)
 *  Licence:	BSD 3-Clause Licence
 */

var app = angular.module('BlueCube.defaults', [])

// Default settings for key parts of the app
app.constant('appDefaults', {
	// Whether to attempt to auto connect to the cube ("true" | "false")
	autoConnect: "false",

	// Whether to send colour changes automatically in the All view ("true" | "false")
	liveAllColourChanges: "true",

	// Minimum and Maximum allowable history items (I recommend keeping this between 20 and 200)
	minAllowedHistoryItems: 20,
	maxAllowedHistoryItems: 200,

	// Maximum number of items to keep in the history (it should be between minAllowedHistoryItems
	// and maxAllowedHistoryItems set above)
	maxHistoryItems: 100,

	// Items for RSSI Signal Strength Indicator, that set the bounds for what we consider full
	// signal strength and at where we consider we have no signal.
	signalConsideredFullStrengthAt: -30,
	signalConsideredNoStrengthAt: -100,
});

// Bluetooth LE Characteristic and search time
app.constant('bleDefaults', {
	// Characteristics for the Nordic's UART Service as used by the Adafruit Bluefruit LE devices
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
	txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',	// transmit is from the phone's perspective
	rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',	// receive is from the phone's perspective
	searchTime: 3	// seconds
});

// Default settings for Colours within the app
app.constant('colourDefaults', {
	// The default colour used for the colour picker if the user hasn't previously selected a
	// colour
	defaultColour: '00d1ff',

	// The default colour used for the second colour picker (if required) if the user hasn't
	// previously selected a colour
	otherColour: 'f80ed1',

	// The default favourite colours. These match the defined colours in the Cube Library, but there
	// is no reason that they can't be changed
	favouriteColours:	[
							{
								id: 1,
								hex: '000000',	// Black
							},
							{
								id: 2,
								hex: '0000FF',	// Blue
							},
							{
								id: 3,
								hex: '00ff00',	// Green
							},
							{
								id: 4,
								hex: 'ff4500',	// Orange
							},
							{
								id: 5,
								hex: 'ff1444',	// Pink
							},
							{
								id: 6,
								hex: 'ff00ff',	// Purple
							},
							{
								id: 7,
								hex: 'ff0000',	// Red
							},
							{
								id: 8,
								hex: 'ffffff',	// White
							},
							{
								id: 9,
								hex: 'ffff00',	// Yellow
							}
						],

	// To ensure that each favourite colour has a unique ID, we store the next ID that should
	// be used. It's 10 because we have 9 favourites above already defined.
	favouriteColoursNextIndex: 10,
});

// Default settings for the Set, Copy and Move Plane Views
app.constant('axisDefaults', {
	// Default axis to select ('X' | 'Y' | 'Z')
	axis: 'X',

	// The first or only offset to use ('0' | '1' | '2' | '3')
	fromOffset: '0',

	// The second offset to use ('0' | '1' | '2' | '3')
	toOffset: '1',
});

// Define the defaults for the Box and Sphere views
app.constant('graphicsDefaults', {
	/* boxStyle:	0 = Solid
					1 = Walls Only
					2 = Edges Only
					3 = Walls Filled
					4 = Edges Filled */
	boxStyle: '0',

	/* sphereStyle:	0: Walls Only
					1: Solid */
	sphereStyle: '0',

	// sphereSize:	3 or 4
	sphereSize: '3',
});

// Initially provided static favourites
app.constant('staticFavouritesDefaults', {
	// A sample set of static favourites to get the user started
	staticFavourites: 	[
							{
								id: 0,
								name: "Rainbow",
								cmds:	[
											{"id":1,"cmd":"set 000 180064;"},
											{"id":2,"cmd":"set 011 0C0032;"},
											{"id":3,"cmd":"set 022 060019;"},
											{"id":4,"cmd":"set 033 03000C;"},
											{"id":5,"cmd":"set 010 380044;"},
											{"id":6,"cmd":"set 021 1C0022;"},
											{"id":7,"cmd":"set 032 0E0011;"},
											{"id":8,"cmd":"set 133 070008;"},
											{"id":9,"cmd":"set 020 580024;"},
											{"id":10,"cmd":"set 031 2C0012;"},
											{"id":11,"cmd":"set 132 160009;"},
											{"id":12,"cmd":"set 233 0B0004;"},
											{"id":13,"cmd":"set 030 780004;"},
											{"id":14,"cmd":"set 131 3C0002;"},
											{"id":15,"cmd":"set 232 1E0001;"},
											{"id":16,"cmd":"set 333 0F0000;"},
											{"id":17,"cmd":"set 130 641800;"},
											{"id":18,"cmd":"set 231 320C00;"},
											{"id":19,"cmd":"set 332 190600;"},
											{"id":20,"cmd":"set 323 0C0300;"},
											{"id":21,"cmd":"set 230 443800;"},
											{"id":22,"cmd":"set 331 221C00;"},
											{"id":23,"cmd":"set 322 110E00;"},
											{"id":24,"cmd":"set 313 080700;"},
											{"id":25,"cmd":"set 330 245800;"},
											{"id":26,"cmd":"set 321 122C00;"},
											{"id":27,"cmd":"set 312 091600;"},
											{"id":28,"cmd":"set 303 040B00;"},
											{"id":29,"cmd":"set 320 047800;"},
											{"id":30,"cmd":"set 311 023C00;"},
											{"id":31,"cmd":"set 302 011E00;"},
											{"id":32,"cmd":"set 203 000F00;"},
											{"id":33,"cmd":"set 310 006418;"},
											{"id":34,"cmd":"set 301 00320C;"},
											{"id":35,"cmd":"set 202 001906;"},
											{"id":36,"cmd":"set 103 000C03;"},
											{"id":37,"cmd":"set 300 004438;"},
											{"id":38,"cmd":"set 201 00221C;"},
											{"id":39,"cmd":"set 102 00110E;"},
											{"id":40,"cmd":"set 003 000807;"},
											{"id":41,"cmd":"set 200 002458;"},
											{"id":42,"cmd":"set 101 00122C;"},
											{"id":43,"cmd":"set 002 000916;"},
											{"id":44,"cmd":"set 013 00040B;"},
											{"id":45,"cmd":"set 100 000478;"},
											{"id":46,"cmd":"set 001 00023C;"},
											{"id":47,"cmd":"set 012 00011E;"},
											{"id":48,"cmd":"set 023 00000F;"},
											{"id":49,"cmd":"set 110 180064;"},
											{"id":50,"cmd":"set 121 0C0032;"},
											{"id":51,"cmd":"set 222 060019;"},
											{"id":52,"cmd":"set 213 03000C;"},
											{"id":53,"cmd":"set 120 780004;"},
											{"id":54,"cmd":"set 221 3C0002;"},
											{"id":55,"cmd":"set 212 1E0001;"},
											{"id":56,"cmd":"set 113 0F0000;"},
											{"id":57,"cmd":"set 220 245800;"},
											{"id":58,"cmd":"set 211 122C00;"},
											{"id":59,"cmd":"set 112 091600;"},
											{"id":60,"cmd":"set 123 040B00;"},
											{"id":61,"cmd":"set 210 004438;"},
											{"id":62,"cmd":"set 111 00221C;"},
											{"id":63,"cmd":"set 122 00110E;"},
											{"id":64,"cmd":"set 223 000807;"}
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
					],

	// To ensure that each static favourite has a unique ID, we store the next ID that should
	// be used. It's 4 because we have 3 static favourites above already defined.
	staticFavouritesNextIndex: 4,
});


// Initially provided user defined functions
app.constant('userDefinedFunctionsDefaults', {
	// Provide a sample set of user defined functions to match those that ship with the included
	// Arduino sketch
	userDefinedFunctions:	[
								{
									id: 0,
									name: "Pulse Blue",
									number: 1,
									colourRequired: true,
									colour: "0000ff",
								},
								{
									id: 1,
									name: "Pulse Green",
									number: 1,
									colourRequired: true,
									colour: "00ff00",
								},
								{
									id: 2,
									name: "Wave",
									number: 2,
									colourRequired: true,
									colour: "fc00ff",
								},
								{
									id: 3,
									name: "ZigZag",
									number: 3,
									colourRequired: true,
									colour: "b7ff00",
								}
							],

	// To ensure that each user defined function has a unique ID, we store the next ID that should
	// be used. It's 4 because we have 3 user defined functions above already defined.
	userDefinedFunctionsNextIndex: 4,
});
