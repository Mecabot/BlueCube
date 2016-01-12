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
app.controller('AllCtrl', function($ionicPlatform, $scope, $cubeAction, ColourService, $localstorage) {
	// Get whether the user wishes to send colour updates directly to the cube as they are picked,
	// or whether they want to want until they specifically send the colour.
	if ($localstorage.get('liveAllColourChanges', 'true') == "true") {
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
		var initialColour = $localstorage.get('selectedColour', '00d1ff');

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
				$localstorage.set('selectedColour', $scope.hexColour);

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
app.controller('SetCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	// Array for tracking each of the LEDs in the cube
	$scope.cube = [];

	$ionicPlatform.ready(function() {
		// Get the users last selected colour
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
	});

	// Items for defining and handling the Colour Picker Modal
	$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal
	});

	$scope.openModal = function() {
		// Open the modal window
		$scope.modal.show()
	};

	$scope.closeModal = function() {
		// Close the modal window
		$scope.modal.hide();

		// Get the colour that was selected while the modal window was shown
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
	};

	$scope.$on('$destroy', function() {
		// Remove the modal from the scope, avoiding a memory leak
		$scope.modal.remove();
	});

	$scope.setLED = function (id) {
		// Called when the user clicks on one of the LEDs represented by the grid

		// Default to using black for an LED, unless the user has actually turned it on
		var colourToUse = "BLACK";
		if ($scope.cube[id] == true) {
			// LED was turned on, so get the selected colour
			colourToUse = $localstorage.get('selectedColour', '00d1ff');
		}

		// Build the message to send, translating the LEDs number into it's coordinates, and
		// then submit the message to the cube (adding it to the history)
		var message = "set " + $cubeAction.lookupCoords(id) + " " + colourToUse + ";";
		$cubeAction.sendMessage(message, true);
	};

	$scope.chooseFavouriteColour = function(selectedColour) {
		// Called when the user picks one of the favourite colours from the colour picker modal

		// Sets the selected colour to that of the favourite
		$localstorage.set('selectedColour', selectedColour);
		$scope.selectedColour = selectedColour;

		// Close the modal window
		$scope.closeModal();
	};
});

app.controller('NextCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$scope.cube = [];

	$ionicPlatform.ready(function() {
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');

		$scope.next = function () {
			var colourToUse = $localstorage.get('selectedColour', '00d1ff');
			var message = "next " + colourToUse + ";";
			$cubeAction.sendMessage(message, true);
		};

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});
});

app.controller('SetPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
		$scope.values = {
			axis: 'X',
			offset: '0',
		};
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.setPlane = function() {
		var message = "setplane " + $scope.values.axis + " " + $scope.values.offset + " " + $scope.selectedColour + ";";
		$cubeAction.sendMessage(message, true);
	};
});

app.controller('CopyPlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
		$scope.values = {
			axis: 'X',
			fromOffset: '0',
			toOffset: '1',
		};
	});

	$scope.copyPlane = function() {
		var message = "copyplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + ";";
		$cubeAction.sendMessage(message, true);
	};
})

.controller('MovePlaneCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
		$scope.values = {
			axis: 'X',
			fromOffset: '0',
			toOffset: '1',
		};
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.movePlane = function() {
		var message = "moveplane " + $scope.values.axis + " " + $scope.values.fromOffset + " " + $scope.values.toOffset + " " + $scope.selectedColour + ";";
		$cubeAction.sendMessage(message, true);
	};
});

