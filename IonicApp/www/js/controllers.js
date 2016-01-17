/*
 *  File:		controllers.js
 *  Purpose:	Code that manages each of the views and modals, and implements the users choices
 *  Author:		Adam Reed (adam@secretcode.ninja)
 *  Licence:	BSD 3-Clause Licence
 */

var app = angular.module('BlueCube.controllers', [])

// Controller for the application
app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});
});

// Controller for the 'All' page
app.controller('AllCtrl', function($ionicPlatform, $scope, $cubeAction, ColourService, $localstorage, appDefaults) {
	// Get whether the user wishes to send colour updates directly to the cube as they are picked,
	// or whether they want to want until they specifically send the colour.
	if ($localstorage.get('liveAllColourChanges', appDefaults.liveAllColourChanges) == "true") {
		// Either no setting was set, or the user wants to make live changes

		// Indicate that we are in live mode
		$scope.live = true;

		// Hide the button to manually send colour changes
		$scope.useSelectedColourButton = false;
	} else {
		// Indicate that we are not in live mode
		$scope.live = false;

		// Show the button to manually send colour changes
		$scope.useSelectedColourButton = true;
	}

	// Flag that deleting and re-ordering of the favourite colours list is off by default
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		// Get the list of favourite colours and store it in the colours array before the
		// page is loaded.
		$scope.colours = ColourService.list();
	});

	$ionicPlatform.ready(function() {
		// Get the initial colour to set the colour selector to
		var initialColour = $localstorage.get('selectedColour', ColourService.getSelectedColour());

		// Make the colour available to the view
		$scope.hexColour = initialColour;

		// Set the colour selector to the initial colour
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};

		// Make the list of colour favourites available to the view
		$scope.colours = ColourService.list();

		// What for when the user selects a new colour via the colour picker
		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				// The colour has changed so track it

				// The colour is returned as #XXXXXX whereas we don't required the #,
				// so get only the hex part of the colour string
				$scope.hexColour = newValue.substring(1);

				// Save the choice for future reference
				ColourService.setSelectedColour($scope.hexColour, false);

				if ($scope.live == true) {
					// We are in live mode, so build the message to send to the cube
					var message = "all " + $scope.hexColour + ";";

					// Submit the message to the cube, and add it to the history
					$cubeAction.sendMessage(message, true);
				}
			}
		});
	});

	$scope.liveChanged = function() {
		// Called whenever the "Automatically Change" toggle is changed

		if ($scope.live == false) {
			// User wants to enable live mode

			// Flag we are in live mode, and save this choice
			$scope.live = true;
			$localstorage.set('liveAllColourChanges', 'true');

			// Hide the button to manually change the colour
			$scope.useSelectedColourButton = false;
		} else {
			// User wants manual mode

			// Flag we are in manual mode, and save this choice
			$scope.live = false;
			$localstorage.set('liveAllColourChanges', 'false');

			// Show the button to manually change the colour
			$scope.useSelectedColourButton = true;
		}
	};

	$scope.sendSelectedColour = function(selectedColour) {
		// The user has either clicked one of the colour favourites, or manually
		// wishes to change the colour

		if (selectedColour == null) {
			// No colour was provided, so it's a manual colour change. As such use the
			// colour that has been selected via the colour picker
			selectedColour = $scope.hexColour;
		}

		// Build the message to send to the cube
		var message = "all " + selectedColour + ";";

		// Submit the message to the cube, and add it to the history
		$cubeAction.sendMessage(message, true);
	};

	$scope.addUserColour = function () {
		// Save the currently selected colour to the favourites list
		ColourService.add($scope.hexColour);
	};

	$scope.deleteUserColour = function (id) {
		// Delete the colour favourite with the provided id.
		ColourService.delete(id);
	};

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		// Reorder the favourite colours list
		ColourService.reorder(item, fromIndex, toIndex);
	};
});

// Controller for the 'Shift' page
app.controller('ShiftCtrl', function($ionicPlatform, $scope, $cubeAction) {
	$scope.up = function () {
		// Up button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift Z +;', true);
	};

	$scope.down = function () {
		// Down button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift Z -;', true);
	};

	$scope.left = function () {
		// Left button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift X -;', true);
	};

	$scope.right = function () {
		// Right button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift X +;', true);
	};

	$scope.back = function () {
		// Back button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift Y +;', true);
	};

	$scope.forward = function () {
		// Forward button clicked, so submit the appropriate message to the cube,
		// and add it to the history
		$cubeAction.sendMessage('shift Y -;', true);
	};
});

