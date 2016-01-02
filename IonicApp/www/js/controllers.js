angular.module('BlueCube.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

})

.controller('AllCtrl', function($ionicPlatform, $scope, $cubeAction, ColourService, $localstorage) {

  $scope.live = true;
  $scope.useSelectedColourButton = false;

	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		var initialColour = $localstorage.get('selectedColour');
		$scope.hexColour = initialColour;
		initialColour = '#' + initialColour;
		$scope.colour = {targetColor: initialColour};
		$scope.colours = ColourService.list();

		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.hexColour = newValue.substring(1);
				$localstorage.set('selectedColour', $scope.hexColour);
				if ($scope.live == true) {
				  var message = "all " + $scope.hexColour + ";";
				  $cubeAction.sendMessage(message, true);
				}
			}
		});
	});

  $scope.liveChanged = function() {
    if ($scope.live == false) {
      $scope.live = true;
      $scope.useSelectedColourButton = false;
    } else {
      $scope.live = false;
      $scope.useSelectedColourButton = true;
    }
  };

  $scope.sendSelectedColour = function(selectedColour) {
    if (selectedColour == null) {
      selectedColour = $scope.hexColour;
    }
    $localstorage.set('selectedColour', selectedColour);
    var message = "all " + selectedColour + ";";
    $cubeAction.sendMessage(message, true);
  };

	$scope.addUserColour = function () {
		newColour = $scope.hexColour;
		ColourService.add(newColour);
	};

	$scope.deleteUserColour = function (id) {
		ColourService.delete(id);
	}

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		ColourService.reorder(item, fromIndex, toIndex);
	}
})

.controller('ShiftCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('SetCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$scope.cube = [];

	$ionicPlatform.ready(function() {
    $scope.selectedColour = $localstorage.get('selectedColour');

    $scope.setLED = function (id) {
      var colourToUse = "BLACK";
      if ($scope.cube[id] == true) {
        colourToUse = $localstorage.get('selectedColour');
      }

      var message = "";
      switch(id) {
        case 1:
          message = "set 000 " + colourToUse + ";";
          break;
        case 2:
          message = "set 010 " + colourToUse + ";";
          break;
        case 3:
          message = "set 020 " + colourToUse + ";";
          break;
        case 4:
          message = "set 030 " + colourToUse + ";";
          break;
        case 5:
          message = "set 100 " + colourToUse + ";";
          break;
        case 6:
          message = "set 110 " + colourToUse + ";";
          break;
        case 7:
          message = "set 120 " + colourToUse + ";";
          break;
        case 8:
          message = "set 130 " + colourToUse + ";";
          break;
        case 9:
          message = "set 200 " + colourToUse + ";";
          break;
        case 10:
          message = "set 210 " + colourToUse + ";";
          break;
        case 11:
          message = "set 220 " + colourToUse + ";";
          break;
        case 12:
          message = "set 230 " + colourToUse + ";";
          break;
        case 13:
          message = "set 300 " + colourToUse + ";";
          break;
        case 14:
          message = "set 310 " + colourToUse + ";";
          break;
        case 15:
          message = "set 320 " + colourToUse + ";";
          break;
        case 16:
          message = "set 330 " + colourToUse + ";";
          break;
        case 17:
          message = "set 001 " + colourToUse + ";";
          break;
        case 18:
          message = "set 011 " + colourToUse + ";";
          break;
        case 19:
          message = "set 021 " + colourToUse + ";";
          break;
        case 20:
          message = "set 031 " + colourToUse + ";";
          break;
        case 21:
          message = "set 101 " + colourToUse + ";";
          break;
        case 22:
          message = "set 111 " + colourToUse + ";";
          break;
        case 23:
          message = "set 121 " + colourToUse + ";";
          break;
        case 24:
          message = "set 131 " + colourToUse + ";";
          break;
        case 25:
          message = "set 201 " + colourToUse + ";";
          break;
        case 26:
          message = "set 211 " + colourToUse + ";";
          break;
        case 27:
          message = "set 221 " + colourToUse + ";";
          break;
        case 28:
          message = "set 231 " + colourToUse + ";";
          break;
        case 29:
          message = "set 301 " + colourToUse + ";";
          break;
        case 30:
          message = "set 311 " + colourToUse + ";";
          break;
        case 31:
          message = "set 321 " + colourToUse + ";";
          break;
        case 32:
          message = "set 331 " + colourToUse + ";";
          break;
        case 33:
          message = "set 002 " + colourToUse + ";";
          break;
        case 34:
          message = "set 012 " + colourToUse + ";";
          break;
        case 35:
          message = "set 022 " + colourToUse + ";";
          break;
        case 36:
          message = "set 032 " + colourToUse + ";";
          break;
        case 37:
          message = "set 102 " + colourToUse + ";";
          break;
        case 38:
          message = "set 112 " + colourToUse + ";";
          break;
        case 39:
          message = "set 122 " + colourToUse + ";";
          break;
        case 40:
          message = "set 132 " + colourToUse + ";";
          break;
        case 41:
          message = "set 202 " + colourToUse + ";";
          break;
        case 42:
          message = "set 212 " + colourToUse + ";";
          break;
        case 43:
          message = "set 222 " + colourToUse + ";";
          break;
        case 44:
          message = "set 232 " + colourToUse + ";";
          break;
        case 45:
          message = "set 302 " + colourToUse + ";";
          break;
        case 46:
          message = "set 312 " + colourToUse + ";";
          break;
        case 47:
          message = "set 322 " + colourToUse + ";";
          break;
        case 48:
          message = "set 332 " + colourToUse + ";";
          break;
        case 49:
          message = "set 003 " + colourToUse + ";";
          break;
        case 50:
          message = "set 013 " + colourToUse + ";";
          break;
        case 51:
          message = "set 023 " + colourToUse + ";";
          break;
        case 52:
          message = "set 033 " + colourToUse + ";";
          break;
        case 53:
          message = "set 103 " + colourToUse + ";";
          break;
        case 54:
          message = "set 113 " + colourToUse + ";";
          break;
        case 55:
          message = "set 123 " + colourToUse + ";";
          break;
        case 56:
          message = "set 133 " + colourToUse + ";";
          break;
        case 57:
          message = "set 203 " + colourToUse + ";";
          break;
        case 58:
          message = "set 213 " + colourToUse + ";";
          break;
        case 59:
          message = "set 223 " + colourToUse + ";";
          break;
        case 60:
          message = "set 233 " + colourToUse + ";";
          break;
        case 61:
          message = "set 303 " + colourToUse + ";";
          break;
        case 62:
          message = "set 313 " + colourToUse + ";";
          break;
        case 63:
          message = "set 323 " + colourToUse + ";";
          break;
        case 64:
          message = "set 333 " + colourToUse + ";";
          break;
      }
      console.log(id + " " + message);
			$cubeAction.sendMessage(message, true);
    }

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
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

	});
})

