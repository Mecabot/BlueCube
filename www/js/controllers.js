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

.controller('ConnectionCtrl', function($ionicPlatform, $scope, $cordovaBluetoothSerial, $ionicLoading) {
    $ionicPlatform.ready(function() {
		
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