// Controller for the 'Set' page
app.controller('SetCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService) {
	// Array for tracking each of the LEDs in the cube
	$scope.cube = [];

	$ionicPlatform.ready(function() {
		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$scope.setLED = function (id) {
		// Called when the user clicks on one of the LEDs represented by the grid

		// Default to using black for an LED, unless the user has actually turned it on
		var colourToUse = "BLACK";
		if ($scope.cube[id] == true) {
			// LED was turned on, so get the selected colour
			colourToUse = ColourService.getSelectedColour();
		}

		// Build the message to send, translating the LEDs number into it's coordinates, and
		// then submit the message to the cube (adding it to the history)
		var message = "set " + $cubeAction.lookupCoords(id) + " " + colourToUse + ";";
		$cubeAction.sendMessage(message, true);
	};
});

// Controller for the 'Next' page
app.controller('NextCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService) {
	$ionicPlatform.ready(function() {
		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$scope.next = function () {
		// Called when the user clicks the "Next" button

		// Get the colour that the user has selected
		var colourToUse = ColourService.getSelectedColour();

		// Build the message to send, then submit the message to the cube
		// (adding it to the history)
		var message = "next " + colourToUse + ";";
		$cubeAction.sendMessage(message, true);
	};
});

// Controller for the 'Set Plane' page
app.controller('SetPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, axisDefaults) {
	$ionicPlatform.ready(function() {
		// Set the default initial axis and offset
		$scope.values = {
			axis: axisDefaults.axis,
			offset: axisDefaults.fromOffset,
		};

		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$scope.setPlane = function() {
		// Build the message to send, then submit the message to the cube (adding it to the history)
		var message = "setplane " + $scope.values.axis + " " + $scope.values.offset + " " + $scope.selectedColour + ";";
		$cubeAction.sendMessage(message, true);
	};
});

// Controller for the 'Copy Plane' page
app.controller('CopyPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, axisDefaults) {
	$ionicPlatform.ready(function() {
		// Set the default initial axis and start and destination offset
		$scope.values = {
			axis: axisDefaults.axis,
			fromOffset: axisDefaults.fromOffset,
			toOffset: axisDefaults.toOffset,
		};
	});

	$scope.copyPlane = function() {
		// Build the message to send, then submit the message to the cube (adding it to the history)
		var message = "copyplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + ";";
		$cubeAction.sendMessage(message, true);
	};
})

// Controller for the 'Move Plane' page
.controller('MovePlaneCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, axisDefaults) {
	$ionicPlatform.ready(function() {
		// Set the default initial axis and start and destination offset
		$scope.values = {
			axis: axisDefaults.axis,
			fromOffset: axisDefaults.fromOffset,
			toOffset: axisDefaults.toOffset,
		};

		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$scope.movePlane = function() {
		// Build the message to send, then submit the message to the cube (adding it to the history)
		var message = "moveplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + " " + $scope.selectedColour + ";";
		$cubeAction.sendMessage(message, true);
	};
});

// Controller for the 'Line' page
app.controller('LineCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, $cordovaDialogs) {
	// Array for tracking each of the LEDs in the cube
	$scope.cube = [];

	$ionicPlatform.ready(function() {
		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$scope.drawLine = function() {
		// Called when the user wishes to draw a line between two points

		// Start to declare the message to send to the cube
		var message = "line ";

		// Store the selected coordinates
		var coords = [];

		// Counter for how many points the user selected
		var selected = 0;
		for (var i = 0; i <= 64; i++) {
			// Find the point(s) that the user selected
			if ($scope.cube[i] == true) {
				// Get the coordinates
				coords[selected] = $cubeAction.lookupCoords(i);

				// Increment the counter for found points
				selected = selected + 1;
			}
		}

		if (selected == 2) {
			// Only 2 points were selected - so draw the line

			// Clear the selected points
			for (var i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			/* There is a bug in the Cube's API, where when you draw a line, in particular cases
			 * what you would consider the end point needs to be the start point, otherwise it failes
			 * to draw.
			 *
			 * For example, selecting 010 030 works, but 030 010 does not even though they should
			 * both result in all of the LEDs being lit.
			 *
			 * The following code set's up the first and second points, and then reverses them
			 * if it finds the examples where the Cube API fails.
			 */
			firstPoint = coords[0];
			secondPoint = coords[1];

			if (parseInt(coords[0].charAt(1)) > parseInt(coords[1].charAt(1)) &&
			    parseInt(coords[0].charAt(2)) < parseInt(coords[1].charAt(2))) {
				// Start Y > End Y & Start Z < End Z
				firstPoint = coords[1];
				secondPoint = coords[0];
			}

			if (parseInt(coords[0].charAt(0)) > parseInt(coords[1].charAt(0)) &&
			    parseInt(coords[0].charAt(1)) == parseInt(coords[1].charAt(1))) {
				// Start X > End X & Start Y == End Y
				firstPoint = coords[1];
				secondPoint = coords[0];
			}

			if (parseInt(coords[0].charAt(0)) > parseInt(coords[1].charAt(0)) &&
			    parseInt(coords[0].charAt(2)) == parseInt(coords[1].charAt(2))) {
				// Start X > End X & Start Z == End Z
				firstPoint = coords[1];
				secondPoint = coords[0];
			}

			if (parseInt(coords[0].charAt(1)) > parseInt(coords[1].charAt(1)) &&
			    parseInt(coords[0].charAt(0)) == parseInt(coords[1].charAt(0))) {
				// Start Y > End Y & Start X == End X
				firstPoint = coords[1];
				secondPoint = coords[0];
			}

			// Add the new coordinates to the message to send to the cube
			message = message + firstPoint + " " + secondPoint + " ";

			// Finish the message for the cube by getting the selected colour, and sending it
			// to the cube (and add it to the history)
			message = message + $scope.selectedColour + ";";
			$cubeAction.sendMessage(message, true);
		} else {
			// More or less than 2 points were selected, so tell the user to only select 2
			$cordovaDialogs.alert('Please select only 2 points', 'Line', 'OK');
		}
	};
});

// Controller for the 'Box' page
app.controller('BoxCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, $cordovaDialogs, graphicsDefaults) {
	// Array for tracking each of the LEDs in the cube
	$scope.cube = [];

	// Track whether the user is trying to select the main colour, or the secondary colour used for some options
	$scope.secondaryColourSelector = false;

	// Variable to store previous colour choices to work around having two colour pickers instead of just one
	var cachedColour = "";

	$ionicPlatform.ready(function() {
		// Set the default initial box style
		$scope.style = {
			boxStyle: graphicsDefaults.boxStyle,
		};

		// Get the users last selected colour, and the last "other" selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
		$scope.otherColour = ColourService.getOtherSelectedColour();

		// Hide the button to pick the second colour by default
		$scope.showSecontaryColour = false;
	});

	// Open the colour picker for the primary colour
	$scope.openModalPrimary = function() {
		// Flag that we are picking the primary colour
		$scope.secondaryColourSelector = false;

		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Open the colour picker for the secondary colour
	$scope.openModalSecondary = function() {
		// Flag that we are picking the secondary colour
		$scope.secondaryColourSelector = true;

		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colours that was selected regardless of which modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
		$scope.otherColour = ColourService.getOtherSelectedColour();
	});

	$scope.styleSelection = function() {
		// Called when the user changes the selected value in the style selector

		if (parseInt($scope.style.boxStyle) <= 2) {
			// Style 0, 1 and 2 (Solid, Walls or Edges only) only have a single colour,
			// so don't show the button for selecting the secondary colour
			$scope.showSecontaryColour = false;
		} else {
			// Style 3 and 4 (Walls or Edges filled) require two colours, so show the button
			// for selecting the secondary colour
			$scope.showSecontaryColour = true;
		}
	};

	$scope.drawBox = function() {
		// Called when the user wishes to draw a box between two points

		// Start to declare the message to send to the cube
		var message = "box ";

		// Store the selected coordinates
		var coords = [];

		// Track our calculated coordinates
		var firstPoint = '';
		var secondPoint = '';

		// Counter for how many points the user selected
		var selected = 0;
		for (var i = 0; i <= 64; i++) {
			// Find the point(s) that the user selected
			if ($scope.cube[i] == true) {
				// Get the coordinates
				coords[selected] = $cubeAction.lookupCoords(i);

				// Increment the counter for found points
				selected = selected + 1;
			}
		}

		if (selected == 2) {
			// Only 2 points were selected - so draw the box

			// Clear the selected points
			for (var i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			/* There is a bug in the Cube's API, where when you draw a box, it needs to
			 * start at the smallest coordinate to the largest.
			 *
			 * For example, selecting 000 333 works, but 300 033 does not even though they should
			 * both result in all of the LEDs being lit.

			 * The following code looks at the X, then Y, and finally Z value, and finds the lowest
			 * one, which it assigns to the first point, and the highest to the second point. This
			 * results in potentially different coordinates being used then what the user picked, but
			 * achieves the results they desired.
			 */
			for (var i = 0; i <= 2; i++) {
				if (parseInt(coords[0].charAt(i)) <= parseInt(coords[1].charAt(i))) {
					firstPoint = firstPoint + coords[0].charAt(i);
					secondPoint = secondPoint + coords[1].charAt(i);
				} else {
					firstPoint = firstPoint + coords[1].charAt(i);
					secondPoint = secondPoint + coords[0].charAt(i);
				}
			}

			// Add the new coordinates to the message to send to the cube
			message = message + firstPoint + " " + secondPoint + " ";

			// Add the primary colour, and selected style to the message to send to the cube
			message = message + $scope.selectedColour + " " + $scope.style.boxStyle;
			if (parseInt($scope.style.boxStyle) <= 2) {
				// End the message for the cube as it doesn't require any more info, and send it along
				// adding the message to the history
				message = message + ";";
				$cubeAction.sendMessage(message, true);
			} else {
				// Add the secondary colour as it is required, and send it along to the cube adding
				//the message to the history
				message = message + " " + $scope.otherColour + ";";
				$cubeAction.sendMessage(message, true);
			}
		} else {
			// More or less than 2 points were selected, so tell the user to only select 2
			$cordovaDialogs.alert('Please select only 2 points', 'Box', 'OK');
		}
	};
});

// Controller for the 'Sphere' page
app.controller('SphereCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, $cordovaDialogs, graphicsDefaults) {
	// Array for tracking each of the LEDs in the cube
	$scope.cube = [];

	// Track whether the user is trying to select the main colour, or the secondary colour used for some options
	$scope.secondaryColourSelector = false;

	// Variable to store previous colour choices to work around having two colour pickers instead of just one
	var cachedColour = "";

	$ionicPlatform.ready(function() {
		// Set the default initial sphere style and size
		$scope.style = {
			sphereStyle: graphicsDefaults.sphereStyle,
			sphereSize: graphicsDefaults.sphereSize,
		};

		// Get the users last selected colour, and the last "other" selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
		$scope.otherColour = ColourService.getOtherSelectedColour();

		// Hide the button to pick the second colour by default
		$scope.showSecontaryColour = false;
	});

	// Open the colour picker for the primary colour
	$scope.openModalPrimary = function() {
		// Flag that we are picking the primary colour
		$scope.secondaryColourSelector = false;

		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Open the colour picker for the secondary colour
	$scope.openModalSecondary = function() {
		// Flag that we are picking the secondary colour
		$scope.secondaryColourSelector = true;

		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colours that was selected regardless of which modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
		$scope.otherColour = ColourService.getOtherSelectedColour();
	});

	$scope.styleSelection = function() {
		// Called when the user changes the selected value in the style selector

		if (parseInt($scope.style.sphereStyle) == 0) {
			// Style 0 (Walls Only) doesn't require a secondary colour so don't show the button
			$scope.showSecontaryColour = false;
		} else {
			// Style 1 (Solid) has a secondary colour so show the button
				$scope.showSecontaryColour = true;
		}
	};

	$scope.drawSphere = function() {
		// Called when the user wishes to draw a sphere starting from a given point

		// Start to declare the message to send to the cube
		var message = "sphere ";

		// Counter for how many points the user selected
		var selected = 0;
		for (var i = 0; i <= 64; i++) {
			// Find the point(s) that the user selected
			if ($scope.cube[i] == true) {
				selected = selected + 1;

				// Add the coordinate of the point to the message to send to the cube
				message = message + $cubeAction.lookupCoords(i) + " ";
			}
		}

		if (selected == 1) {
			// Only 1 point was selected - so draw the sphere

			// Clear the selected points
			for (var i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			// Add the size and selected style to the message to send to the cube
			message = message + " " + $scope.style.sphereSize + " " + $scope.selectedColour;
			if (parseInt($scope.style.sphereStyle) == 0) {
				// End the message for the cube as it doesn't require any more info, and send it along
				// adding the message to the history
				message = message + ";";
				$cubeAction.sendMessage(message, true);
			} else {
				// Add the secondary colour as it is required, and send it along to the cube adding
				//the message to the history
				message = message + " " + $scope.otherColour + ";";
				$cubeAction.sendMessage(message, true);
			}
		} else {
			// More or less than 1 point were selected, so tell the user to only select 1
			$cordovaDialogs.alert('Please select only 1 point', 'Sphere', 'OK');
		}
	};
});

// Controller for the 'Connect' page
app.controller('ConnectCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading, $localstorage, $ionicSideMenuDelegate, $translate, appDefaults, $interval) {
	// Functions for showing and hiding the loading overlay
	$scope.showConnectionOverlay = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="lines" class="spinner-light"></ion-spinner><br>Connecting to BlueCube'
		});
	};

	$scope.hideConnectionOverlay = function() {
		$ionicLoading.hide();
	};

	// Function to toggle the connect and disconnect button visibility
	$scope.showConnectButton = function(connect) {
		if (connect) {
			// Show the Connect Button
			$scope.connectButton = true;
			$scope.disconnectButton = false;
		} else {
			// Show the Disconnect Button
			$scope.connectButton = false;
			$scope.disconnectButton = true;
		}

		// Make sure that the progress overlay isn't shown if we are changing the connect
		// or disconnect button state
		$scope.hideConnectionOverlay();
	};

	// Function to Connect to the BlueCube
	$scope.connect = function() {
		// Show the progress overlay
		$scope.showConnectionOverlay();

		// Unhide the log text
		$scope.hideLogText = false;

		// Check if Bluetooth is enabled
		$scope.logText = "Starting Connection Procedures<br>";
		$cordovaBluetoothSerial.isEnabled().then(
			function() {
				// Bluetooth is enabled, so inform the user
				$scope.logText = $scope.logText + "Bluetooth is enabled...<br>";

				// Find possible devices to connect to
				$scope.logText = $scope.logText + "Searching for Bluetooth Devices<br>";
				var bluetoothDeviceID = null; // Tracker for the device to connect to

				$cordovaBluetoothSerial.list().then(
					function(peripherals) {
						// Search for devices is complete
						if (peripherals.length > 0) {
							// Items found, so list Bluetooth Devices (that the library knows about)
							$scope.logText = $scope.logText + JSON.stringify(peripherals) + "<br>";

							// Get the first device that we find's ID.
							bluetoothDeviceID = peripherals[0].id;

							// Connect to the device
							$cordovaBluetoothSerial.connect(bluetoothDeviceID).then(
								function() {
									// Successfully connected to cube
									$scope.logText = "BlueCube (" + bluetoothDeviceID + ") is Connected<br>";

									// Save the ID of the cube we connected to
									$localstorage.set('bluetoothUUID', bluetoothDeviceID);

									// Disable the connect button, and enable the disconnect button
									$scope.showConnectButton(false);

									// Open the side menu so that the user can choose where they want to go
									$ionicSideMenuDelegate.toggleLeft();
								},
								function() {
									// Failed to connect
									$scope.logText = "ERROR: Failed to connect to BlueCube (" + bluetoothDeviceID + ")<br>";

									// Enable the connect button so the user can try again,
									// and disable the disconnect button
									$scope.showConnectButton(true);
								}
							);
						} else {
							// No devices found
							$scope.logText = "Error: No BlueCube found to connect to<br>";

							// Enable the connect button so the user can try again,
							// and disable the disconnect button
							$scope.showConnectButton(true);
						}
					},
					function(reason) {
						// Error finding Bluetooth devices.
						$scope.logText = "ERROR: Listing Bluetooth Devices Failed: " + reason + "<br>";

						// Enable the connect button so the user can try again,
						// and disable the disconnect button
						$scope.showConnectButton(true);
					}
				);
			},
			function() {
				// Bluetooth is not enabled
				$scope.logText = "ERROR: Bluetooth is *NOT* enabled. Please enable it and try again.<br>";

				// Enable the connect button so the user can try again,
				// and disable the disconnect button
				$scope.showConnectButton(true);
			}
		);
	};

	// Function to Disconnect from the BlueCube
	$scope.disconnect = function() {
		$cordovaBluetoothSerial.disconnect().then(
			function() {
				// Disconnect was sucessfull
				$scope.logText = "Disconnected from BlueCube (" + $localstorage.get('bluetoothUUID') + ")<br>";

				// Enable the connect button, and hide the disconnect button
				$scope.showConnectButton(true);
			},
			function(error) {
				// Couldn't disconnect
				$scope.logText = "ERROR: Failed to disconnect: " + error + "<br>";

				// Leave the disconnect button visable
				$scope.showConnectButton(false);
			}
		);
	};

	// Function to setup the state of the view based on our connection status
	$scope.checkConnected = function() {
		// Check current connection status
		$cordovaBluetoothSerial.isConnected().then(
			function() {
				// Connected
				$scope.logText = "BlueCube (" + $localstorage.get('bluetoothUUID') + ") is Connected<br>";

				// Show disconnect button, and hide connect button
				$scope.showConnectButton(false);
			},
			function() {
				// Disconnected
				$scope.logText = "Not connected to a BlueCube<br>";

				// Show connect button, and hide disconnect button
				$scope.showConnectButton(true);
			}
		);
	};

	// Show the connect button, and hide the disconnect button by default
	$scope.showConnectButton(true);

	// Hide the log text
	$scope.hideLogText = true;

	// Determine what state the user last had the auto connect toggle set to, and reset
	// it to that state
	if ($localstorage.get('autoConnect', appDefaults.autoConnect) == "true") {
		$scope.autoConnect = true;
	} else {
		$scope.autoConnect = false;
	}

	$ionicPlatform.ready(function() {
		if (typeof navigator.globalization !== "undefined") {
			// Get the preferred language of the users device
			navigator.globalization.getPreferredLanguage(function(language) {
				// Tell the translation frame work to use the users language
				$translate.use(language.value).then(function(data) {
				}, function(error) {
				});
			}, null);
		}
	});

	// Track the interval for updating the signal strength
	var rssiInterval = undefined;

	// Get the Received Signal Strength Indicator of the bluetooth connection
	$scope.getRSSI = function() {
		$cordovaBluetoothSerial.isConnected().then(
			function() {
				// We are connected so get the RSSI
				$cordovaBluetoothSerial.readRSSI().then(
					function(rssi) {
						// Make the RSSI available to the view
						$scope.rssi = rssi;
					},
					function() {
					}
				);
			},
			function() {
				// We aren't connected, so clear the RSSI value
				$scope.rssi = undefined;
			}
		);
	};

	// Function called just before this view is shown
	$scope.$on('$ionicView.beforeEnter', function() {
		// Check whether or not we are connected to the cube
		$scope.checkConnected();

		// Start getting the RSSI of the bluetooth connection every 1/2 second
		rssiInterval = $interval($scope.getRSSI, 500);
	});

	// Function called just after a view is shown
	$scope.$on('$ionicView.afterEnter', function() {
		if ($scope.autoConnect == true) {
			// User wishes to attempt to auto connect, so check current connection status
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					// Connected, so no action required
				},
				function() {
					// Not connected. Attempt to connect
					$scope.connect();
				}
			);
		}
	});

	// Function called after we leave this view
	$scope.$on('$ionicView.leave', function() {
		// Stop getting the RSSI of the bluetooth connection
		$interval.cancel(rssiInterval);

		// Clear the last RSSI value
		$scope.rssi = undefined;
	});

	$scope.autoConnectChanged = function() {
		// Called every time the auto connect toggle is changed

		if ($scope.autoConnect == false) {
			// Auto Connect was previously set to false

			// Enable Auto Connect, and save the users choice
			$scope.autoConnect = true;
			$localstorage.set('autoConnect', 'true');

			// Attempt to connect to the cube, if not already connected
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					// Connected, so no action required
				},
				function() {
					// Not connected. Attempt to connect
					$scope.connect();
				}
			);
		} else {
			// Auto Connect was previously set to true

			// Disable Auto Connect, and save the users choice
			$scope.autoConnect = false;
			$localstorage.set('autoConnect', 'false');
		}
	};
});