.controller('SetPlaneCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('CopyPlaneCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('MovePlaneCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('LineCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('BoxCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('SphereCtrl', function($ionicPlatform, $scope, $cubeAction) {
}

.controller('DeviceCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
	$ionicPlatform.ready(function() {
		// getting device infor from $cordovaDevice
		var device = $cordovaDevice.getDevice();

		$scope.manufacturer = device.manufacturer;
		$scope.model = device.model;
		$scope.platform = device.platform;
		$scope.version = device.version;
		$scope.uuid = device.uuid;
	});
})

.controller('ColourPickerCtrl', function($ionicPlatform, $scope, ColourService, $localstorage) {

	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		var initialColour = $localstorage.get('selectedColour');
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
	}

	$scope.reorderItem = function(item, fromIndex, toIndex) {
		ColourService.reorder(item, fromIndex, toIndex);
	}
})

.controller('PresetsCtrl', function($ionicPlatform, $scope, $cubeAction, $ionicModal, $localstorage) {
	$ionicPlatform.ready(function() {
		$scope.allOn = false;
		$scope.selectedColour = $localstorage.get('selectedColour');

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
			$scope.closeModal();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.selectedColour = $localstorage.get('selectedColour');
		};

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		// All Red
		$scope.allRed = function() {
			var message = "all RED;";
			$cubeAction.sendMessage(message, true);
		};

		// All Hex - Green Colour
		$scope.allHex = function() {
			var message = "all 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		// All Black
		$scope.allBlack = function() {
			var message = "all BLACK;";
			$cubeAction.sendMessage(message, true);
		};

		// SET 000 RED
		$scope.setRed = function() {
			var message = "set 000 RED;";
			$cubeAction.sendMessage(message, true);
		};

		// SET 100 HEX - Green Colour
		$scope.setHex = function() {
			var message = "set 100 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		// Setplane X 2 BLUE;
		$scope.setPlaneBlue = function() {
			var message = "setplane X 2 BLUE;";
			$cubeAction.sendMessage(message, true);
		};

		// Setplane Y 1 Hex - Green;
		$scope.setPlaneHex = function() {
			var message = "setplane Y 1 3DF400;";
			$cubeAction.sendMessage(message, true);
		};

		$scope.allOnChanged = function() {
			if ($scope.allOn == false) {
				$scope.allOn = true;
				$cubeAction.sendMessage("!B11", true);
			} else {
				$scope.allOn = false;
				$cubeAction.sendMessage("!B10", true);
			}
		};

	});
})

.controller('HistoryCtrl', function($ionicPlatform, $scope, $cubeAction, HistoryService, $localstorage) {
	$scope.data = {
		showDelete: false,
		showReordering: false,
	};

	$ionicPlatform.ready(function() {
		$scope.commands = HistoryService.list();
	});

  $scope.replayHistoryItem = function(command) {
    $cubeAction.sendMessage(command, false);
  };

//	$scope.addUserColour = function () {
//		newColour = $scope.hexColour;
//		ColourService.add(newColour);
//	};

	$scope.deleteHistoryItem = function (id) {
		HistoryService.delete(id);
	}

	$scope.reorderHistoryItem = function(item, fromIndex, toIndex) {
		HistoryService.reorder(item, fromIndex, toIndex);
	}
})

.controller('SettingsCtrl', [ '$scope', '$state', function($scope, $state) {

}])

.controller('AboutCtrl', [ '$scope', '$state', function($scope, $state) {

}])

.controller('ConnectionCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading, $localstorage, $ionicSideMenuDelegate) {
	$scope.connectButton = true;
	$scope.disconnectButton = false;

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
			$scope.logText = "Starting Connection Procedures<br>";
			$cordovaBluetoothSerial.isEnabled().then(
				function() {
					// Bluetooth is enabled
					$scope.logText = $scope.logText + "Bluetooth is enabled...<br>";

					// Find possible devices to connect to
					$scope.logText = $scope.logText + "Searching for Bluetooth Devices<br>";
					var bluetoothDeviceID = null;		// Tracker for the device to connect to

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