app.controller('LineCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];

	$ionicPlatform.ready(function() {
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.drawLine = function() {
		var message = "line ";
		var selected = 0;
		for (i = 0; i <= 64; i++) {
			if ($scope.cube[i] == true) {
				selected = selected + 1;
				message = message + $cubeAction.lookupCoords(i) + " ";
			}
		}

		if (selected == 2) {
			// Clear the selected points
			for (i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			// Draw the line
			message = message + $localstorage.get('selectedColour', '00d1ff') + ";";
			$cubeAction.sendMessage(message, true);
		} else {
			// Tell them to pick again
			$cordovaDialogs.alert('Please select only 2 points', 'Line', 'OK');
		}
	};
});

app.controller('BoxCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];
	var secondaryColourSelector = false;
	var cachedColour = "";

	$ionicPlatform.ready(function() {
		$scope.style = {
			boxStyle: '0',
		};
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		$scope.otherColour = $localstorage.get('otherColour', 'f80ed1');
		$scope.showSecontaryColour = false;

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModalPrimary = function() {
			secondaryColourSelector = false;
			$scope.modal.show()
		};

		$scope.openModalSecondary = function() {
			secondaryColourSelector = true;
			cachedColour = $localstorage.get('selectedColour', '00d1ff');
			var otherColour = $localstorage.get('otherColour', 'f80ed1');
			$localstorage.set('selectedColour', otherColour);
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			if (secondaryColourSelector) {
				$localstorage.set('otherColour', selectedColour);
				$scope.otherColour = selectedColour;
			} else {
				$localstorage.set('selectedColour', selectedColour);
				$scope.selectedColour = selectedColour;
			}
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			if (secondaryColourSelector) {
				$scope.otherColour = $localstorage.get('selectedColour', '00d1ff');
				$localstorage.set('selectedColour', cachedColour);
				$localstorage.set('otherColour', $scope.otherColour);
			} else {
				$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
			}
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.styleSelection = function() {
		if (parseInt($scope.style.boxStyle) <= 2) {
			$scope.showSecontaryColour = false;
		} else {
			$scope.showSecontaryColour = true;
		}
	};

	$scope.drawBox = function() {
		var message = "box ";
		var selected = 0;
		for (i = 0; i <= 64; i++) {
			if ($scope.cube[i] == true) {
				selected = selected + 1;
				message = message + $cubeAction.lookupCoords(i) + " ";
			}
		}

		if (selected == 2) {
			// Clear the selected points
			for (i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			message = message + $localstorage.get('selectedColour', '00d1ff') + " " + $scope.style.boxStyle;
			if (parseInt($scope.style.boxStyle) <= 2) {
				message = message + ";";
				$cubeAction.sendMessage(message, true);
			} else {
				message = message + " " + $localstorage.get('otherColour', 'f80ed1') + ";";
				$cubeAction.sendMessage(message, true);
			}
		} else {
			// Tell them to pick again
			$cordovaDialogs.alert('Please select only 2 points', 'Box', 'OK');
		}
	};
});

app.controller('SphereCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs) {
	$scope.cube = [];
	var secondaryColourSelector = false;
	var cachedColour = "";

	$ionicPlatform.ready(function() {
		$scope.style = {
			sphereStyle: '0',
			sphereSize: '3',
		};
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		$scope.otherColour = $localstorage.get('otherColour', 'f80ed1');
		$scope.showSecontaryColour = false;

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModalPrimary = function() {
		  secondaryColourSelector = false;
			$scope.modal.show()
		};

		$scope.openModalSecondary = function() {
			secondaryColourSelector = true;
			cachedColour = $localstorage.get('selectedColour', '00d1ff');
			var otherColour = $localstorage.get('otherColour', 'f80ed1');
			$localstorage.set('selectedColour', otherColour);
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			if (secondaryColourSelector) {
				$localstorage.set('otherColour', selectedColour);
				$scope.otherColour = selectedColour;
			} else {
				$localstorage.set('selectedColour', selectedColour);
				$scope.selectedColour = selectedColour;
			}
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			if (secondaryColourSelector) {
				$scope.otherColour = $localstorage.get('selectedColour', '00d1ff');
				$localstorage.set('selectedColour', cachedColour);
				$localstorage.set('otherColour', $scope.otherColour);
			} else {
				$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
			}
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});

	$scope.styleSelection = function() {
		if (parseInt($scope.style.sphereStyle) == 0) {
			$scope.showSecontaryColour = false;
		} else {
				$scope.showSecontaryColour = true;
		}
	};

	$scope.drawSphere = function() {
		var message = "sphere ";
		var selected = 0;
		for (i = 0; i <= 64; i++) {
			if ($scope.cube[i] == true) {
				selected = selected + 1;
				message = message + $cubeAction.lookupCoords(i) + " ";
			}
		}

		if (selected == 1) {
			// Clear the selected points
			for (i = 0; i <= 64; i++) {
				$scope.cube[i] = null;
			}

			message = message + " " + $scope.style.sphereSize + " " + $localstorage.get('selectedColour', '00d1ff');
			if (parseInt($scope.style.sphereStyle) == 0) {
				message = message + ";";
				$cubeAction.sendMessage(message, true);
			} else {
				message = message + " " + $localstorage.get('otherColour', 'f80ed1') + ";";
				$cubeAction.sendMessage(message, true);
			}
		} else {
			// Tell them to pick again
			$cordovaDialogs.alert('Please select only 1 point', 'Sphere', 'OK');
		}
	};
});

app.controller('ConnectCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading, $localstorage, $ionicSideMenuDelegate, $translate) {
	$scope.connectButton = true;
	$scope.disconnectButton = false;
	$scope.hideLogText = true;

	if ($localstorage.get('autoConnect') == "true") {
		$scope.autoConnect = true;
	} else {
		$scope.autoConnect = false;
	}

	// Function called every time this view is shown
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.checkConnected();
	});

	$scope.$on('$ionicView.afterEnter', function() {
		if ($scope.autoConnect == true) {
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					// Yep - do nothing
				},
				function() {
					$scope.connect();
				}
			);
		}
	});

	$ionicPlatform.ready(function() {
		if (typeof navigator.globalization !== "undefined") {
			navigator.globalization.getPreferredLanguage(function(language) {
				$translate.use(language.value).then(function(data) {
				}, function(error) {
				});
			}, null);
		}
	});

	$scope.autoConnectChanged = function() {
		if ($scope.autoConnect == false) {
			$scope.autoConnect = true;
			$localstorage.set('autoConnect', 'true');
			$cordovaBluetoothSerial.isConnected().then(
				function() {
					// Yep - do nothing
				},
				function() {
					$scope.connect();
				}
			);
		} else {
			$scope.autoConnect = false;
			$localstorage.set('autoConnect', 'false');
		}
	};

	// Functions for showing and hiding the loading overlay
	$scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="lines" class="spinner-light"></ion-spinner><br>Connecting to BlueCube'
		});
	};

	$scope.hide = function() {
		$ionicLoading.hide();
	};

	// Function to Connect to the BlueCube
	$scope.connect = function() {
		$scope.show();

		// Check if Bluetooth is enabled
		$scope.hideLogText = false;
		$scope.logText = "Starting Connection Procedures<br>";
		$cordovaBluetoothSerial.isEnabled().then(
			function() {
				// Bluetooth is enabled
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
									// Connected
									$localstorage.set('bluetoothUUID', bluetoothDeviceID);
									$scope.logText = "BlueCube (" + bluetoothDeviceID + ") is Connected<br>";
									$scope.connectButton = false;
									$scope.disconnectButton = true;
									$scope.hide();
									$ionicSideMenuDelegate.toggleLeft();
								},
								function() {
									// Failed to connect
									$scope.logText = "ERROR: Failed to connect to BlueCube (" + bluetoothDeviceID + ")<br>";
									$scope.connectButton = true;
									$scope.disconnectButton = false;
									$scope.hide();
								}
							);
						} else {
							// No devices found
							$scope.logText = "Error: No BlueCube found to connect to<br>";
							$scope.connectButton = true;
							$scope.disconnectButton = false;
							$scope.hide();
						}
					},
					function(reason) {
						// Error finding Bluetooth devices.
						$scope.logText = "ERROR: Listing Bluetooth Devices Failed: " + reason + "<br>";
						$scope.connectButton = true;
						$scope.disconnectButton = false;
						$scope.hide();
					}
				);

			},
			function() {
				// Bluetooth is not enabled
				$scope.logText = "ERROR: Bluetooth is *NOT* enabled. Please enable it and try again.<br>";
				$scope.connecyButton = false;
				$scope.disconnectButton = false;
				$scope.hide();
			}
		);
	};

	// Function to Disconnect from the BlueCube
	$scope.disconnect = function() {
		$cordovaBluetoothSerial.disconnect().then(
			function() {
				$scope.logText = "Disconnected from BlueCube (" + $localstorage.get('bluetoothUUID') + ")<br>";
				$scope.connectButton = true;
				$scope.disconnectButton = false;
			},
			function(error) {
				$scope.logText = "ERROR: Failed to disconnect: " + error + "<br>";
				$scope.disconnectButton = true;
			}
		);
	};

	// Function to setup the state of the view
	$scope.checkConnected = function() {
		// Check current connection status
		$cordovaBluetoothSerial.isConnected().then(
			function() {
				$scope.logText = "BlueCube (" + $localstorage.get('bluetoothUUID') + ") is Connected<br>";
				$scope.disconnectButton = true;
				$scope.connectButton = false;
			},
			function() {
				$scope.logText = "Not connected to a BlueCube<br>";
				$scope.connectButton = true;
				$scope.disconnectButton = false;
				//$scope.connect();
			}
		);
	};
});