// Controller for the 'User Defined Functions' page
app.controller('UserDefinedCtrl', function($ionicPlatform, $scope, $cubeAction, ModalService, ColourService, $cordovaDialogs, UserDefinedService) {
	// Don't show the delete or reordering buttons on the list items by default
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		// Get the list of previously defined user defined functions
		$scope.userDefinedFunctions = UserDefinedService.list();

		// Get the previously selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	$ionicPlatform.ready(function() {
		// Get the list of previously defined user defined functions
		$scope.userDefinedFunctions = UserDefinedService.list();

		// Create placeholder variables for items that will come from a modal window
		$scope.userDefinedFuntionData =	{
											name: '',
											number: '',
											colourRequired: false,
											colour: '',
										};
	});

	// Open the User Defined Functions Modal
	$scope.openModal = function() {
		ModalService.init('templates/userDefinedModal.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Clear any values the client set in the modal window
		$scope.userDefinedFuntionData =	{
											name: '',
											number: '',
											colourRequired: false,
											colour: '',
										};
	});

	$scope.saveUserDefinedFunction = function() {
		// Run from the modal whenever the user wishes to save a new user defined function

		if ($scope.userDefinedFuntionData.name == "") {
			// A name wasn't provided but is required. Prompt the user for one.
			$cordovaDialogs.alert('Please provide a name', 'Error', 'OK');
			return false;
		}
		if (isNaN(parseInt($scope.userDefinedFuntionData.number))) {
			// User defined functions are identified by a number. One was either not provided,
			// or what was provided is not a number. Prompt the user for a valid number
			$cordovaDialogs.alert('Please provide a number that matches the user defined function in the Arduino sketch', 'Error', 'OK');
			return false;
		}

		// Save the item, after retrieving the previously selected colour.
		$scope.userDefinedFuntionData.colour = ColourService.getSelectedColour();
		UserDefinedService.add($scope.userDefinedFuntionData);

		// Hide the modal
		$scope.modal.hide();
	};

	$scope.deleteUserDefinedFunction = function (id) {
		// Delete the selected user defined function
		UserDefinedService.delete(id);
	};

	$scope.reorderUserDefinedFunction = function(item, fromIndex, toIndex) {
		// Reorder how the user defined functions are displayed
		UserDefinedService.reorder(item, fromIndex, toIndex);
	};

	$scope.sendUserDefinedFunction = function (id) {
		// Run when the user selected a user defined function

		// Lookup the details for the user defined function
		$udf = UserDefinedService.get(id);

		// Start to build the message to send to the cube
		var message = "user " + $udf.number;
		if ($udf.colourRequired == true) {
			// Add the colour that was selected if required
			message = message + " " + $udf.colour;
		}

		// Finish the message and send it to the cube, adding it to the history
		message = message + ";";
		$cubeAction.sendMessage(message, true);
	};
});

