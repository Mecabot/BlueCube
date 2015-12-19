angular.module('BlueCube.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

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

.controller('ColourCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, ColourService) {
    var hexColour = null;
    $scope.data = {
      showDelete: false,
      showReordering: false,
    };

    $ionicPlatform.ready(function() {
    	$scope.colour = {targetColor: '#ebebeb'};
    	$scope.colours = ColourService.list();
		$scope.$watchCollection('colour.targetColor', function(newValue, oldValue) {
			if (newValue != oldValue) {
				hexColour = newValue.substring(1);
				var message = "all " + hexColour + ";";
				console.log("Starting " + message);
				$cordovaBluetoothSerial.write(message).then(
					function () {
						console.log(message + " sent");
					},
					function (error) {
						console.log("Error with " + message + " " + error);
					}
				);
				console.log("Finishing " + message);
			}
		});
    });

    $scope.addUserColour = function () {
      newColour = hexColour;
      ColourService.add(newColour);
    };

    $scope.deleteUserColour = function (id) {
      ColourService.delete(id);
    }

    $scope.reorderItem = function(item, fromIndex, toIndex) {
      ColourService.reorder(item, fromIndex, toIndex);
    }
})

.controller('AllCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial) {
    $ionicPlatform.ready(function() {
		$scope.allOn = false;

		// All Red
		$scope.allRed = function() {
			var message = "all RED;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// All Hex - Green Colour
		$scope.allHex = function() {
			var message = "all 3DF400;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// All Black
		$scope.allBlack = function() {
			var message = "all BLACK;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// SET 000 RED
		$scope.setRed = function() {
			var message = "set 000 RED;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// SET 100 HEX - Green Colour
		$scope.setHex = function() {
			var message = "set 100 3DF400;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// Setplane X 2 BLUE;
		$scope.setPlaneBlue = function() {
			var message = "setplane X 2 BLUE;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};

		// Setplane Y 1 Hex - Green;
		$scope.setPlaneHex = function() {
			var message = "setplane Y 1 3DF400;";
			console.log("Starting " + message);
			$cordovaBluetoothSerial.write(message).then(
				function () {
					console.log(message + " sent");
				},
				function (error) {
					console.log("Error with " + message + " " + error);
				}
			);
			console.log("Finishing " + message);
		};


           $scope.allOnChanged = function() {
                if ($scope.allOn == false) {
                    $scope.allOn = true;
                	$cordovaBluetoothSerial.write("!B11").then(
                		function () {
                			console.log("On Sent");
                		},
                		function (error) {
                			console.log("Error On: " + error);
                		}
                	);
                } else {
                    $scope.allOn = false;
                	$cordovaBluetoothSerial.write("!B10").then(
                		function () {
                			console.log("Off Sent");
                		},
                		function (error) {
                			console.log("Error Off: " + error);
                		}
                	);
                }
            };

    });
})

.controller('ConnectionCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading) {
    $ionicPlatform.ready(function() {
    	$scope.$on('$ionicView.enter', function(e) {
    		console.log("On Enter: " + e);
    	});

		$scope.connectButton = false;
		$scope.disconnectButton = false;

		// Functions for showing and hiding the loading overlay
		$scope.show = function() {
    		$ionicLoading.show({
      			template: '<ion-spinner icon="lines" class="spinner-light"></ion-spinner><br>Connecting to BlueCube'
    		});
  		};
  		$scope.hide = function(){
    		$ionicLoading.hide();
  		};

		// Function to Connect to the BlueCube
		$scope.connect = function() {
			$scope.show();
			// Check if Bluetooth is enabled
			$scope.logText = "Starting Bluetooth Test<br>";
			$cordovaBluetoothSerial.isEnabled().then(
				function() {
					// Bluetooth is enabled
					$scope.logText = $scope.logText + "Bluetooth is enabled<br>";

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
										$scope.logText = $scope.logText + "Connected to device " + bluetoothDeviceID + "<br>";
										$scope.connectButton = false;
										$scope.disconnectButton = true;
										$scope.hide();
									},
									function() {
										// Failed to connect
										$scope.logText = $scope.logText + "Failed to connect<br>";
										$scope.connectButton = true;
										$scope.disconnectButton = false;
										$scope.hide();
									}
								);
							} else {
								// No devices found
								$scope.logText = $scope.logText + "No devices found to connect to<br>";
								$scope.connectButton = true;
								$scope.disconnectButton = false;
								$scope.hide();
							}
						},
						function(reason) {
							// Error finding Bluetooth devices.
							$scope.logText = $scope.logText + "Listing Bluetooth Devices Failed: " + reason + "<br>";
							$scope.connectButton = true;
							$scope.disconnectButton = false;
							$scope.hide();
						}
					);

				},
				function() {
					// Bluetooth is not enabled
					$scope.logText = $scope.logText + "Bluetooth is *NOT* enabled<br>";
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
					$scope.logText = $scope.logText + "Disconnected";
					$scope.connectButton = true;
					$scope.disconnectButton = false;
				},
				function(error) {
					$scope.logText = $scope.logText + "Failed to disconnect: " + error + "<br>";
					$scope.disconnectButton = true;
				}
			);
		};

		// Function to setup the state of the view
		$scope.checkConnected = function() {
	    	// Check current connection status
	    	$cordovaBluetoothSerial.isConnected().then(
	    		function() {
	    			$scope.logText = "Bluetooth Connected<br>";
	    			$scope.disconnectButton = true;
	    			$scope.connectButton = false;
	    		},
	    		function() {
	    			$scope.connectButton = true;
	    			$scope.disconnectButton = false;
					//$scope.connect();
	    		}
	    	);
		};

    	// Function called every time this view is shown
    	$scope.$on('$ionicView.beforeEnter', function() {
			$scope.checkConnected();
    	});

		// Call the checkConnected function the first time the view is loaded
		$scope.checkConnected();
    });
});