app.controller('UserDefinedCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs, UserDefinedService) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.userDefinedFunctions = UserDefinedService.list();
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
	});

	$ionicPlatform.ready(function() {
		$scope.userDefinedFunctions = UserDefinedService.list();
		$scope.userDefinedFuntionData = {};
		$scope.userDefinedFuntionData.name = '';
		$scope.userDefinedFuntionData.number = '';
		$scope.userDefinedFuntionData.colourRequired = false;
		$scope.userDefinedFuntionData.colour = '';

		$ionicModal.fromTemplateUrl('templates/userDefinedModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			$scope.userDefinedFuntionData.name = '';
			$scope.userDefinedFuntionData.number = '';
			$scope.userDefinedFuntionData.colourRequired = false;
			$scope.userDefinedFuntionData.colour = '';
		});

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		$scope.saveUserDefinedFunction = function() {
			if ($scope.userDefinedFuntionData.name == "") {
				$cordovaDialogs.alert('Please provide a name', 'Error', 'OK');
				return false;
			}
			if (isNaN(parseInt($scope.userDefinedFuntionData.number))) {
				$cordovaDialogs.alert('Please provide a number that matches the user defined function in the Arduino sketch', 'Error', 'OK');
				return false;
			}

			// Add the item
			$scope.userDefinedFuntionData.colour = $localstorage.get('selectedColour', '00d1ff');
			UserDefinedService.add($scope.userDefinedFuntionData);
			$scope.modal.hide();
		};

		$scope.deleteFavourite = function (id) {
			UserDefinedService.delete(id);
		};

		$scope.reorderFavourites = function(item, fromIndex, toIndex) {
			UserDefinedService.reorder(item, fromIndex, toIndex);
		};

		$scope.sendUDF = function (id) {
			$udf = UserDefinedService.get(id);
			var message = "user " + $udf.number;
			if ($udf.colourRequired == true) {
				message = message + " " + $udf.colour;
			}
			message = message + ";";
			$cubeAction.sendMessage(message, true);
		};
	});
});