// Controller for the 'Static Favourites' page
app.controller('StaticCtrl', function($ionicPlatform, $scope, $timeout, $cubeAction, ModalService, $cordovaDialogs, StaticFavouritesService) {
	// Don't show the delete or reordering buttons on the list items by default
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	// Array for the individual commands that make up static favourite
	$scope.staticCommands = [];

	$scope.$on('$ionicView.beforeEnter', function() {
		// Get the list of previously defined static favourites
		$scope.favourites = StaticFavouritesService.list();
	});

	$ionicPlatform.ready(function() {
		// Get the list of previously defined static favourites
		$scope.favourites = StaticFavouritesService.list();

		// Create placeholder variables for items that will come from a modal window
		$scope.staticCommandsData =	{
										name: '',
										cmds: [],
									};
	});

	// Open the Static Favourites Creator Modal
	$scope.openModal = function() {
		ModalService.init('templates/staticCreator.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
		// Clear any values the client set in the modal window
		$scope.staticCommands = [];
		$scope.staticCommandsData =	{
										name: '',
										cmds: [],
									};
	});

	$scope.saveFavourite = function() {
		// Called from the modal when the user wishes to save a static favourite

		if ($scope.staticCommandsData.name == "") {
			// A name wasn't provided but is required, so ask the user for it
			$cordovaDialogs.alert('Please provide a name', 'Error', 'OK');
		} else {
			if ($scope.staticCommandsData.cmds.length == 0) {
				// The user didn't select any commands to include in the favourite, so
				// prompt them to add at least a single command
				$cordovaDialogs.alert('Please select at least 1 item', 'Error', 'OK');
			} else {
				// Save the items the user selected
				StaticFavouritesService.add($scope.staticCommandsData.name, $scope.staticCommandsData.cmds);

				// Close the modal window
				$scope.modal.hide();
			}
		}
	};

	$scope.deleteFavourite = function (id) {
		// Delete the selected static favourite
		StaticFavouritesService.delete(id);
	};

	$scope.reorderFavourites = function(item, fromIndex, toIndex) {
		// Reorder how the static favourites are displayed
		StaticFavouritesService.reorder(item, fromIndex, toIndex);
	};

	$scope.sendFavourite = function (id) {
		// Run when the user selects a static favourite to send to the cube

		// Get the details of the static favourite that the use selected
		var cmds = StaticFavouritesService.get(id);

		for (var i = 0; i < cmds.length; i++) {
			// Get the commands that make up the static favourite
			var cmdToSend = cmds[i].cmd;

			// To work in the loop, I needed to wrap the timeout call in a closure function,
			// and pass the values into it. If I didn't do this, it would only use the last
			// value for all calls.
			(function(cmdToSend, i) {
				$timeout(function() {
					// Send each command that is part of the static favourite to the cube.
					// This is wrapped in a timeout with an increasing but tiny delay before
					// its run to stop the bluetooth stack and the cube from getting swamped
					// and not being able to transmit and process all of the commands
					$cubeAction.sendMessage(cmdToSend, true);
				}, i);
			})(cmdToSend, i);
		}
	};
});

// Controller for the 'History' page
app.controller('HistoryCtrl', function($ionicPlatform, $scope, $cubeAction, HistoryService) {
	// Don't show the delete button on the list items by default
	$scope.data = {
		showDelete: false,
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		// Get the list of previously transmitted commands
		$scope.commands = HistoryService.list();
	});

	$ionicPlatform.ready(function() {
		// Get the list of previously transmitted commands
		$scope.commands = HistoryService.list();
	});

	$scope.replayHistoryItem = function(command) {
		// When the user selects a item from the list, resend it to the command,
		// but don't add it to the history
		$cubeAction.sendMessage(command, false);
	};

	$scope.deleteHistoryItem = function (id) {
		// Delete the selected item from the history
		HistoryService.delete(id);
	};
});

// Controller for the 'Settings' page
app.controller('SettingsCtrl', function($scope, $defaults, $localstorage, $cordovaDialogs, appDefaults) {
	// Track what the maximum number of items we should keep in the history is
	var maxHistoryItems;

	if ($localstorage.get('history_items') != undefined) {
		// Get the previously saved setting for the number of history items
		maxHistoryItems = parseInt($localstorage.get('history_items'));
	} else {
		// No value has been set, so set the default number of history items
		maxHistoryItems = appDefaults.maxHistoryItems;
	}

	// Provide the value for the maximum number of history items to the view
	$scope.data =	{
						'minAllowedHistoryItems': appDefaults.minAllowedHistoryItems,
						'maxHistoryItems': maxHistoryItems,
						'maxAllowedHistoryItems': appDefaults.maxAllowedHistoryItems,
					};

	$scope.setMaxHistoryItems = function(number) {
		// When the user changes the slider for the number of history items, save it
		$localstorage.set('history_items', number);
	};

	$scope.resetColours = function () {
		// Run when the user wishes to reset the colours

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				// User clicked 'OK', so reset the colours
				$defaults.resetColours();
			}
		});
	};

	$scope.resetUserDefinedFunctions = function () {
		// Run when the user wishes to reset the list of user defined functions

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {

				// User clicked 'OK', so reset the user defined functions
				$defaults.resetUserDefinedFunctions();
			}
		});
	};

	$scope.resetStatic = function () {
		// Run when the user wishes to reset the list of static favourites

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {

				// User clicked 'OK', so reset the static favourites
				$defaults.resetStatic();
			}
		});
	};

	$scope.resetHistory = function () {
		// Run when the user wishes to reset the history

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to clear the history?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {

				// User clicked 'OK', so clear the history
				$defaults.resetHistory();
			}
		});
	};

	$scope.resetOthers = function() {
		// Run when the user wishes to reset background settings (items like auto connect)

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to reset background settings?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {

				// User clicked 'OK', so reset the background values
				$defaults.resetOthers();
			}
		});
	};

	$scope.resetAll = function () {
		// Run when the user wishes to reset everything

		// Confirm that they want to reset
		$cordovaDialogs.confirm('Are you sure you want to reset all settings?', 'Reset All', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {

				// User clicked 'OK', so reset everything
				$defaults.resetColours();
				$defaults.resetUserDefinedFunctions();
				$defaults.resetStatic();
				$defaults.resetHistory();
				$defaults.resetOthers();
			}
		});
	};
});