app.controller('StaticCtrl', function($ionicPlatform, $scope, $timeout, $cubeAction, $ionicModal, $localstorage, $cordovaDialogs, StaticFavouritesService) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$scope.staticCommands = [];

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.favourites = StaticFavouritesService.list();
	});

	$ionicPlatform.ready(function() {
		$scope.favourites = StaticFavouritesService.list();
		$scope.staticCommandsData = {};
		$scope.staticCommandsData.name = '';
		$scope.staticCommandsData.cmds = [];
		$scope.saveButton = false;

		$ionicModal.fromTemplateUrl('templates/staticCreator.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			$scope.staticCommands = [];
			$scope.staticCommandsData.name = '';
			$scope.staticCommandsData.cmds = [];
			$scope.saveButton = false;
		});

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		$scope.saveFavourite = function() {
			if ($scope.staticCommandsData.name == "") {
				$cordovaDialogs.alert('Please provide a name', 'Error', 'OK');
			} else {
				if ($scope.staticCommandsData.cmds.length == 0) {
					$cordovaDialogs.alert('Please select at least 1 item', 'Error', 'OK');
				} else {
					StaticFavouritesService.add($scope.staticCommandsData.name, $scope.staticCommandsData.cmds);
					$scope.modal.hide();
				}
			}
		};

		$scope.deleteFavourite = function (id) {
			StaticFavouritesService.delete(id);
		};

		$scope.reorderFavourites = function(item, fromIndex, toIndex) {
			StaticFavouritesService.reorder(item, fromIndex, toIndex);
		};

		$scope.sendFavourite = function (id) {
			$cmds = StaticFavouritesService.get(id);

			for (i = 0; i < $cmds.length; i++) {
				cmdToSend = $cmds[i].cmd;

				// To work in the loop, I needed to wrap the timeout call in a closure function,
				// and pass the values into it. If I didn't do this, it would only use the last
				// value for all calls.
				(function(cmdToSend, i) {
					$timeout(function() {
						$cubeAction.sendMessage(cmdToSend, true);
					}, i);
				})(cmdToSend, i);
			}
		};
	});
});

app.controller('HistoryCtrl', function($ionicPlatform, $scope, $cubeAction, HistoryService, $localstorage) {
	$scope.data = {
		showDelete: false,
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.commands = HistoryService.list();
	});

	$ionicPlatform.ready(function() {
		$scope.commands = HistoryService.list();
	});

	$scope.replayHistoryItem = function(command) {
		$cubeAction.sendMessage(command, false);
	};

	$scope.deleteHistoryItem = function (id) {
		HistoryService.delete(id);
	};
});