// Controller for the 'About' page
app.controller('AboutCtrl', function($ionicPlatform, $scope, $cordovaDevice, $cordovaAppVersion) {
	$ionicPlatform.ready(function() {
		// Get information about the device
		var device = $cordovaDevice.getDevice();
		$scope.manufacturer = device.manufacturer;
		$scope.model = device.model;
		$scope.platform = device.platform;
		$scope.version = device.version;
		$scope.uuid = device.uuid;

		// Get the apps version and build number
		$cordovaAppVersion.getVersionNumber().then(function (version) {
			$scope.appVersion = version;
		}, false);
		$cordovaAppVersion.getVersionCode().then(function (build) {
			$scope.appBuild = build;
		}, false);

		// Get the preferred language of the device
		if (typeof navigator.globalization !== "undefined") {
			navigator.globalization.getPreferredLanguage(function(language) {
				$scope.language = language.value;
			}, null);
		}
	});
});

// Controller for the 'Colour Picker' modal
app.controller('ColourPickerCtrl', function($ionicPlatform, $scope, ColourService, $localstorage) {
	// Don't show the delete or reordering buttons on the list items by default
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		// Get the initial colour to set the colour selector to
		var initialColour;

		if ($scope.secondaryColourSelector) {
			initialColour = $localstorage.get('otherColour', ColourService.getOtherSelectedColour());
		} else {
			initialColour = $localstorage.get('selectedColour', ColourService.getSelectedColour());
		}

		// Make the colour available to the view
		$scope.hexColour = initialColour;

		// Set the colour selector to the initial colour
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};

		// Make the list of colour favourites available to the view
		$scope.colours = ColourService.list();

		// What for when the user selects a new colour via the colour picker
		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				// The colour has changed so track it

				// The colour is returned as #XXXXXX whereas we don't required the #,
				// so get only the hex part of the colour string
				$scope.hexColour = newValue.substring(1);

				// Save the choice for future reference
				if ($scope.secondaryColourSelector) {
					ColourService.setOtherSelectedColour($scope.hexColour, false);
				} else {
					ColourService.setSelectedColour($scope.hexColour, false);
				}
			}
		});
	});

	$scope.addUserColour = function () {
		// Save the currently selected colour to the favourites list
		ColourService.add($scope.hexColour);
	};

	$scope.deleteUserColour = function (id) {
		// Delete the colour favourite with the provided id.
		ColourService.delete(id);
	};

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		// Reorder the favourite colours list
		ColourService.reorder(item, fromIndex, toIndex);
	};

	$scope.chooseFavouriteColour = function(selectedColour) {
		// Called when the user picks one of the favourite colours from the colour picker modal

		if ($scope.secondaryColourSelector) {
			// This was for the secondary colour, so save its value and pass it to the view
			ColourService.setOtherSelectedColour(selectedColour, true);
			$scope.otherColour = selectedColour;
		} else {
			// This was for the primary colour, so save its value and pass it to the view
			ColourService.setSelectedColour(selectedColour, true);
			$scope.selectedColour = selectedColour;
		}
		// Close the modal window
		$scope.closeModal();
	};
});

// Controller for the 'User Defined Functions' modal
app.controller('UserDefinedModalCtrl', function($ionicPlatform, $scope, ModalService, ColourService) {
	// Don't show the delete or reordering buttons on the list items by default
	$scope.dataModal = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		// Get the users last selected colour
		$scope.selectedColour = ColourService.getSelectedColour();
	});

	// Open the colour picker
	$scope.openModal = function() {
		ModalService.init('templates/colourPicker.html', $scope).then(function(modal) {
			modal.show();
		});
	};

	// Execute action when the modal is hidden (closed)
	$scope.$on('modal.hidden', function() {
		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = ColourService.getSelectedColour();
	});
});

// Controller for the 'Static Favourite Creator' modal
app.controller('StaticCreatorCtrl', function($ionicPlatform, $scope, HistoryService) {
	// When adding items to the array of commands for a static favourite we need to give them an
	// index number / uniqueID, so set the initial starting value
	var uniqueID = 1;

	// Don't show the delete or reordering buttons on the list items by default
	$scope.dataModal = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		// Get the list of history items
		$scope.commands = HistoryService.list();
	});

	$scope.addStaticCommand = function (command) {
		// User wants to add a history item to the static favourite

		// Create a item to add to our array of static favourites,
		// including the current unique ID, and the provided command
		var item =	{
						id: uniqueID,
						cmd: command,
					};

		// Add the new item to the array
		$scope.staticCommands.push(item);

		// Ensure the new array of static favourites is available to the calling view
		$scope.staticCommandsData.cmds = $scope.staticCommands;

		// Increment the uniqueID so that it isn't reused which causes problems
		uniqueID = uniqueID + 1;
	};

	$scope.deleteStaticCommand = function (id) {
		// Delete an item from the array of static favourites
		for (var i in $scope.staticCommands) {
			if ($scope.staticCommands[i].id == id) {
				// We are at the ID of the item to remove, so remove it
				$scope.staticCommands.splice(i, 1);
			}
		}

		// Ensure the new array of static favourites is available to the calling view
		$scope.staticCommandsData.cmds = $scope.staticCommands;
	};

	$scope.reorderStaticCommands = function(item, fromIndex, toIndex) {
		// Reorder the static favourites command list
		$scope.staticCommands.splice(fromIndex, 1);
		$scope.staticCommands.splice(toIndex, 0, item);

		// Ensure the new array of static favourites is available to the calling view
		$scope.staticCommandsData.cmds = $scope.staticCommands;
	};
});