app.controller('SettingsCtrl', function($scope, $defaults, $localstorage, $cordovaDialogs) {
	var maxHistoryItems;

	if ($localstorage.get('history_items') != undefined) {
		maxHistoryItems = parseInt($localstorage.get('history_items'));
	} else {
		maxHistoryItems = 100;
	}

	$scope.data = {'maxHistoryItems': maxHistoryItems};

	$scope.setMaxHistoryItems = function(number) {
		$localstorage.set('history_items', number);
	};

	$scope.resetColours = function () {
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetColours();
			}
		});
	};

	$scope.resetUserDefinedFunctions = function () {
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetUserDefinedFunctions();
			}
		});
	};

	$scope.resetStatic = function () {
		$cordovaDialogs.confirm('Are you sure you want to reset to the default values?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetStatic();
			}
		});
	};

	$scope.resetHistory = function () {
		$cordovaDialogs.confirm('Are you sure you want to clear the history?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetHistory();
			}
		});
	};

	$scope.resetOthers = function() {
		$cordovaDialogs.confirm('Are you sure you want to reset background settings?', 'Reset', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetOthers();
			}
		});
	};

	$scope.resetAll = function () {
		$cordovaDialogs.confirm('Are you sure you want to reset all settings?', 'Reset All', ['Cancel','OK']).then(function(buttonIndex) {
			if (buttonIndex == 2) {
				$defaults.resetColours();
				$defaults.resetUserDefinedFunctions();
				$defaults.resetStatic();
				$defaults.resetHistory();
				$defaults.resetOthers();
			}
		});
	};
});

app.controller('AboutCtrl', function($ionicPlatform, $scope, $cordovaDevice, $cordovaAppVersion) {
	$ionicPlatform.ready(function() {
		// getting device info from $cordovaDevice
		var device = $cordovaDevice.getDevice();

		$scope.manufacturer = device.manufacturer;
		$scope.model = device.model;
		$scope.platform = device.platform;
		$scope.version = device.version;
		$scope.uuid = device.uuid;

		$cordovaAppVersion.getVersionNumber().then(function (version) {
			$scope.appVersion = version;
		}, false);
		$cordovaAppVersion.getVersionCode().then(function (build) {
			$scope.appBuild = build;
		}, false);

		if (typeof navigator.globalization !== "undefined") {
			navigator.globalization.getPreferredLanguage(function(language) {
				$scope.language = language.value;
			}, null);
		}
	});
});

app.controller('ColourPickerCtrl', function($ionicPlatform, $scope, ColourService, $localstorage) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		var initialColour = $localstorage.get('selectedColour', '00d1ff');
		$scope.hexColour = initialColour;
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};
		$scope.colours = ColourService.list();

		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.hexColour = newValue.substring(1);
				$localstorage.set('selectedColour', $scope.hexColour);
			}
		});
	});

	$scope.addUserColour = function () {
		newColour = $scope.hexColour;
		ColourService.add(newColour);
	};

	$scope.deleteUserColour = function (id) {
		ColourService.delete(id);
	};

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		ColourService.reorder(item, fromIndex, toIndex);
	};
});

app.controller('UserDefinedModalCtrl', function($ionicPlatform, $scope, $ionicModal, $localstorage) {
	$scope.dataModal = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');

		$ionicModal.fromTemplateUrl('templates/colourPicker.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal
		});

		$scope.openModal = function() {
			$scope.modal.show()
		};

		$scope.chooseFavouriteColour = function(selectedColour) {
			$localstorage.set('selectedColour', selectedColour);
			$scope.selectedColour = selectedColour;
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour', '00d1ff');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	});
});

app.controller('StaticCreatorCtrl', function($ionicPlatform, $scope, HistoryService, $localstorage) {
	var uniqueID = 1;


	$scope.dataModal = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		$scope.commands = HistoryService.list();
	});

	$scope.showSaveButton = function () {
		if ($scope.staticCommands.length >= 1) {
			$scope.saveButton = true;
		} else {
			$scope.saveButton = false;
		}
	};

	$scope.addStaticCommand = function (command) {
	var item =	{
					id: uniqueID,
					cmd: command,
				};

		uniqueID = uniqueID + 1;
		$scope.staticCommands.push(item);
		$scope.staticCommandsData.cmds = $scope.staticCommands;
		$scope.showSaveButton();
	};

	$scope.deleteStaticCommand = function (id) {
		for (i in $scope.staticCommands) {
			if ($scope.staticCommands[i].id == id) {
				$scope.staticCommands.splice(i, 1);
			}
		}
		$scope.staticCommandsData.cmds = $scope.staticCommands;
		$scope.showSaveButton();
	};

	$scope.reorderStaticCommands = function(item, fromIndex, toIndex) {
		$scope.staticCommands.splice(fromIndex, 1);
		$scope.staticCommands.splice(toIndex, 0, item);
		$scope.staticCommandsData.cmds = $scope.staticCommands;
	};
});
